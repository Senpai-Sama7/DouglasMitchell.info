import { timingSafeEqual } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getLogger } from '@/lib/log'

const logger = getLogger('auth')

const DEFAULT_HEADER = 'x-api-key'

type ApiKeySuccess = {
  ok: true
  secret: string
  headerName: string
}

type ApiKeyFailure = {
  ok: false
  response: NextResponse
}

export type ApiKeyResult = ApiKeySuccess | ApiKeyFailure

export interface RequireApiKeyOptions {
  headerName?: string
  envVar?: string
  envVars?: string[]
  audience?: string
  allowQueryParam?: boolean
}

function buildJsonResponse(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, { status })
}

function buildUnauthorizedResponse(reason: string, headerName: string) {
  return buildJsonResponse(401, {
    error: reason,
    code: 'API_KEY_REQUIRED',
    details: { header: headerName }
  })
}

function resolveSecret(envVars: string[]): { name: string; value: string } | null {
  for (const name of envVars) {
    if (!name) continue
    const value = process.env[name]
    if (value) {
      return { name, value }
    }
  }
  return null
}

function readProvidedKey(request: NextRequest, headerName: string, allowQuery: boolean) {
  const headerValue = request.headers.get(headerName)
  if (headerValue) return headerValue
  if (allowQuery) {
    return request.nextUrl?.searchParams?.get(headerName) ?? null
  }
  return null
}

export function requireApiKey(request: NextRequest, options: RequireApiKeyOptions): ApiKeyResult {
  const headerName = (options.headerName ?? DEFAULT_HEADER).toLowerCase()
  const audience = options.audience ?? 'default'

  const envCandidates = [options.envVar, ...(options.envVars ?? [])].filter(Boolean) as string[]
  if (envCandidates.length === 0) {
    logger.error({
      event: 'auth.api_key.config_missing',
      message: 'No environment variables supplied for API key validation.',
      audience,
      headerName
    })
    return {
      ok: false,
      response: buildJsonResponse(500, {
        error: 'Server authentication misconfigured',
        code: 'API_KEY_NOT_CONFIGURED'
      })
    }
  }

  const secret = resolveSecret(envCandidates)
  if (!secret) {
    logger.error({
      event: 'auth.api_key.env_missing',
      message: 'None of the supplied environment variables are set.',
      envVars: envCandidates,
      audience,
      headerName
    })
    return {
      ok: false,
      response: buildJsonResponse(500, {
        error: 'Server authentication misconfigured',
        code: 'API_KEY_NOT_CONFIGURED'
      })
    }
  }

  const provided = readProvidedKey(request, headerName, options.allowQueryParam ?? false)
  if (!provided) {
    logger.warn({
      event: 'auth.api_key.missing_header',
      message: 'Request missing API key.',
      headerName,
      audience
    })
    return { ok: false, response: buildUnauthorizedResponse('Missing API key header', headerName) }
  }

  const providedBuffer = Buffer.from(provided, 'utf8')
  const expectedBuffer = Buffer.from(secret.value, 'utf8')

  if (providedBuffer.length !== expectedBuffer.length) {
    logger.warn({
      event: 'auth.api_key.length_mismatch',
      message: 'Provided API key length mismatch.',
      headerName,
      audience,
      envVar: secret.name
    })
    return { ok: false, response: buildUnauthorizedResponse('Invalid API key', headerName) }
  }

  if (!timingSafeEqual(providedBuffer, expectedBuffer)) {
    logger.warn({
      event: 'auth.api_key.invalid',
      message: 'Provided API key failed validation.',
      headerName,
      audience,
      envVar: secret.name
    })
    return { ok: false, response: buildUnauthorizedResponse('Invalid API key', headerName) }
  }

  return { ok: true, secret: secret.value, headerName }
}
