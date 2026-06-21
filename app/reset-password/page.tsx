'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4080'

function ResetPasswordForm() {
  const router = useRouter()
  const params = useSearchParams()
  const token  = params.get('token') || ''
  const [newPassword, setNewPassword]         = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(false)
  const [error, setError]     = useState('')

  async function submit(e: any) {
    e.preventDefault()
    setError('')
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }
    if (newPassword.length < 6) {
      setError('Le mot de passe doit faire au moins 6 caracteres')
      return
    }
    setLoading(true)
    try {
      const res  = await fetch(API + '/api/auth/reset-password', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ token, newPassword })
      })
      const data = await res.json()
      if (res.status >= 400) throw new Error(data.error)
      setDone(true)
      setTimeout(() => router.push('/'), 2000)
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

        {!token ? (
          <div style={{ textAlign:'center', color:'#ff6b6b', fontSize:'13px' }}>Lien invalide ou expire</div>
        ) : !done ? (
          <>
            <h1 style={{ fontSize:'20px', fontWeight:'800', margin:'0 0 8px' }}>Nouveau mot de passe</h1>
            <p style={{ fontSize:'13px', color:'#4a6fa5', margin:'0 0 24px' }}>Choisissez un nouveau mot de passe securise</p>
            <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
              <input value={newPassword} onChange={e => setNewPassword(e.target.value)} type="password" required placeholder="Nouveau mot de passe" style={{ padding:'12px 14px', background:'#060e1a', border:'1px solid #1e3a5f', borderRadius:'8px', color:'#fff', fontSize:'13px', outline:'none' }}/>
              <input value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} type="password" required placeholder="Confirmer le mot de passe" style={{ padding:'12px 14px', background:'#060e1a', border:'1px solid #1e3a5f', borderRadius:'8px', color:'#fff', fontSize:'13px', outline:'none' }}/>
              {error && (
                <div style={{ padding:'10px', background:'rgba(255,107,107,0.1)', border:'1px solid #ff6b6b', borderRadius:'8px', color:'#ff6b6b', fontSize:'12px' }}>{error}</div>
              )}
              <button disabled={loading} style={{ padding:'12px', background:'#B22234', border:'none', borderRadius:'8px', color:'#fff', fontSize:'14px', fontWeight:'700', cursor: loading?'not-allowed':'pointer', opacity: loading?0.6:1 }}>
                {loading ? 'Modification...' : 'Reinitialiser le mot de passe'}
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:'40px', marginBottom:'16px' }}>✅</div>
            <h1 style={{ fontSize:'18px', fontWeight:'800', margin:'0 0 8px' }}>Mot de passe modifie !</h1>
            <p style={{ fontSize:'13px', color:'#4a6fa5' }}>Redirection vers la connexion...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div style={{ minHeight:'100vh', background:'#060e1a' }}/>}>
      <ResetPasswordForm />
    </Suspense>
  )
}
