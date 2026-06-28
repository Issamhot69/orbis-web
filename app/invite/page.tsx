'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4080'

function InviteForm() {
  const router  = useRouter()
  const params  = useSearchParams()
  const token   = params.get('token') || ''
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(false)
  const [error, setError]     = useState('')

  async function accept() {
    setLoading(true)
    try {
      const res  = await fetch(API + '/api/organizations/accept-invite', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ token })
      })
      const data = await res.json()
      if (res.status >= 400) throw new Error(data.error)
      setDone(true)
      setTimeout(() => router.push('/dashboard'), 2000)
    } catch(err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh', background:'#060e1a', color:'#fff', fontFamily:'system-ui', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px' }}>
      <div style={{ width:'100%', maxWidth:'400px', background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'16px', padding:'32px', textAlign:'center' }}>
        <div style={{ width:'64px', height:'64px', borderRadius:'16px', background:'#B22234', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'28px', fontWeight:'900', color:'#fff', margin:'0 auto 20px' }}>◎</div>
        <h1 style={{ fontSize:'22px', fontWeight:'900', margin:'0 0 8px' }}>Invitation ORBIS</h1>

        {!token ? (
          <p style={{ color:'#ff6b6b', fontSize:'13px' }}>Lien invalide</p>
        ) : !done ? (
          <>
            <p style={{ fontSize:'14px', color:'#6a8aaa', margin:'0 0 24px' }}>Vous avez ete invite a rejoindre une organisation sur ORBIS — la plateforme B2B mondiale.</p>
            {error && <div style={{ padding:'10px', background:'rgba(255,107,107,0.1)', border:'1px solid #ff6b6b', borderRadius:'8px', color:'#ff6b6b', fontSize:'12px', marginBottom:'16px' }}>{error}</div>}
            <button onClick={accept} disabled={loading} style={{ width:'100%', padding:'14px', background:'#B22234', border:'none', borderRadius:'8px', color:'#fff', fontSize:'15px', fontWeight:'700', cursor:'pointer', opacity: loading?0.6:1, marginBottom:'12px' }}>
              {loading ? 'Traitement...' : 'Accepter invitation'}
            </button>
            <button onClick={() => router.push('/')} style={{ width:'100%', padding:'10px', background:'transparent', border:'1px solid #1e3a5f', borderRadius:'8px', color:'#4a6fa5', fontSize:'13px', cursor:'pointer' }}>
              Se connecter dabord
            </button>
          </>
        ) : (
          <>
            <div style={{ fontSize:'48px', margin:'16px 0' }}>🎉</div>
            <h2 style={{ color:'#00c896', margin:'0 0 8px' }}>Invitation acceptee !</h2>
            <p style={{ fontSize:'13px', color:'#4a6fa5' }}>Redirection vers le dashboard...</p>
          </>
        )}
      </div>
    </div>
  )
}

export default function InvitePage() {
  return (
    <Suspense fallback={<div style={{ minHeight:'100vh', background:'#060e1a' }}/>}>
      <InviteForm />
    </Suspense>
  )
}
