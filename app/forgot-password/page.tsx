'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4080'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)
  const [demoLink, setDemoLink] = useState('')
  const [error, setError]     = useState('')

  async function submit(e: any) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res  = await fetch(API + '/api/auth/forgot-password', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (res.status >= 400) throw new Error(data.error)
      setSent(true)
      if (data.demoLink) setDemoLink(data.demoLink)
    } catch(err: any) {
      setError(err.message)
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh', background:'#060e1a', color:'#fff', fontFamily:'system-ui', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px' }}>
      <div style={{ width:'100%', maxWidth:'400px', background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'16px', padding:'32px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'24px' }}>
          <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'#B22234', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', fontWeight:'900' }}>◎</div>
          <span style={{ fontSize:'20px', fontWeight:'900' }}>ORBIS</span>
        </div>

        {!sent ? (
          <>
            <h1 style={{ fontSize:'20px', fontWeight:'800', margin:'0 0 8px' }}>Mot de passe oublie ?</h1>
            <p style={{ fontSize:'13px', color:'#4a6fa5', margin:'0 0 24px' }}>Entrez votre email pour recevoir un lien de reinitialisation</p>
            <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" required placeholder="votre@email.com" style={{ padding:'12px 14px', background:'#060e1a', border:'1px solid #1e3a5f', borderRadius:'8px', color:'#fff', fontSize:'13px', outline:'none' }}/>
              {error && (
                <div style={{ padding:'10px', background:'rgba(255,107,107,0.1)', border:'1px solid #ff6b6b', borderRadius:'8px', color:'#ff6b6b', fontSize:'12px' }}>{error}</div>
              )}
              <button disabled={loading} style={{ padding:'12px', background:'#B22234', border:'none', borderRadius:'8px', color:'#fff', fontSize:'14px', fontWeight:'700', cursor: loading?'not-allowed':'pointer', opacity: loading?0.6:1 }}>
                {loading ? 'Envoi...' : 'Envoyer le lien'}
              </button>
            </form>
          </>
        ) : (
          <>
            <div style={{ fontSize:'40px', marginBottom:'16px', textAlign:'center' }}>📧</div>
            <h1 style={{ fontSize:'18px', fontWeight:'800', margin:'0 0 8px', textAlign:'center' }}>Email envoye !</h1>
            <p style={{ fontSize:'13px', color:'#4a6fa5', margin:'0 0 20px', textAlign:'center' }}>Si ce compte existe, un lien de reinitialisation a ete envoye.</p>
            {demoLink && (
              <div style={{ padding:'14px', background:'rgba(244,200,66,0.08)', border:'1px solid #f4c842', borderRadius:'10px', marginBottom:'16px' }}>
                <div style={{ fontSize:'11px', color:'#f4c842', fontWeight:'700', marginBottom:'6px' }}>Mode demo — lien direct</div>
                <a href={demoLink} style={{ fontSize:'11px', color:'#5b9fff', wordBreak:'break-all' }}>{demoLink}</a>
              </div>
            )}
          </>
        )}

        <button onClick={() => router.push('/')} style={{ marginTop:'20px', width:'100%', background:'transparent', border:'none', color:'#4a6fa5', fontSize:'12px', cursor:'pointer' }}>
          ← Retour a la connexion
        </button>
      </div>
    </div>
  )
}
