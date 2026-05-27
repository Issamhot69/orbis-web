'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LaunchPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [votes, setVotes] = useState(847)

  return (
    <div style={{ minHeight:'100vh', background:'#060e1a', color:'#fff', fontFamily:'system-ui' }}>

      {/* Nav */}
      <nav style={{ padding:'16px 40px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid #1e3a5f' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'#B22234', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', fontWeight:'900', color:'#fff' }}>◎</div>
          <span style={{ fontSize:'20px', fontWeight:'900' }}>ORBIS</span>
        </div>
        <button onClick={() => router.push('/')} style={{ padding:'8px 20px', background:'#B22234', border:'none', borderRadius:'8px', color:'#fff', cursor:'pointer', fontSize:'13px', fontWeight:'700' }}>Essai gratuit</button>
      </nav>

      {/* Hero */}
      <section style={{ padding:'60px 40px', textAlign:'center', maxWidth:'800px', margin:'0 auto' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'6px 16px', background:'rgba(255,107,0,0.15)', border:'1px solid #ff6b00', borderRadius:'20px', marginBottom:'24px', fontSize:'13px', color:'#ff9944', fontWeight:'700' }}>
          🏆 Product Hunt Launch — Rejoignez le mouvement
        </div>
        <h1 style={{ fontSize:'48px', fontWeight:'900', letterSpacing:'-2px', margin:'0 0 20px' }}>
          ORBIS lance sur<br/>
          <span style={{ color:'#ff6b00' }}>Product Hunt</span>
        </h1>
        <p style={{ fontSize:'18px', color:'#6a8aaa', lineHeight:'1.7', marginBottom:'40px' }}>
          Aidez-nous a atteindre le Top 5 du jour. Votre vote compte. Chaque upvote nous rapproche de 10,000 nouveaux utilisateurs.
        </p>

        {/* Vote Counter */}
        <div style={{ background:'#0a1628', border:'2px solid #ff6b00', borderRadius:'20px', padding:'32px', marginBottom:'40px', display:'inline-block', minWidth:'300px' }}>
          <div style={{ fontSize:'64px', fontWeight:'900', color:'#ff6b00', marginBottom:'8px' }}>
            {votes.toLocaleString()}
          </div>
          <div style={{ fontSize:'14px', color:'#6a8aaa', marginBottom:'20px' }}>upvotes simulés</div>
          <button onClick={() => setVotes(v => v + 1)} style={{ padding:'14px 32px', background:'#ff6b00', border:'none', borderRadius:'10px', color:'#fff', fontSize:'16px', fontWeight:'700', cursor:'pointer', display:'flex', alignItems:'center', gap:'10px', margin:'0 auto' }}>
            <span style={{ fontSize:'20px' }}>▲</span> Upvote ORBIS
          </button>
        </div>

        {/* Checklist Product Hunt */}
        <div style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'14px', padding:'32px', marginBottom:'40px', textAlign:'left' }}>
          <h2 style={{ fontSize:'20px', fontWeight:'900', marginBottom:'20px', color:'#ff6b00' }}>Plan de lancement Product Hunt</h2>
          {[
            { done:true,  task:'Créer compte Product Hunt maker', desc:'hunter.producthunt.com' },
            { done:true,  task:'Préparer assets visuels', desc:'Logo, screenshots, demo video 60s' },
            { done:false, task:'Contacter 50 hunters influents', desc:'Demander leur support avant le launch' },
            { done:false, task:'Préparer la description', desc:'Tagline percutante + bullets features clés' },
            { done:false, task:'Planifier le launch', desc:'Mardi ou mercredi 12:01 AM PST (meilleur timing)' },
            { done:false, task:'Newsletter pre-launch', desc:'Email a votre liste 48h avant' },
            { done:false, task:'Posts LinkedIn + Twitter', desc:'Annonce coordonnée le jour J' },
            { done:false, task:'Répondre a tous les comments', desc:'Engagement = plus de visibilité PH' },
          ].map((item, i) => (
            <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'12px', padding:'12px 0', borderBottom:'1px solid #0f1f3d' }}>
              <div style={{ width:'22px', height:'22px', borderRadius:'50%', background: item.done?'#00c896':'rgba(255,255,255,0.1)', border: item.done?'none':'1px solid #1e3a5f', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', flexShrink:0, marginTop:'2px' }}>
                {item.done ? '✓' : ''}
              </div>
              <div>
                <div style={{ fontSize:'14px', fontWeight:'700', color: item.done?'#fff':'#6a8aaa', textDecoration: item.done?'none':'none' }}>{item.task}</div>
                <div style={{ fontSize:'12px', color:'#4a6fa5', marginTop:'2px' }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Email signup */}
        <div style={{ background:'rgba(255,107,0,0.08)', border:'1px solid #ff6b00', borderRadius:'14px', padding:'32px' }}>
          <h3 style={{ fontSize:'20px', fontWeight:'900', marginBottom:'8px' }}>Soyez notifie le jour du launch</h3>
          <p style={{ fontSize:'14px', color:'#6a8aaa', marginBottom:'20px' }}>Recevez un email le jour J pour voter et partager</p>
          <div style={{ display:'flex', gap:'10px', justifyContent:'center' }}>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.com" style={{ padding:'12px 20px', background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'8px', color:'#fff', fontSize:'14px', outline:'none', width:'280px' }}/>
            <button onClick={() => { if(email) setSubmitted(true) }} style={{ padding:'12px 24px', background:'#ff6b00', border:'none', borderRadius:'8px', color:'#fff', fontSize:'14px', fontWeight:'700', cursor:'pointer' }}>
              {submitted ? 'Inscrit !' : 'Me notifier'}
            </button>
          </div>
        </div>
      </section>

      {/* Strategy */}
      <section style={{ padding:'60px 40px', background:'#0a1628', borderTop:'1px solid #1e3a5f' }}>
        <div style={{ maxWidth:'800px', margin:'0 auto' }}>
          <h2 style={{ fontSize:'28px', fontWeight:'900', marginBottom:'32px', textAlign:'center' }}>Strategie de croissance post-launch</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px' }}>
            {[
              { phase:'Jour 1', icon:'🏆', title:'Product Hunt Top 5', desc:'2000+ upvotes objectif. Trending toute la journee.' },
              { phase:'Semaine 1', icon:'📧', title:'10,000 signups', desc:'Email campaign + Twitter/LinkedIn posts viraux.' },
              { phase:'Mois 1', icon:'💰', title:'100 clients payants', desc:'Free to Pro conversion. Premier MRR $4,900.' },
              { phase:'Mois 3', icon:'🌍', title:'10 pays actifs', desc:'USA, UK, France, Allemagne, Japon, Singapour...' },
              { phase:'Mois 6', icon:'🦄', title:'Series A ready', desc:'100K users. $500K ARR. Pitch deck pret.' },
              { phase:'An 1', icon:'🚀', title:'1M utilisateurs', desc:'Plateforme de reference B2B mondiale.' },
            ].map((s,i) => (
              <div key={i} style={{ background:'#060e1a', border:'1px solid #1e3a5f', borderRadius:'12px', padding:'20px' }}>
                <div style={{ fontSize:'11px', color:'#B22234', fontWeight:'700', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'8px' }}>{s.phase}</div>
                <div style={{ fontSize:'24px', marginBottom:'8px' }}>{s.icon}</div>
                <div style={{ fontSize:'14px', fontWeight:'800', marginBottom:'6px' }}>{s.title}</div>
                <div style={{ fontSize:'12px', color:'#6a8aaa', lineHeight:'1.5' }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding:'24px 40px', borderTop:'1px solid #1e3a5f', textAlign:'center', fontSize:'12px', color:'#4a6fa5' }}>
        ORBIS Inc — Delaware, USA • © 2026 • support@orbis.app
      </footer>
    </div>
  )
}
