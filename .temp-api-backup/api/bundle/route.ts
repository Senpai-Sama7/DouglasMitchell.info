import { NextResponse } from 'next/server'
import * as siteData from '@/content/site-data'

const llmBundle = { ...siteData }

export const revalidate = 3600

export async function GET() {
  return NextResponse.json(llmBundle, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    }
  })
}
