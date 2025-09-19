import { NextResponse } from 'next/server'
export async function POST(req: Request){
  if(process.env.IDEATOR_ENABLED !== 'true'){
    return NextResponse.json({ error: 'disabled' }, { status: 403 })
  }
  const body = await req.json().catch(()=>({ prompt: '' }))
  const prompt = String(body.prompt||'').slice(0, 800)
  if(!prompt) return NextResponse.json({ error: 'missing_prompt' }, { status: 400 })
  // Stubbed response to avoid leaking keys; wire your model server here.
  const ideas = Array.from({length:5}, (_,i)=>`Idea #${i+1}: ${prompt} — variation ${i+1}`)
  return NextResponse.json({ prompt, ideas })
}
