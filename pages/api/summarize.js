import Groq from 'groq-sdk'
import { createClient } from '@supabase/supabase-js'

export const maxDuration = 60

export const config = {
  api: { bodyParser: { sizeLimit: '4mb' } },
}

const FREE_LIMIT = 3

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  // ── 1. Auth check ──
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ error: 'not_authenticated', message: 'Please sign in to analyze contracts.' })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { auth: { autoRefreshToken: false, persistSession: false }, global: { headers: { Authorization: `Bearer ${token}` } } }
  )

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return res.status(401).json({ error: 'not_authenticated', message: 'Session expired. Please sign in again.' })
  }

  // ── 2. Usage limit check ──
  const monthYear = new Date().toISOString().slice(0, 7)
  const { count } = await supabase
    .from('usage')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('month_year', monthYear)

  if (count >= FREE_LIMIT) {
    return res.status(429).json({
      error: 'free_limit_reached',
      message: `You've used all ${FREE_LIMIT} free analyses this month. Upgrade for unlimited access.`,
    })
  }

  // ── 3. Validate text ──
  const { text } = req.body
  if (!text || text.trim().length < 50) {
    return res.status(400).json({ error: 'Contract text is too short.' })
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: 'GROQ_API_KEY is not configured.' })
  }

  // ── 4. AI analysis ──
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.2,
      max_tokens: 2048,
      messages: [
        {
          role: 'system',
          content: 'You are a professional contract analyst. Respond ONLY with valid JSON — no markdown, no explanation, just the raw JSON object.',
        },
        {
          role: 'user',
          content: `Analyze this contract and return ONLY a JSON object with exactly this structure:

{
  "title": "Brief name of this contract",
  "summary": "2-3 sentence plain-English explanation of what this contract is and who it is between",
  "keyObligations": [{"party": "Who must do this", "obligation": "What they must do"}],
  "redFlags": [{"title": "Short name", "description": "Why this is concerning", "severity": "high|medium|low"}],
  "importantDates": [{"label": "What this date is for", "value": "The date or timeframe"}],
  "questionsToAsk": ["A question to ask before signing"],
  "riskScore": 5
}

Rules: keyObligations 3-6 items · redFlags flag anything unusual/one-sided/auto-renewing/IP-grabs · severity must be exactly high/medium/low · riskScore integer 1-10 · empty arrays if nothing to report · plain English only

CONTRACT:
${text.substring(0, 28000)}`,
        },
      ],
    })

    const raw = completion.choices[0]?.message?.content || ''
    const cleaned = raw.replace(/^```json\s*/i,'').replace(/^```\s*/i,'').replace(/```\s*$/i,'').trim()
    const parsed = JSON.parse(cleaned)

    // ── 5. Record usage AFTER successful analysis ──
    await supabase.from('usage').insert({ user_id: user.id, month_year: monthYear })

    return res.status(200).json(parsed)

  } catch (error) {
    console.error('Summarize error:', error.message)
    if (error instanceof SyntaxError) return res.status(500).json({ error: 'AI returned unexpected format. Please try again.' })
    if (error.message?.includes('429')) return res.status(429).json({ error: 'Too many requests. Please wait a moment.' })
    return res.status(500).json({ error: `Analysis failed: ${error.message}` })
  }
}
