import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface VitalsPayload {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType?: string;
  url?: string;
  userAgent?: string;
  timestamp: number;
}

export async function POST(request: NextRequest) {
  try {
    const payload: VitalsPayload = await request.json();

    // Validate payload
    if (!payload.name || typeof payload.value !== 'number') {
      return NextResponse.json(
        { error: 'Invalid payload' },
        { status: 400 }
      );
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Web Vitals API]', {
        metric: payload.name,
        value: Math.round(payload.value),
        rating: payload.rating,
        url: payload.url,
      });
    }

    // In production, you would send this to your analytics service
    // Examples:
    // - Google Analytics 4
    // - Vercel Analytics
    // - Cloudflare Analytics
    // - Custom database (Postgres, MongoDB, etc.)

    // Example: Send to Vercel Analytics
    if (process.env.VERCEL_ANALYTICS_ID) {
      await sendToVercelAnalytics(payload);
    }

    // Example: Send to custom database
    if (process.env.DATABASE_URL) {
      await saveToDatabase(payload);
    }

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing web vitals:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Example: Send to Vercel Analytics
async function sendToVercelAnalytics(payload: VitalsPayload) {
  // Vercel automatically collects Web Vitals if @vercel/analytics is installed
  // This is just for custom tracking if needed
  try {
    // Your custom Vercel Analytics implementation
    console.log('Sending to Vercel Analytics:', payload.name);
  } catch (error) {
    console.error('Failed to send to Vercel Analytics:', error);
  }
}

// Example: Save to database
async function saveToDatabase(payload: VitalsPayload) {
  try {
    // Example using Neon Postgres (you already have @neondatabase/serverless)
    // const { neon } = await import('@neondatabase/serverless');
    // const sql = neon(process.env.DATABASE_URL!);
    // await sql`
    //   INSERT INTO web_vitals (name, value, rating, url, user_agent, timestamp)
    //   VALUES (${payload.name}, ${payload.value}, ${payload.rating}, ${payload.url}, ${payload.userAgent}, ${payload.timestamp})
    // `;
    console.log('Saving to database:', payload.name);
  } catch (error) {
    console.error('Failed to save to database:', error);
  }
}

// Optional: GET endpoint to retrieve metrics
export async function GET() {
  // Return aggregated metrics or redirect to analytics dashboard
  return NextResponse.json({
    message: 'Web Vitals collection endpoint',
    docs: 'https://web.dev/vitals/',
  });
}
