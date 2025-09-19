import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET
  const body = await request.json().catch(() => ({})) as { path?: string; token?: string }

  if (!secret || body.token !== secret) {
    return NextResponse.json({ status: 'UNVERIFIED', reason: 'Invalid or missing token' }, { status: 401 })
  }

  const path = body.path ?? '/'

  try {
    revalidatePath(path)
  } catch (error) {
    console.error('Revalidate trigger failed', error)
    return NextResponse.json({ status: 'UNVERIFIED', reason: 'Revalidate invocation failed' }, { status: 500 })
  }

  return NextResponse.json({ status: 'VERIFIED', path })
}
