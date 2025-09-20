import { NextResponse } from 'next/server'
import { loadProjectMetrics } from '@/lib/neon'

export async function GET() {
  try {
    const metrics = await loadProjectMetrics()
    return NextResponse.json({ metrics })
  } catch (error) {
    console.error('Failed to fetch metrics from Neon', error)
    return NextResponse.json({ metrics: [] }, { status: 500 })
  }
}
