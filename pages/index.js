import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { supabase } from '../lib/supabaseClient'

const FREE_LIMIT = 3

// ─── Icons ───────────────────────────────────────────────────────────────────

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908C16.658 14.015 17.64 11.707 17.64 9.2z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
    <path d="M3.964 10.706c-.18-.54-.282-1.117-.282-1.706s.102-1.166.282-1.706V4.962H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.038l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.962L3.964 6.294C4.672 4.16 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
)

// ─── Helpers ─────────────────────────────────────────────────────────────────

const riskColor = s => s <= 3 ? '#16A34A' : s <= 6 ? '#D97706' : '#DC2626'
const riskLabel = s => s <= 3 ? 'Low Risk' : s <= 6 ? 'Moderate Risk' : 'High Risk'

const severityStyles = s => {
  if (s === 'high')   return { bg: '#FEF2F2', border: '#FCA5A5', text: '#DC2626', dot: '#EF4444', badge: '#FEE2E2' }
  if (s === 'medium') return { bg: '#FFFBEB', border: '#FCD34D', text: '#D97706', dot: '#F59E0B', badge: '#FEF3C7' }
  return                     { bg: '#F0FDF4', border: '#86EFAC', text: '#16A34A', dot: '#22C55E', badge: '#DCFCE7' }
}

// ─── Small components ─────────────────────────────────────────────────────────

function Spinner({ color = 'rgba(255,255,255,0.3)', topColor = 'white' }) {
  return <span style={{ display: 'inline-block', width: 17, height: 17, border: `2.5px solid ${color}`, borderTopColor: topColor, borderRadius: '50%', animation: 'spin 0.75s linear infinite' }} />
}

function SectionCard({ title, titleColor = '#6B7280', children }) {
  return (
    <div className="fade-in" style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: 28, marginBottom: 16 }}>
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: titleColor, margin: '0 0 16px' }}>{title}</p>
      {children}
    </div>
  )
}

function RiskMeter({ score }) {
  const color = riskColor(score)
  const circ  = 2 * Math.PI * 32
  return (
    <div className="fade-in" style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: 28, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 24 }}>
      <div style={{ position: 'relative', width: 88, height: 88, flexShrink: 0 }}>
        <svg width="88" height="88" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="44" cy="44" r="32" fill="none" stroke="#F1F5F9" strokeWidth="9" />
          <circle cx="44" cy="44" r="32" fill="none" stroke={color} strokeWidth="9" strokeDasharray={`${(score/10)*circ} ${circ}`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 1s ease' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 24, fontWeight: 700, color, lineHeight: 1 }}>{score}</span>
          <span style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>/10</span>
        </div>
      </div>
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9CA3AF', margin: '0 0 4px' }}>Overall Risk Score</p>
        <p style={{ fontSize: 22, fontWeight: 700, color, margin: '0 0 4px' }}>{riskLabel(score)}</p>
        <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>
          {score <= 3 ? 'This contract appears standard and fair.' : score <= 6 ? 'Some clauses deserve closer attention.' : 'This contract has significant concerns — review carefully.'}
        </p>
      </div>
    </div>
  )
}

// ─── Sign-in Modal ────────────────────────────────────────────────────────────

function SignInModal({ onClose }) {
  const [loading, setLoading] = useState(false)

  const handleGoogle = async () => {
    setLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/` : '/' },
    })
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#FFF', borderRadius: 20, padding: '40px 36px', maxWidth: 400, width: '100%', textAlign: 'center', boxShadow: '0 32px 64px rgba(0,0,0,0.4)', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 16, background: 'none', border: 'none', fontSize: 22, color: '#9CA3AF', cursor: 'pointer', lineHeight: 1 }}>×</button>

        <div style={{ width: 52, height: 52, background: '#7C3AED', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, margin: '0 auto 20px' }}>⚖️</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0D1117', margin: '0 0 8px', letterSpacing: '-0.02em' }}>Sign in to get started</h2>
        <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 24px', lineHeight: 1.5 }}>Analyze your contract with AI in seconds</p>

        <div style={{ background: '#F8FAFC', borderRadius: 10, padding: '14px 16px', marginBottom: 24, textAlign: 'left' }}>
          {['3 free analyses every month', 'Your contracts are never stored', 'No credit card required'].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: i < 2 ? 8 : 0 }}>
              <span style={{ color: '#16A34A', fontWeight: 700 }}>✓</span>
              <span style={{ fontSize: 13, color: '#374151' }}>{item}</span>
            </div>
          ))}
        </div>

        <button onClick={handleGoogle} disabled={loading}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '13px 0', borderRadius: 10, border: '1.5px solid #E2E8F0', background: '#FFF', color: '#1E293B', fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'Inter', sans-serif", boxShadow: '0 1px 3px rgba(0,0,0,0.08)', transition: 'background 0.15s' }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#F8FAFC' }}
          onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#FFF' }}>
          {loading ? <><Spinner color="rgba(0,0,0,0.15)" topColor="#374151" /> Redirecting to Google...</> : <><GoogleIcon /> Continue with Google</>}
        </button>

        <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 16, lineHeight: 1.5 }}>
          By signing in you agree to our <Link href="/terms" style={{ color: '#7C3AED', textDecoration: 'none' }}>Terms</Link> &amp; <Link href="/privacy" style={{ color: '#7C3AED', textDecoration: 'none' }}>Privacy Policy</Link>
        </p>
      </div>
    </div>
  )
}

// ─── Upgrade Modal ────────────────────────────────────────────────────────────

function UpgradeModal({ onClose }) {
  // Replace this URL with your actual Lemon Squeezy checkout link when ready
  const UPGRADE_URL = '#'

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#FFF', borderRadius: 20, padding: '40px 36px', maxWidth: 400, width: '100%', textAlign: 'center', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 16, background: 'none', border: 'none', fontSize: 22, color: '#9CA3AF', cursor: 'pointer' }}>×</button>

        <div style={{ fontSize: 40, marginBottom: 16 }}>🚀</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0D1117', margin: '0 0 8px' }}>You've used all {FREE_LIMIT} free analyses</h2>
        <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 24px', lineHeight: 1.5 }}>Your free quota resets at the start of next month. Upgrade to Pro for unlimited analyses.</p>

        <div style={{ background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: 12, padding: '18px 20px', marginBottom: 24, textAlign: 'left' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#4C1D95', margin: '0 0 12px' }}>ContractClear Pro includes:</p>
          {['Unlimited contract analyses', 'PDF download for every analysis', 'Priority AI processing', 'Email support'].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: i < 3 ? 8 : 0 }}>
              <span style={{ color: '#7C3AED', fontWeight: 700 }}>✓</span>
              <span style={{ fontSize: 13, color: '#374151' }}>{item}</span>
            </div>
          ))}
        </div>

        <a href={UPGRADE_URL} target="_blank" rel="noreferrer"
          style={{ display: 'block', width: '100%', padding: '14px 0', borderRadius: 10, background: '#7C3AED', color: '#FFF', fontSize: 15, fontWeight: 600, textDecoration: 'none', marginBottom: 10, boxSizing: 'border-box' }}>
          Upgrade to Pro
        </a>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#6B7280', fontSize: 13, cursor: 'pointer' }}>Maybe later</button>
      </div>
    </div>
  )
}

// ─── Nav ─────────────────────────────────────────────────────────────────────

function Nav({ session, usageCount, onSignOut, onSignIn }) {
  const remaining = FREE_LIMIT - usageCount
  const usageColor = remaining <= 0 ? '#DC2626' : remaining === 1 ? '#D97706' : '#16A34A'

  return (
    <nav style={{ background: '#0D1117', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 62 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 30, height: 30, background: '#7C3AED', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⚖️</div>
          <span style={{ color: '#FFF', fontWeight: 700, fontSize: 17 }}>ContractClear</span>
        </Link>

        {session ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Usage pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 20, padding: '5px 12px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: usageColor, display: 'inline-block', flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: '#CBD5E1', fontWeight: 500 }}>
                {remaining > 0 ? `${remaining} free ${remaining === 1 ? 'analysis' : 'analyses'} left` : 'Free limit reached'}
              </span>
            </div>

            {/* Avatar */}
            {session.user?.user_metadata?.avatar_url
              ? <img src={session.user.user_metadata.avatar_url} alt="avatar" style={{ width: 30, height: 30, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.15)' }} />
              : <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#FFF', fontWeight: 600 }}>
                  {(session.user?.email || '?')[0].toUpperCase()}
                </div>
            }

            {/* Sign out */}
            <button onClick={onSignOut}
              style={{ background: 'none', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: '#94A3B8', fontSize: 13, padding: '5px 12px', cursor: 'pointer', fontFamily: "'Inter', sans-serif", transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = '#FFF' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#94A3B8' }}>
              Sign out
            </button>
          </div>
        ) : (
          <button onClick={onSignIn}
            style={{ background: '#7C3AED', border: 'none', borderRadius: 8, color: '#FFF', fontSize: 13, fontWeight: 600, padding: '7px 16px', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>
            Sign in
          </button>
        )}
      </div>
    </nav>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={{ background: '#0D1117', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px', textAlign: 'center' }}>
      <p style={{ color: '#4B5563', fontSize: 13, margin: '0 0 10px' }}>© 2024 ContractClear</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
        <Link href="/terms"   style={{ color: '#4B5563', fontSize: 12, textDecoration: 'none' }}>Terms of Service</Link>
        <Link href="/privacy" style={{ color: '#4B5563', fontSize: 12, textDecoration: 'none' }}>Privacy Policy</Link>
      </div>
    </footer>
  )
}

// ─── PDF Generator ────────────────────────────────────────────────────────────

async function generatePDF(result) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const W = doc.internal.pageSize.getWidth()
  const H = doc.internal.pageSize.getHeight()
  const margin = 18, cw = W - 2 * margin
  let y = 0

  const wrap = (text, maxW) => doc.splitTextToSize(String(text || ''), maxW || cw)
  const nb = (needed = 15) => { if (y + needed > H - 18) { doc.addPage(); y = 22 } }

  doc.setFillColor(124, 58, 237); doc.rect(0, 0, W, 16, 'F')
  doc.setTextColor(255,255,255); doc.setFontSize(10); doc.setFont('helvetica','bold')
  doc.text('ContractClear', margin, 10.5)
  doc.setFont('helvetica','normal'); doc.text('Contract Analysis Report', W - margin, 10.5, { align: 'right' })
  y = 28

  doc.setTextColor(13,17,23); doc.setFontSize(18); doc.setFont('helvetica','bold')
  const tl = wrap(result.title || 'Contract Analysis', cw); doc.text(tl, margin, y); y += tl.length * 8 + 3
  doc.setFontSize(9); doc.setFont('helvetica','normal'); doc.setTextColor(100,116,139)
  doc.text(`Analyzed on ${new Date().toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}`, margin, y); y += 8
  doc.setDrawColor(226,232,240); doc.setLineWidth(0.3); doc.line(margin,y,W-margin,y); y += 10

  if (typeof result.riskScore === 'number') {
    const rc = result.riskScore<=3?[22,163,74]:result.riskScore<=6?[217,119,6]:[220,38,38]
    const rl = result.riskScore<=3?'Low Risk':result.riskScore<=6?'Moderate Risk':'High Risk'
    doc.setFillColor(248,250,252); doc.setDrawColor(226,232,240); doc.setLineWidth(0.3)
    doc.roundedRect(margin,y,cw,18,3,3,'FD')
    doc.setFontSize(8.5); doc.setFont('helvetica','normal'); doc.setTextColor(100,116,139)
    doc.text('OVERALL RISK SCORE', margin+8, y+6)
    doc.setFontSize(13); doc.setFont('helvetica','bold'); doc.setTextColor(...rc)
    doc.text(`${result.riskScore}/10  —  ${rl}`, margin+8, y+13.5); y += 26
  }

  const sh = (label, rgb=[30,41,59]) => {
    nb(18); doc.setFontSize(8); doc.setFont('helvetica','bold'); doc.setTextColor(...rgb)
    doc.text(label.toUpperCase(), margin, y); y += 2
    doc.setDrawColor(...rgb); doc.setLineWidth(0.5); doc.line(margin,y,margin+28,y); y += 7
  }

  if (result.summary) {
    sh('Plain-English Summary',[124,58,237])
    doc.setFontSize(10); doc.setFont('helvetica','normal'); doc.setTextColor(55,65,81)
    const sl = wrap(result.summary,cw); nb(sl.length*5+5); doc.text(sl,margin,y); y += sl.length*5+12
  }
  if (result.redFlags?.length) {
    sh(`Red Flags  (${result.redFlags.length} found)`,[220,38,38])
    for (const f of result.redFlags) {
      const sc=f.severity==='high'?[220,38,38]:f.severity==='medium'?[217,119,6]:[22,163,74]; nb(20)
      doc.setFillColor(...sc); doc.circle(margin+2,y-1.5,1.5,'F')
      doc.setFontSize(10); doc.setFont('helvetica','bold'); doc.setTextColor(30,41,59); doc.text(f.title,margin+6,y)
      doc.setFontSize(7.5); doc.setFont('helvetica','bold'); doc.setTextColor(...sc); doc.text(String(f.severity||'').toUpperCase(),W-margin,y,{align:'right'}); y+=5
      doc.setFontSize(9); doc.setFont('helvetica','normal'); doc.setTextColor(75,85,99)
      const dl=wrap(f.description,cw-6); nb(dl.length*4.5+7); doc.text(dl,margin+6,y); y+=dl.length*4.5+7
    }; y+=2
  }
  if (result.keyObligations?.length) {
    sh('Key Obligations',[5,150,105])
    for (const o of result.keyObligations) {
      nb(14); doc.setFontSize(8); doc.setFont('helvetica','bold')
      doc.setFillColor(209,250,229); doc.setDrawColor(5,150,105); doc.setLineWidth(0.3)
      doc.roundedRect(margin,y-4,24,6,1.5,1.5,'FD'); doc.setTextColor(5,150,105); doc.text(String(o.party||'You'),margin+2,y)
      doc.setFontSize(9); doc.setFont('helvetica','normal'); doc.setTextColor(55,65,81)
      const ol=wrap(o.obligation,cw-28); nb(ol.length*4.5+5); doc.text(ol,margin+28,y); y+=ol.length*4.5+5
    }; y+=4
  }
  if (result.importantDates?.length) {
    sh('Important Dates',[217,119,6])
    for (const d of result.importantDates) {
      nb(10); const ls=String(d.label||'')+':  '
      doc.setFontSize(9); doc.setFont('helvetica','bold'); doc.setTextColor(146,64,14); doc.text(ls,margin+3,y)
      doc.setFont('helvetica','normal'); doc.setTextColor(217,119,6); doc.text(String(d.value||''),margin+3+doc.getTextWidth(ls),y); y+=7
    }; y+=4
  }
  if (result.questionsToAsk?.length) {
    sh('Questions to Ask Before Signing',[30,41,59])
    for (const q of result.questionsToAsk) {
      nb(12); doc.setFontSize(9); doc.setFont('helvetica','normal'); doc.setTextColor(55,65,81)
      const ql=wrap('?  '+q,cw-4); doc.text(ql,margin+2,y); y+=ql.length*4.5+5
    }
  }

  const tp = doc.internal.getNumberOfPages()
  for (let p=1;p<=tp;p++) {
    doc.setPage(p); doc.setFillColor(248,250,252); doc.rect(0,H-14,W,14,'F')
    doc.setDrawColor(226,232,240); doc.setLineWidth(0.3); doc.line(0,H-14,W,H-14)
    doc.setFontSize(7.5); doc.setFont('helvetica','normal'); doc.setTextColor(148,163,184)
    doc.text('This analysis is AI-generated and does not constitute legal advice.',margin,H-6)
    doc.text(`© ${new Date().getFullYear()} ContractClear  ·  Page ${p} of ${tp}`,W-margin,H-6,{align:'right'})
  }
  doc.save((result.title||'contract').toLowerCase().replace(/[^a-z0-9]+/g,'-')+'-summary.pdf')
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [inputMode, setInputMode]       = useState('upload')
  const [file, setFile]                 = useState(null)
  const [pastedText, setPastedText]     = useState('')
  const [dragOver, setDragOver]         = useState(false)
  const [loading, setLoading]           = useState(false)
  const [pdfLoading, setPdfLoading]     = useState(false)
  const [result, setResult]             = useState(null)
  const [error, setError]               = useState('')
  // Auth state
  const [session, setSession]           = useState(null)
  const [usageCount, setUsageCount]     = useState(0)
  const [authReady, setAuthReady]       = useState(false)
  // Modals
  const [showSignIn, setShowSignIn]     = useState(false)
  const [showUpgrade, setShowUpgrade]   = useState(false)

  const fileInputRef = useRef(null)
  const resultsRef   = useRef(null)

  // ── Auth + usage setup ──
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setAuthReady(true)
      if (session) fetchUsage()
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) fetchUsage()
      else setUsageCount(0)
    })
    return () => subscription.unsubscribe()
  }, [])

  const fetchUsage = async () => {
    const monthYear = new Date().toISOString().slice(0, 7)
    const { count } = await supabase
      .from('usage')
      .select('*', { count: 'exact', head: true })
      .eq('month_year', monthYear)
    setUsageCount(count || 0)
  }

  // ── Load pdf.js ──
  useEffect(() => {
    if (document.getElementById('pdfjs-script')) return
    const s = document.createElement('script')
    s.id = 'pdfjs-script'
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
    s.onload = () => { window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js' }
    document.head.appendChild(s)
  }, [])

  const extractPdfText = async (pdfFile) => {
    if (!window.pdfjsLib) throw new Error('PDF library not loaded. Please try again.')
    const buffer = await pdfFile.arrayBuffer()
    const pdf = await window.pdfjsLib.getDocument({ data: buffer }).promise
    let text = ''
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      text += content.items.map(item => item.str).join(' ') + '\n'
    }
    return text
  }

  const handleFileSelect = (selected) => {
    setError('')
    if (!selected) return
    if (selected.type !== 'application/pdf' && !selected.name.endsWith('.txt')) { setError('Please upload a PDF or TXT file.'); return }
    setFile(selected); setResult(null)
  }

  const handleAnalyze = async () => {
    // Not logged in → show sign-in modal
    if (!session) { setShowSignIn(true); return }
    // Free limit reached → show upgrade modal
    if (usageCount >= FREE_LIMIT) { setShowUpgrade(true); return }

    setError(''); setLoading(true); setResult(null)
    try {
      let contractText = pastedText
      if (file) contractText = file.type === 'application/pdf' ? await extractPdfText(file) : await file.text()
      if (!contractText.trim() || contractText.trim().length < 50) { setError('Please upload a contract or paste some text before analyzing.'); setLoading(false); return }

      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
        body: JSON.stringify({ text: contractText }),
      })
      const data = await res.json()

      if (res.status === 429 && data.error === 'free_limit_reached') { setShowUpgrade(true); setLoading(false); return }
      if (!res.ok) throw new Error(data.error || 'Analysis failed.')

      setResult(data)
      setUsageCount(prev => prev + 1)
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => { await supabase.auth.signOut(); setResult(null); setUsageCount(0) }
  const canAnalyze = !loading && (file !== null || pastedText.trim().length > 50)
  const remaining  = FREE_LIMIT - usageCount

  return (
    <>
      <Head>
        <title>ContractClear — Understand Any Contract in Seconds</title>
        <meta name="description" content="Upload any contract and instantly get a plain-English summary, red flags, key obligations, and important dates." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚖️</text></svg>" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ fontFamily: "'Inter', sans-serif", minHeight: '100vh', background: '#F8FAFC' }}>

        <Nav session={session} usageCount={usageCount} onSignOut={handleSignOut} onSignIn={() => setShowSignIn(true)} />

        {/* ── HERO ── */}
        <div style={{ background: 'linear-gradient(160deg, #0D1117 0%, #18213A 100%)', padding: '72px 24px 96px' }}>
          <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
            <h1 style={{ color: '#FFF', fontSize: 'clamp(36px, 5vw, 54px)', fontWeight: 700, lineHeight: 1.12, margin: '0 0 18px', letterSpacing: '-0.025em' }}>
              Understand any contract <span style={{ color: '#7C3AED' }}>in seconds.</span>
            </h1>
            <p style={{ color: '#94A3B8', fontSize: 18, lineHeight: 1.65, margin: '0 0 52px', maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>
              Upload or paste any contract. Get plain-English summaries, red flags, obligations, and key dates — instantly.
            </p>

            {/* Upload Card */}
            <div style={{ background: '#FFF', borderRadius: 20, padding: '32px 32px 28px', textAlign: 'left', boxShadow: '0 32px 64px rgba(0,0,0,0.3)' }}>

              {/* Remaining badge (only when logged in) */}
              {session && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                  <div style={{ background: remaining > 0 ? '#F0FDF4' : '#FEF2F2', border: `1px solid ${remaining > 0 ? '#86EFAC' : '#FCA5A5'}`, borderRadius: 20, padding: '4px 12px', fontSize: 12, color: remaining > 0 ? '#16A34A' : '#DC2626', fontWeight: 500 }}>
                    {remaining > 0 ? `${remaining} free ${remaining === 1 ? 'analysis' : 'analyses'} remaining` : 'Free limit reached — upgrade for more'}
                  </div>
                </div>
              )}

              {/* Mode tabs */}
              <div style={{ display: 'flex', gap: 4, background: '#F1F5F9', borderRadius: 10, padding: 4, marginBottom: 24 }}>
                {[{ id: 'upload', label: '📄  Upload PDF / TXT' }, { id: 'paste', label: '✏️  Paste Text' }].map(({ id, label }) => (
                  <button key={id} onClick={() => { setInputMode(id); setError('') }}
                    style={{ flex: 1, padding: '9px 0', borderRadius: 7, border: 'none', cursor: 'pointer', background: inputMode===id?'#FFF':'transparent', color: inputMode===id?'#1E293B':'#64748B', fontWeight: inputMode===id?600:400, fontSize: 14, boxShadow: inputMode===id?'0 1px 4px rgba(0,0,0,0.1)':'none', transition: 'all 0.15s', fontFamily: "'Inter', sans-serif" }}>
                    {label}
                  </button>
                ))}
              </div>

              {inputMode === 'upload' ? (
                <div onDragOver={e => { e.preventDefault(); setDragOver(true) }} onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); handleFileSelect(e.dataTransfer.files[0]) }}
                  onClick={() => fileInputRef.current?.click()}
                  style={{ border: `2px dashed ${dragOver?'#7C3AED':file?'#22C55E':'#CBD5E1'}`, borderRadius: 12, padding: '44px 24px', textAlign: 'center', cursor: 'pointer', background: dragOver?'#F5F3FF':file?'#F0FDF4':'#FAFBFC', transition: 'all 0.2s' }}>
                  <input ref={fileInputRef} type="file" accept=".pdf,.txt" onChange={e => handleFileSelect(e.target.files[0])} style={{ display: 'none' }} />
                  {file
                    ? <><div style={{ fontSize: 36, marginBottom: 10 }}>✅</div><p style={{ fontWeight: 600, color: '#16A34A', margin: '0 0 4px' }}>{file.name}</p><p style={{ color: '#6B7280', fontSize: 13, margin: 0 }}>Click to choose a different file</p></>
                    : <><div style={{ fontSize: 44, marginBottom: 12 }}>📂</div><p style={{ fontWeight: 600, color: '#1E293B', margin: '0 0 6px' }}>Drop your contract here</p><p style={{ color: '#94A3B8', fontSize: 13, margin: 0 }}>PDF or TXT · or click to browse</p></>
                  }
                </div>
              ) : (
                <textarea value={pastedText} onChange={e => setPastedText(e.target.value)} placeholder="Paste your contract text here..."
                  style={{ width: '100%', minHeight: 220, padding: '14px 16px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 14, lineHeight: 1.65, resize: 'vertical', fontFamily: "'Inter', sans-serif", color: '#1E293B', background: '#FAFAFA', outline: 'none', transition: 'border-color 0.15s' }}
                  onFocus={e => (e.target.style.borderColor='#7C3AED')} onBlur={e => (e.target.style.borderColor='#E2E8F0')} />
              )}

              {error && <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 8, padding: '11px 14px', marginTop: 16, color: '#DC2626', fontSize: 14 }}>⚠️ {error}</div>}

              <button onClick={handleAnalyze} disabled={!canAnalyze}
                style={{ width: '100%', marginTop: 20, padding: '15px 0', borderRadius: 12, border: 'none', background: canAnalyze?'#7C3AED':'#E2E8F0', color: canAnalyze?'#FFF':'#94A3B8', fontSize: 16, fontWeight: 600, cursor: canAnalyze?'pointer':'not-allowed', fontFamily: "'Inter', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'all 0.2s' }}
                onMouseEnter={e => { if (canAnalyze) e.currentTarget.style.background='#6D28D9' }}
                onMouseLeave={e => { if (canAnalyze) e.currentTarget.style.background='#7C3AED' }}>
                {loading ? <><Spinner />Analyzing your contract...</> : !session ? '🔍  Analyze Contract — Sign in required' : '🔍  Analyze Contract'}
              </button>

              <p style={{ textAlign: 'center', fontSize: 12, color: '#94A3B8', marginTop: 12, marginBottom: 0 }}>Your contract is never stored. Analysis happens in real time.</p>
            </div>
          </div>
        </div>

        {/* ── WHAT YOU GET ── */}
        {!result && !loading && (
          <div style={{ maxWidth: 800, margin: '60px auto', padding: '0 24px' }}>
            <p style={{ textAlign: 'center', fontSize: 13, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: 32 }}>What you get</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 14 }}>
              {[{ icon:'📋',title:'Plain-English Summary',desc:'What the contract actually says' },{ icon:'🚩',title:'Red Flags',desc:'Risky or unusual clauses highlighted' },{ icon:'✅',title:'Key Obligations',desc:'What you must do under this agreement' },{ icon:'📅',title:'Important Dates',desc:'Deadlines, renewals, notice periods' },{ icon:'❓',title:'Questions to Ask',desc:'Smart questions before you sign' }].map(({ icon,title,desc }) => (
                <div key={title} style={{ background:'#FFF',border:'1px solid #E2E8F0',borderRadius:14,padding:'20px 16px',textAlign:'center' }}>
                  <div style={{ fontSize:28,marginBottom:10 }}>{icon}</div>
                  <p style={{ fontWeight:600,fontSize:14,color:'#1E293B',margin:'0 0 4px' }}>{title}</p>
                  <p style={{ fontSize:12,color:'#6B7280',margin:0,lineHeight:1.5 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── RESULTS ── */}
        {result && (
          <div ref={resultsRef} style={{ maxWidth: 800, margin: '0 auto', padding: '56px 24px 80px' }}>
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: '#0D1117', margin: '0 0 8px', letterSpacing: '-0.02em' }}>{result.title||'Contract Analysis'}</h2>
              <p style={{ color: '#6B7280', fontSize: 15, margin: '0 0 20px' }}>Here's what you need to know before signing</p>
              <button onClick={async () => { setPdfLoading(true); try { await generatePDF(result) } catch(e) { setError('Could not generate PDF.') } finally { setPdfLoading(false) } }} disabled={pdfLoading}
                style={{ display:'inline-flex',alignItems:'center',gap:8,padding:'10px 22px',borderRadius:10,border:'1.5px solid #7C3AED',background:'white',color:'#7C3AED',fontSize:14,fontWeight:600,cursor:pdfLoading?'not-allowed':'pointer',fontFamily:"'Inter', sans-serif",transition:'all 0.2s' }}
                onMouseEnter={e => { if (!pdfLoading) { e.currentTarget.style.background='#7C3AED'; e.currentTarget.style.color='white' }}}
                onMouseLeave={e => { if (!pdfLoading) { e.currentTarget.style.background='white'; e.currentTarget.style.color='#7C3AED' }}}>
                {pdfLoading ? <><Spinner color="rgba(124,58,237,0.3)" topColor="#7C3AED" />Generating PDF...</> : '⬇️  Download Summary as PDF'}
              </button>
            </div>

            {typeof result.riskScore==='number' && <RiskMeter score={result.riskScore} />}

            {result.summary && <SectionCard title="Plain-English Summary" titleColor="#7C3AED"><p style={{ fontSize:16,lineHeight:1.75,color:'#374151',margin:0 }}>{result.summary}</p></SectionCard>}

            {result.redFlags?.length > 0 && (
              <SectionCard title={`🚩 Red Flags  (${result.redFlags.length} found)`} titleColor="#DC2626">
                <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
                  {result.redFlags.map((flag,i) => { const s=severityStyles(flag.severity); return (
                    <div key={i} style={{ background:s.bg,border:`1px solid ${s.border}`,borderRadius:10,padding:'14px 16px' }}>
                      <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:6 }}>
                        <span style={{ width:8,height:8,borderRadius:'50%',background:s.dot,flexShrink:0,display:'inline-block' }} />
                        <span style={{ fontWeight:600,color:s.text,fontSize:14 }}>{flag.title}</span>
                        <span style={{ marginLeft:'auto',fontSize:11,fontWeight:600,color:s.text,background:s.badge,padding:'2px 9px',borderRadius:10,textTransform:'uppercase',letterSpacing:'0.04em' }}>{flag.severity}</span>
                      </div>
                      <p style={{ margin:0,fontSize:14,color:'#374151',lineHeight:1.55,paddingLeft:16 }}>{flag.description}</p>
                    </div>
                  )})}
                </div>
              </SectionCard>
            )}

            {result.keyObligations?.length > 0 && (
              <SectionCard title="✅ Key Obligations" titleColor="#059669">
                <div style={{ display:'flex',flexDirection:'column' }}>
                  {result.keyObligations.map((ob,i) => (
                    <div key={i} style={{ display:'flex',gap:14,alignItems:'flex-start',padding:'12px 0',borderBottom:i<result.keyObligations.length-1?'1px solid #F1F5F9':'none' }}>
                      <span style={{ background:'#D1FAE5',color:'#059669',fontSize:11,fontWeight:700,padding:'3px 10px',borderRadius:6,flexShrink:0,marginTop:2,whiteSpace:'nowrap' }}>{ob.party||'You'}</span>
                      <p style={{ margin:0,fontSize:14,color:'#374151',lineHeight:1.6 }}>{ob.obligation}</p>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {result.importantDates?.length > 0 && (
              <SectionCard title="📅 Important Dates & Deadlines" titleColor="#D97706">
                <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))',gap:10 }}>
                  {result.importantDates.map((d,i) => (
                    <div key={i} style={{ background:'#FFFBEB',border:'1px solid #FDE68A',borderRadius:10,padding:'14px 16px' }}>
                      <p style={{ margin:'0 0 5px',fontSize:12,color:'#92400E',fontWeight:500 }}>{d.label}</p>
                      <p style={{ margin:0,fontSize:15,color:'#D97706',fontWeight:700 }}>{d.value}</p>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {result.questionsToAsk?.length > 0 && (
              <SectionCard title="❓ Questions to Ask Before Signing" titleColor="#1E293B">
                <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
                  {result.questionsToAsk.map((q,i) => (
                    <div key={i} style={{ display:'flex',gap:12,alignItems:'flex-start',background:'#F8FAFC',borderRadius:10,padding:'12px 14px',border:'1px solid #E2E8F0' }}>
                      <span style={{ color:'#7C3AED',fontWeight:700,fontSize:16,flexShrink:0,lineHeight:1.5 }}>?</span>
                      <p style={{ margin:0,fontSize:14,color:'#374151',lineHeight:1.6 }}>{q}</p>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            <div style={{ textAlign:'center',marginTop:32 }}>
              <button onClick={() => { setResult(null);setFile(null);setPastedText('');setError('');window.scrollTo({top:0,behavior:'smooth'}) }}
                style={{ background:'transparent',border:'1.5px solid #CBD5E1',borderRadius:10,padding:'11px 24px',fontSize:14,color:'#475569',cursor:'pointer',fontFamily:"'Inter', sans-serif",fontWeight:500,marginBottom:20 }}>
                ← Analyze another contract
              </button>
              <p style={{ fontSize:12,color:'#94A3B8',lineHeight:1.6,maxWidth:540,margin:'0 auto' }}>
                This analysis is AI-generated for informational purposes only and does not constitute legal advice. Always consult a qualified attorney before signing.
              </p>
            </div>
          </div>
        )}

        <Footer />
      </div>

      {/* ── Modals ── */}
      {showSignIn  && <SignInModal  onClose={() => setShowSignIn(false)}  />}
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes fadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}.fade-in{animation:fadeIn 0.4s ease forwards}*{box-sizing:border-box}body{margin:0}`}</style>
    </>
  )
}
