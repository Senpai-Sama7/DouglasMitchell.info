import { NextResponse } from 'next/server'
const GH = 'https://api.github.com'

export async function GET(){
  const user = process.env.NEXT_PUBLIC_GITHUB_USER || 'vercel'
  const token = process.env.GITHUB_TOKEN
  const headers: Record<string,string> = { 'User-Agent': 'ultimate-portfolio' }
  if (token) headers.Authorization = `Bearer ${token}`
  const r = await fetch(`${GH}/users/${user}/repos?per_page=6&sort=updated`, { headers })
  if(!r.ok) return NextResponse.json({ error: 'github_fetch_failed', status: r.status }, { status: 502 })
  const repos = await r.json()
  return NextResponse.json(repos.map((r:any)=>({ name: r.name, stars: r.stargazers_count, url: r.html_url })))
}
