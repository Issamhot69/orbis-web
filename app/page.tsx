'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [mode, setMode] = useState('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })

  const update = (k: string) => (e: any) => setForm((f: any) => ({ ...f, [k]: e.target.value }))

  async function submit(e: any) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register'
      const body = mode === 'login'
        ? { email: form.email, password: form.password }
        : form
      const res = await fetch('http://localhost:4080' + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (res.status >= 400) throw new Error(data.error || 'Erreur')
      localStorage.setItem('orbis_token', data.token)
      localStorage.setItem('orbis_user', JSON.stringify(data.user))
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#080808', color:'#fff', fontFamily:'system-ui' }}>
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'space-between', padding:'48px', borderRight:'1px solid #1a1a1a' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <span style={{ fontSize:'32px' }}>◎</span>
          <span style={{ fontSize:'24px', fontWeight:'800', letterSpacing:'-1px' }}>ORBIS</span>
        </div>
        <div>
          <h1 style={{ fontSize:'52px', fontWeight:'900', lineHeight:1.05, letterSpacing:'-2px', margin:'0 0 24px', background:'linear-gradient(135deg,#fff 0%,#444 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            One platform.<br/>Every business.<br/>Everywhere.
          </h1>
          <p style={{ color:'#555', fontSize:'16px', lineHeight:1.7, maxWidth:'380px' }}>
            La première plateforme B2B mondiale qui combine Business OS et Marketplace IA.
          </p>
        </div>
        <div style={{ display:'flex', gap:'40px' }}>
          {[['19','Modules'],['80+','Endpoints'],['v2','Marketplace']].map(([n,l]) => (
            <div key={n}>
              <div style={{ fontSize:'28px', fontWeight:'800', color:'#6366f1' }}>{n}</div>
              <div style={{ fontSize:'12px', color:'#444', letterSpacing:'1px', textTransform:'uppercase' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ width:'460px', display:'flex', alignItems:'center', justifyContent:'center', padding:'48px' }}>
        <div style={{ width:'100%', maxWidth:'360px' }}>
          <div style={{ display:'flex', background:'#111', borderRadius:'12px', padding:'4px', marginBottom:'32px' }}>
            {(['login','register'] as const).map(m => (
              <button key={m} onClick={() => { setMode(m); setError('') }} style={{ flex:1, padding:'10px', border:'none', borderRadius:'8px', background: mode===m ? '#1e1e1e' : 'transparent', color: mode===m ? '#fff' : '#555', fontSize:'14px', fontWeight:'500', cursor:'pointer' }}>
                {m === 'login' ? 'Connexion' : 'Créer un compte'}
              </button>
            ))}
          </div>
          <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            {mode === 'register' && (
              <div style={{ display:'flex', gap:'12px' }}>
                <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'6px' }}>
                  <label style={{ fontSize:'12px', color:'#666' }}>Prénom</label>
                  <input value={form.firstName} onChange={update('firstName')} placeholder="John" required style={{ padding:'12px', background:'#111', border:'1px solid #222', borderRadius:'8px', color:'#fff', fontSize:'14px', outline:'none' }}/>
                </div>
                <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'6px' }}>
                  <label style={{ fontSize:'12px', color:'#666' }}>Nom</label>
                  <input value={form.lastName} onChange={update('lastName')} placeholder="Doe" required style={{ padding:'12px', background:'#111', border:'1px solid #222', borderRadius:'8px', color:'#fff', fontSize:'14px', outline:'none' }}/>
                </div>
              </div>
            )}
            <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
              <label style={{ fontSize:'12px', color:'#666' }}>Email</label>
              <input type="email" value={form.email} onChange={update('email')} placeholder="john@company.com" required style={{ padding:'12px', background:'#111', border:'1px solid #222', borderRadius:'8px', color:'#fff', fontSize:'14px', outline:'none' }}/>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
              <label style={{ fontSize:'12px', color:'#666' }}>Mot de passe</label>
              <input type="password" value={form.password} onChange={update('password')} placeholder="••••••••" required style={{ padding:'12px', background:'#111', border:'1px solid #222', borderRadius:'8px', color:'#fff', fontSize:'14px', outline:'none' }}/>
            </div>
            {error && <div style={{ padding:'12px', background:'#1a0808', border:'1px solid #3a1010', borderRadius:'8px', color:'#f87171', fontSize:'13px' }}>{error}</div>}
            <button type="submit" disabled={loading} style={{ marginTop:'8px', padding:'14px', background:'#6366f1', border:'none', borderRadius:'8px', color:'#fff', fontSize:'15px', fontWeight:'600', cursor:'pointer', opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
            </button>
          </form>

            <div style={{ display:'flex', alignItems:'center', gap:'10px', margin:'12px 0' }}>
              <div style={{ flex:1, height:'1px', background:'#1e3a5f' }}></div>
              <span style={{ fontSize:'12px', color:'#4a6fa5' }}>ou</span>
              <div style={{ flex:1, height:'1px', background:'#1e3a5f' }}></div>
            </div>
            <button type="button" onClick={() => alert('Configurez GOOGLE_CLIENT_ID dans .env pour Google OAuth')} style={{ width:'100%', padding:'12px', background:'#fff', border:'1px solid #ddd', borderRadius:'8px', color:'#333', fontSize:'13px', fontWeight:'600', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continuer avec Google
            </button>
          <p style={{ marginTop:'24px', textAlign:'center', fontSize:'13px', color:'#555' }}>
            {mode === 'login' ? 'Pas encore de compte ? ' : 'Déjà un compte ? '}
            <button onClick={() => { setMode(mode==='login' ? 'register' : 'login'); setError('') }} style={{ background:'none', border:'none', color:'#6366f1', cursor:'pointer', fontSize:'13px', fontWeight:'500' }}>
              {mode === 'login' ? "S'inscrire" : 'Se connecter'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
