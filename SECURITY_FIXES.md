# Immediate Security Fixes Required

## 1. API Security Hardening

### Fix Database Connection Validation
```typescript
// lib/neon.ts - Add connection validation
import { neon } from '@neondatabase/serverless'

const validateConnectionString = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false
  if (!url.startsWith('postgresql://')) return false
  if (url.includes('localhost') && process.env.NODE_ENV === 'production') return false
  return true
}

export const sql = neon(process.env.DATABASE_URL!, {
  onError: (error) => {
    console.error('Database connection error:', error.message) // Don't log full error
  }
})
```

### Add Rate Limiting
```typescript
// lib/rate-limit.ts
const rateLimitMap = new Map()

export function rateLimit(identifier: string, limit = 10, window = 60000) {
  const now = Date.now()
  const windowStart = now - window
  
  const requests = rateLimitMap.get(identifier) || []
  const validRequests = requests.filter((time: number) => time > windowStart)
  
  if (validRequests.length >= limit) {
    return false
  }
  
  validRequests.push(now)
  rateLimitMap.set(identifier, validRequests)
  return true
}
```

### Secure API Routes
```typescript
// app/api/metrics/route.ts - Updated
import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  const ip = request.ip || 'anonymous'
  
  if (!rateLimit(ip, 30, 60000)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }
  
  try {
    const metrics = await loadProjectMetrics()
    return NextResponse.json({ metrics })
  } catch (error) {
    // Log internally but don't expose details
    console.error('Metrics fetch failed')
    return NextResponse.json({ metrics: [] }, { status: 500 })
  }
}
```

## 2. Environment Security
```bash
# .env.example - Updated
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
DATABASE_URL_UNPOOLED=postgresql://user:pass@host:5432/db?sslmode=require&pgbouncer=true
ALLOWED_ORIGINS=https://douglasmitchell.info,https://www.douglasmitchell.info
RATE_LIMIT_ENABLED=true
```