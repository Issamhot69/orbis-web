'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, Button, colors } from '../components/orbis-ui'

const API = 'http://localhost:4080'

const PLANS = [
  {
    id:'free', name:'Free', price:0, billing:'forever',
    color:'#4a6fa5', badge:'',
    desc:'Pour decouvrir ORBIS',
    features:['5 utilisateurs','1 organisation','Marketplace basique','Messages illimites','Support communaute','1GB stockage'],
    notIncluded:['AI Assistant','Voice Clone','Document Scanner','Satellite Tracking','API Access'],
  },
  {
    id:'pro', name:'Pro', price:49, billing:'mois',
    color:'#B22234', badge:'Populaire',
    desc:'Pour les equipes qui grandissent',
    features:['Utilisateurs illimites','5 organisations','Marketplace complete','AI Assistant Claude','Voice Clone 12 langues','Document AI Scanner','Satellite Tracking','Predictive Deal Engine','Business Credit Score','Support prioritaire 24/7','50GB stockage'],
    notIncluded:['White label','API Access illimite','SLA 99.9%'],
  },
  {
    id:'enterprise', name:'Enterprise', price:199, billing:'mois',
    color:'#f4c842', badge:'Best Value',
    desc:'Pour les grandes entreprises',
    features:['Tout dans Pro','Organisations illimitees','White label custom','API Access illimite','SLA 99.9% garanti','Domain custom','IA entraine sur vos donnees','Manager dedie','Stockage illimite','SSO / SAML'],
    notIncluded:[],
  },
]

export default function PricingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string|null>(null)
  const [success, setSuccess] = useState(false)
  const token = typeof window !== 'undefined' ? localStorage.getItem('orbis_token') : ''

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('payment') === 'success') setSuccess(true)
  }, [])

  async function subscribe(planId: string) {
    if (planId === 'free') { router.push('/dashboard'); return }
    setLoading(planId)
    try {
      const res  = await fetch(API + '/api/stripe/checkout', {
        method:'POST',
        headers:{ 'Content-Type':'application/json', Authorization:'Bearer '+token },
        body: JSON.stringify({ planId })
      })
      const data = await res.json()
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else if (data.demo) {
        alert('Mode demo — Configurez STRIPE_SECRET_KEY dans .env\nPlan: '+data.plan+' ($'+data.price+'/mois)')
        router.push('/dashboard')
      }
    } catch(err: any) {
      alert(err.message)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div style={{ minHeight:'100vh', background:'#060e1a', color:'#fff', fontFamily:'system-ui', padding:'40px 24px' }}>
      <div style={{ textAlign:'center', marginBottom:'48px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', marginBottom:'16px' }}>
          <div style={{ width:'40px', height:'40px', borderRadius:'10px', background:'linear-gradient(135deg,#B22234,#7a0f1e)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', fontWeight:'900', color:'#fff' }}>◎</div>
          <span style={{ fontSize:'24px', fontWeight:'900' }}>ORBIS</span>
        </div>
        <h1 style={{ fontSize:'40px', fontWeight:'900', margin:'0 0 12px', color:'#fff' }}>Tarifs simples et transparents</h1>
        <p style={{ fontSize:'16px', color:'#4a6fa5', margin:0 }}>One platform. Every business. Everywhere.</p>
      </div>

      {success && (
        <div style={{ maxWidth:'500px', margin:'0 auto 32px', padding:'16px', background:'rgba(0,200,150,0.1)', border:'1px solid #00c896', borderRadius:'12px', textAlign:'center', fontSize:'14px', color:'#00c896', fontWeight:'700' }}>
          Paiement reussi ! Bienvenue sur ORBIS Pro.
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'24px', maxWidth:'1000px', margin:'0 auto 48px' }}>
        {PLANS.map((plan, i) => (
          <Card key={i} style={{ display:'flex', flexDirection:'column', border: plan.id==='pro'?'2px solid #B22234':'1px solid #1e3a5f', position:'relative' }}>
            {plan.badge && (
              <div style={{ position:'absolute', top:'-12px', left:'50%', transform:'translateX(-50%)', padding:'4px 16px', background: plan.color, borderRadius:'20px', fontSize:'11px', fontWeight:'900', color:'#fff', whiteSpace:'nowrap' }}>
                {plan.badge}
              </div>
            )}
            <div style={{ marginBottom:'20px' }}>
              <h2 style={{ margin:'0 0 4px', fontSize:'20px', fontWeight:'900', color: plan.color }}>{plan.name}</h2>
              <p style={{ margin:'0 0 16px', fontSize:'13px', color:'#4a6fa5' }}>{plan.desc}</p>
              <div style={{ display:'flex', alignItems:'flex-end', gap:'4px' }}>
                <span style={{ fontSize:'40px', fontWeight:'900', color:'#fff' }}>${plan.price}</span>
                <span style={{ fontSize:'14px', color:'#4a6fa5', marginBottom:'8px' }}>/{plan.billing}</span>
              </div>
            </div>
            <button onClick={() => subscribe(plan.id)} disabled={loading===plan.id} style={{ width:'100%', marginBottom:'20px', padding:'12px', fontSize:'14px', fontWeight:'700', borderRadius:'8px', cursor: loading===plan.id?'not-allowed':'pointer', border:'none', background: plan.id==='pro'?'#B22234':plan.id==='enterprise'?'rgba(244,200,66,0.15)':'rgba(255,255,255,0.05)', color: plan.id==='enterprise'?'#f4c842':'#fff' }}>
              {loading===plan.id ? 'Chargement...' : plan.id==='free' ? 'Commencer gratuitement' : 'Souscrire maintenant'}
            </button>
            <div style={{ flex:1 }}>
              {plan.features.map((f,j) => (
                <div key={j} style={{ display:'flex', gap:'8px', marginBottom:'8px', fontSize:'13px', color:'#c8d8f0' }}>
                  <span style={{ color:'#00c896', flexShrink:0 }}>✓</span>{f}
                </div>
              ))}
              {plan.notIncluded.length > 0 && plan.notIncluded.map((f,j) => (
                <div key={j} style={{ display:'flex', gap:'8px', marginBottom:'6px', fontSize:'12px', color:'#2a4a7f' }}>
                  <span style={{ flexShrink:0 }}>✕</span>{f}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:'13px', color:'#4a6fa5', marginBottom:'16px' }}>
          Paiement securise par Stripe • Annulation a tout moment • Remboursement 30 jours
        </div>
        <div style={{ display:'flex', justifyContent:'center', gap:'16px', fontSize:'12px', color:'#2a4a7f', marginBottom:'24px' }}>
          <span>SSL 256-bit</span>
          <span>Carte, virement, crypto</span>
          <span>190 pays</span>
        </div>
        <button onClick={() => router.push('/dashboard')} style={{ background:'transparent', border:'1px solid #1e3a5f', borderRadius:'8px', padding:'10px 20px', color:'#4a6fa5', cursor:'pointer', fontSize:'13px' }}>
          Dashboard
        </button>
      </div>
    </div>
  )
}
