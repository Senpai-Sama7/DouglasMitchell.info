import { randomUUID } from 'node:crypto'
import { performance } from 'node:perf_hooks'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { z } from 'zod'
import { getLogger } from '@/lib/log'
import { incrementMetric, recordDurationMetric } from '@/lib/metrics'
import { requireApiKey } from '@/lib/auth'

export const dynamic = 'force-dynamic'

const logger = getLogger('api.subscribe')

// Validation schema
const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required').max(120, 'Name too long'),
  context: z.string().min(10, 'Please provide a bit more context.').max(2000, 'Context too long'),
  source: z.string().optional().default('website')
})

interface SubscribeSuccessResponse {
  success: true
  message: string
  meta: {
    requestId: string
    timestamp: string
    durationMs: number
  }
}

interface SubscribeErrorResponse {
  success: false
  error: string
  code: string
  requestId: string
  timestamp: string
  details?: Record<string, unknown>
}

const redisClient = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN
    })
  : null

const ratelimit = redisClient
  ? new Ratelimit({
      redis: redisClient,
      limiter: Ratelimit.slidingWindow(5, '1 m'),
      analytics: true,
      prefix: 'subscribe'
    })
  : null

const fallbackRateLimitMap: Map<string, { count: number; resetTime: number }> =
  (globalThis as any).__subscribeFallbackMap ?? new Map()

if (!(globalThis as any).__subscribeFallbackMap) {
  ;(globalThis as any).__subscribeFallbackMap = fallbackRateLimitMap
}
const FALLBACK_WINDOW_MS = 60_000
const FALLBACK_LIMIT = 5

function fallbackRateLimit(ip: string) {
  const now = Date.now()
  const entry = fallbackRateLimitMap.get(ip)

  if (!entry || now >= entry.resetTime) {
    fallbackRateLimitMap.set(ip, { count: 1, resetTime: now + FALLBACK_WINDOW_MS })
    return { allowed: true as const, remaining: FALLBACK_LIMIT - 1, reset: now + FALLBACK_WINDOW_MS }
  }

  if (entry.count >= FALLBACK_LIMIT) {
    return { allowed: false as const, remaining: 0, reset: entry.resetTime }
  }

  entry.count += 1
  return { allowed: true as const, remaining: FALLBACK_LIMIT - entry.count, reset: entry.resetTime }
}

function extractClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown'
  }
  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }
  return 'unknown'
}

async function applyRateLimit(request: NextRequest) {
  const ip = extractClientIp(request)

  if (ratelimit) {
    const result = await ratelimit.limit(ip)
    if (!result.success) {
      return {
        allowed: false as const,
        remaining: result.remaining,
        reset: result.reset,
        ip
      }
    }
    return {
      allowed: true as const,
      remaining: result.remaining,
      reset: result.reset,
      ip
    }
  }

  const fallback = fallbackRateLimit(ip)
  if (!fallback.allowed) {
    logger.warn({
      event: 'subscription.rate_limit.fallback',
      message: 'Upstash redis not configured; using in-memory limiter.',
      ip
    })
  }
  return { allowed: fallback.allowed, remaining: fallback.remaining, reset: fallback.reset, ip }
}

function buildSubscriptionEmail(data: z.infer<typeof subscribeSchema>, requestId: string) {
  return `<!doctype html>
<html>
  <body style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color:#111;">
    <h2 style="margin-bottom:16px;">New portfolio subscription</h2>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Source:</strong> ${data.source}</p>
    <p><strong>Context:</strong></p>
    <p style="white-space:pre-wrap; background:#f5f5f5; padding:12px; border-radius:8px;">${data.context}</p>
    <p style="margin-top:24px; font-size:12px; color:#666;">Request ID: ${requestId}</p>
  </body>
</html>`
}

async function sendSubscriptionEmail(data: z.infer<typeof subscribeSchema>, requestId: string) {
  const apiKey = process.env.RESEND_API_KEY
  const toAddress = process.env.SUBSCRIBE_FORWARD_TO ?? process.env.RESEND_TEST_RECIPIENT ?? ''

  if (!apiKey || !toAddress) {
    logger.warn({
      event: 'subscription.email.skipped',
      message: 'Email notification skipped due to missing configuration.',
      hasApiKey: Boolean(apiKey),
      toAddress
    })
    return
  }

  const resend = new Resend(apiKey)
  const fromAddress = process.env.RESEND_FROM_EMAIL ?? 'notifications@douglasmitchell.info'

  await resend.emails.send({
    from: fromAddress,
    to: toAddress,
    subject: 'New portfolio subscription',
    html: buildSubscriptionEmail(data, requestId)
  })
}

export async function POST(request: NextRequest) {
  const requestId = randomUUID()
  const startedAt = performance.now()
  const timestamp = new Date().toISOString()

  try {
    const authResult = requireApiKey(request, {
      envVar: 'SUBSCRIBE_API_KEY',
      envVars: ['SUBSCRIBE_API_KEY', 'NEXT_PUBLIC_SUBSCRIBE_API_KEY'],
      audience: 'subscribe'
    })

    if (!authResult.ok) {
      return authResult.response
    }

    // Rate limiting
    const rateLimitResult = await applyRateLimit(request)

    if (!rateLimitResult.allowed) {
      incrementMetric('axiom_subscribe_rate_limited_total')
      logger.warn({
        event: 'subscription.rate_limited',
        requestId,
        ip: rateLimitResult.ip,
        resetTime: rateLimitResult.reset
      })

      const errorResponse: SubscribeErrorResponse = {
        success: false,
        error: 'Rate limit exceeded',
        code: 'RATE_LIMIT_EXCEEDED',
        requestId,
        timestamp,
        details: { resetTime: rateLimitResult.reset }
      }

      return NextResponse.json(errorResponse, {
        status: 429,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'X-Request-ID': requestId,
          'Retry-After': rateLimitResult.reset
            ? Math.max(0, Math.ceil((rateLimitResult.reset - Date.now()) / 1000)).toString()
            : '60'
        }
      })
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = subscribeSchema.parse(body)

    // Send subscription email
    await sendSubscriptionEmail(validatedData, requestId)

    const durationMs = Number((performance.now() - startedAt).toFixed(2))
    incrementMetric('axiom_subscribe_success_total')
    logger.info({
      event: 'subscription.success',
      requestId,
      durationMs,
      email: validatedData.email,
      source: validatedData.source,
      contextLength: validatedData.context.length
    })

    const response: SubscribeSuccessResponse = {
      success: true,
      message: 'Successfully subscribed! Check your email for confirmation.',
      meta: {
        requestId,
        timestamp,
        durationMs
      }
    }

    return NextResponse.json(response, {
      status: 201,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Request-ID': requestId
      }
    })

  } catch (error) {
    const durationMs = Number((performance.now() - startedAt).toFixed(2))

    if (error instanceof z.ZodError) {
      incrementMetric('axiom_subscribe_validation_error_total')
      logger.warn({
        event: 'subscription.validation_error',
        requestId,
        durationMs,
        errors: error.issues
      })

      const errorResponse: SubscribeErrorResponse = {
        success: false,
        error: 'Invalid request data',
        code: 'VALIDATION_ERROR',
        requestId,
        timestamp,
        details: { errors: error.issues }
      }

      return NextResponse.json(errorResponse, {
        status: 400,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'X-Request-ID': requestId
        }
      })
    }

    incrementMetric('axiom_subscribe_failure_total')
    logger.error({
      event: 'subscription.failure',
      requestId,
      durationMs,
      error
    })

    const errorResponse: SubscribeErrorResponse = {
      success: false,
      error: 'Failed to process subscription',
      code: 'SUBSCRIPTION_ERROR',
      requestId,
      timestamp
    }

    return NextResponse.json(errorResponse, {
      status: 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Request-ID': requestId
      }
    })
  } finally {
    recordDurationMetric('axiom_subscribe_duration_ms', startedAt)
  }
}
