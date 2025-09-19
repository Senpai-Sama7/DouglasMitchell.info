import { NextResponse } from 'next/server'
import { llmBundle } from '@/content/site-data'

export const revalidate = 3600

export async function GET() {
  return NextResponse.json(llmBundle, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    }
  })
}
