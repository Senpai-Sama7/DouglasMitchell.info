// app/api/revalidate/route.ts
import { NextResponse, NextRequest } from 'next/server'
import { revalidatePath } from 'next/cache'
import { timingSafeEqual } from 'crypto'

type Body = {
  token?: string
  path?: string
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body

    const token = body?.token ?? req.nextUrl.searchParams.get('token') ?? ''
    const secret = process.env.REVALIDATE_TOKEN ?? ''

    if (!secret) {
      return NextResponse.json(
        { status: 'ERROR', reason: 'REVALIDATE_TOKEN not set' },
        { status: 500 }
      )
    }
    if (!token) {
      return NextResponse.json(
        { status: 'UNVERIFIED', reason: 'Missing token' },
        { status: 401 }
      )
    }

    const tokenBuffer = Buffer.from(token)
    const secretBuffer = Buffer.from(secret)

    if (
      tokenBuffer.length !== secretBuffer.length ||
      !timingSafeEqual(tokenBuffer, secretBuffer)
    ) {
      return NextResponse.json(
        { status: 'UNVERIFIED', reason: 'Invalid token' },
        { status: 401 }
      )
    }

    // Normalize once — don’t redeclare it later
    const rawPath = body?.path ?? '/'
    const normalizedPath = rawPath.startsWith('/') ? rawPath : `/${rawPath}`

    // Allow-list of safe prefixes to revalidate
    const allowedPrefixes = [
      '/',
      '/dispatches',
      '/media',
      '/about',
      '/contact',
      '/resume',
    ]
    const isAllowed = allowedPrefixes.some(
      (prefix) =>
        normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`)
    )
    if (!isAllowed) {
      return NextResponse.json(
        { status: 'UNVERIFIED', reason: 'Path not allowed' },
        { status: 400 }
      )
    }

    revalidatePath(normalizedPath)

    return NextResponse.json(
      { status: 'OK', revalidated: true, path: normalizedPath },
      { status: 200 }
    )
  } catch (err) {
    return NextResponse.json(
      { status: 'ERROR', reason: 'Invalid JSON body' },
      { status: 400 }
    )
  }
}
