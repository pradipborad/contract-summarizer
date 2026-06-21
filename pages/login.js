import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { supabase } from '../lib/supabaseClient'

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908C16.658 14.015 17.64 11.707 17.64 9.2z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
    <path d="M3.964 10.706c-.18-.54-.282-1.117-.282-1.706s.102-1.166.282-1.706V4.962H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.038l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.962L3.964 6.294C4.672 4.16 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
)

export default function Login() {
  const router  = useRouter()
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    // Redirect to home if already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/')
      else setChecking(false)
    })
  }, [])

  const handleGoogleSignIn = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined'
          ? `${window.location.origin}/`
          : '/',
      },
    })
    if (error) {
      console.error(error)
      setLoading(false)
    }
  }

  if (checking) return null

  return (
    <>
      <Head>
        <title>Sign In — ContractClear</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ fontFamily: "'Inter', sans-serif", minHeight: '100vh', background: 'linear-gradient(160deg, #0D1117 0%, #18213A 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>

        {/* Card */}
        <div style={{ background: '#FFFFFF', borderRadius: 20, padding: '40px 36px', maxWidth: 400, width: '100%', textAlign: 'center', boxShadow: '0 32px 64px rgba(0,0,0,0.4)' }}>

          {/* Logo */}
          <div style={{ width: 52, height: 52, background: '#7C3AED', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, margin: '0 auto 20px' }}>⚖️</div>

          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0D1117', margin: '0 0 8px', letterSpacing: '-0.02em' }}>Sign in to ContractClear</h1>
          <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 28px', lineHeight: 1.5 }}>Understand any contract in seconds with AI</p>

          {/* Benefits */}
          <div style={{ background: '#F8FAFC', borderRadius: 10, padding: '14px 16px', marginBottom: 24, textAlign: 'left' }}>
            {[
              '3 free analyses every month',
              'Your contracts are never stored',
              'No credit card required',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: i < 2 ? 8 : 0 }}>
                <span style={{ color: '#16A34A', fontWeight: 700, fontSize: 14 }}>✓</span>
                <span style={{ fontSize: 13, color: '#374151' }}>{item}</span>
              </div>
            ))}
          </div>

          {/* Google button */}
          <button onClick={handleGoogleSignIn} disabled={loading}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '13px 0', borderRadius: 10, border: '1.5px solid #E2E8F0', background: loading ? '#F8FAFC' : '#FFFFFF', color: '#1E293B', fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'Inter', sans-serif", transition: 'all 0.15s', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#F8FAFC' }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#FFFFFF' }}>
            {loading ? 'Redirecting...' : <><GoogleIcon /> Continue with Google</>}
          </button>

          <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 20, lineHeight: 1.5 }}>
            By signing in, you agree to our{' '}
            <Link href="/terms" style={{ color: '#7C3AED', textDecoration: 'none' }}>Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" style={{ color: '#7C3AED', textDecoration: 'none' }}>Privacy Policy</Link>.
          </p>
        </div>

        <Link href="/" style={{ color: '#4B5563', fontSize: 13, textDecoration: 'none', marginTop: 24 }}>← Back to home</Link>
      </div>
    </>
  )
}
