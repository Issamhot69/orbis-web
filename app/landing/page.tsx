'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setCount(c => c < 2847 ? c + 37 : 2847), 30)
    return () => clearInterval(timer)
  }, [])

  const stats = [
    { value:'190+', label:'Pays' },
    { value:'24', label:'Modules' },
    { value:'12', label:'Langues' },
    { value:'$0', label:'Pour commencer' },
  ]

  const features = [
    { icon:'🛒', title:'4 Marketplaces', desc:'Services B2B, Wholesale, Dev Market, Investors Hub — tout en un.' },
    { icon:'🎙️', title:'Speech to Speech IA', desc:'Parlez votre langue. Votre partenaire entend dans la sienne. Temps réel.' },
    { icon:'🛂', title:'Trust Passport', desc:'Score de confiance vérifié pour chaque entreprise. Zéro arnaque.' },
    { icon:'📝', title:'Contrats Auto', desc:'Généré, signé, archivé en 30 secondes. 190 juridictions.' },
    { icon:'🔒', title:'Escrow ORBIS', desc:'Paiement bloqué jusqu a livraison confirmée. Argent 100% sécurisé.' },
    { icon:'🛰️', title:'Satellite Tracking', desc:'Suivi GPS temps réel de vos produits partout dans le monde.' },
    { icon:'🤖', title:'AI Assistant', desc:'Analysez, négociez, décidez. Propulsé par Claude (Anthropic).' },
    { icon:'📊', title:'Predictive Deals', desc:'L IA prédit vos deals 72h avant. Agissez au bon moment.' },
  ]

  const testimonials = [
    { name:'Sarah Chen', role:'CEO, TechVentures SF', flag:'🇺🇸', text:'ORBIS replaced 6 tools we were using. Speech-to-speech changed how we do deals globally.' },
    { name:'Klaus Weber', role:'Director, Berlin Trade GmbH', flag:'🇩🇪', text:'We closed a $2M deal with a Japanese partner without a translator. ORBIS made it possible.' },
    { name:'Yuki Tanaka', role:'CTO, Tokyo AI Labs', flag:'🇯🇵', text:'The Trust Passport system is revolutionary. We now know exactly who we are dealing with.' },
  ]

  return (
    <div style={{ minHeight:'100vh', background:'#060e1a', color:'#fff', fontFamily:'system-ui' }}>

      {/* Nav */}
      <nav style={{ padding:'16px 40px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid #1e3a5f', position:'sticky', top:0, background:'rgba(6,14,26,0.95)', backdropFilter:'blur(10px)', zIndex:100 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'linear-gradient(135deg,#B22234,#7a0f1e)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', fontWeight:'900', color:'#fff' }}>◎</div>
          <span style={{ fontSize:'20px', fontWeight:'900', letterSpacing:'-0.5px' }}>ORBIS</span>
          <span style={{ fontSize:'11px', color:'#4a6fa5', background:'rgba(255,255,255,0.05)', padding:'2px 8px', borderRadius:'10px' }}>Delaware, USA</span>
        </div>
        <div style={{ display:'flex', gap:'24px', alignItems:'center' }}>
          {['Produits','Pricing','Investors'].map(item => (
            <a key={item} href={'#'+item.toLowerCase()} style={{ fontSize:'13px', color:'#4a6fa5', textDecoration:'none' }}>{item}</a>
          ))}
          <button onClick={() => router.push('/dashboard')} style={{ padding:'8px 20px', background:'transparent', border:'1px solid #1e3a5f', borderRadius:'8px', color:'#4a6fa5', cursor:'pointer', fontSize:'13px' }}>Connexion</button>
          <button onClick={() => router.push('/')} style={{ padding:'8px 20px', background:'#B22234', border:'none', borderRadius:'8px', color:'#fff', cursor:'pointer', fontSize:'13px', fontWeight:'700' }}>Essai gratuit</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding:'80px 40px', textAlign:'center', maxWidth:'900px', margin:'0 auto' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'6px 16px', background:'rgba(178,34,52,0.15)', border:'1px solid #B22234', borderRadius:'20px', marginBottom:'24px', fontSize:'12px', color:'#B22234', fontWeight:'700' }}>
          🚀 ORBIS v2.0.0 — {count.toLocaleString()} entreprises inscrites
        </div>
        <h1 style={{ fontSize:'56px', fontWeight:'900', letterSpacing:'-2px', lineHeight:'1.1', margin:'0 0 20px', background:'linear-gradient(135deg,#fff 0%,#8899cc 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
          One platform.<br/>Every business.<br/>Everywhere.
        </h1>
        <p style={{ fontSize:'18px', color:'#6a8aaa', lineHeight:'1.7', margin:'0 0 40px', maxWidth:'600px', marginLeft:'auto', marginRight:'auto' }}>
          La première plateforme B2B mondiale qui combine Business OS, 4 Marketplaces et IA — avec Speech-to-Speech temps réel dans 12 langues.
        </p>
        <div style={{ display:'flex', gap:'12px', justifyContent:'center', marginBottom:'20px' }}>
          <button onClick={() => router.push('/')} style={{ padding:'16px 32px', background:'#B22234', border:'none', borderRadius:'10px', color:'#fff', fontSize:'16px', fontWeight:'700', cursor:'pointer' }}>
            Commencer gratuitement →
          </button>
          <button onClick={() => router.push('/dashboard')} style={{ padding:'16px 32px', background:'rgba(255,255,255,0.05)', border:'1px solid #1e3a5f', borderRadius:'10px', color:'#fff', fontSize:'16px', cursor:'pointer' }}>
            Voir la démo live
          </button>
        </div>
        <div style={{ fontSize:'12px', color:'#4a6fa5' }}>Gratuit pour commencer • Pas de carte bancaire • Annulation à tout moment</div>
      </section>

      {/* Stats */}
      <section style={{ padding:'40px', background:'#0a1628', borderTop:'1px solid #1e3a5f', borderBottom:'1px solid #1e3a5f' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', maxWidth:'800px', margin:'0 auto', gap:'20px', textAlign:'center' }}>
          {stats.map((s,i) => (
            <div key={i}>
              <div style={{ fontSize:'36px', fontWeight:'900', color:'#B22234' }}>{s.value}</div>
              <div style={{ fontSize:'13px', color:'#4a6fa5', marginTop:'4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="produits" style={{ padding:'80px 40px', maxWidth:'1100px', margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'48px' }}>
          <h2 style={{ fontSize:'36px', fontWeight:'900', margin:'0 0 12px', letterSpacing:'-1px' }}>Tout ce dont votre entreprise a besoin</h2>
          <p style={{ fontSize:'16px', color:'#6a8aaa' }}>24 modules. Une plateforme. Zéro friction.</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px' }}>
          {features.map((f,i) => (
            <div key={i} style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'14px', padding:'20px' }}>
              <div style={{ fontSize:'28px', marginBottom:'12px' }}>{f.icon}</div>
              <h3 style={{ fontSize:'15px', fontWeight:'800', margin:'0 0 8px' }}>{f.title}</h3>
              <p style={{ fontSize:'12px', color:'#6a8aaa', lineHeight:'1.6', margin:0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section style={{ padding:'80px 40px', background:'#0a1628', borderTop:'1px solid #1e3a5f' }}>
        <div style={{ maxWidth:'800px', margin:'0 auto', textAlign:'center' }}>
          <h2 style={{ fontSize:'36px', fontWeight:'900', margin:'0 0 12px', letterSpacing:'-1px' }}>ORBIS vs les autres</h2>
          <p style={{ fontSize:'16px', color:'#6a8aaa', marginBottom:'40px' }}>Pourquoi choisir ORBIS ?</p>
          <div style={{ background:'#060e1a', border:'1px solid #1e3a5f', borderRadius:'14px', overflow:'hidden' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:'#0f1f3d' }}>
                  {['Fonctionnalité','ORBIS','LinkedIn','Alibaba','Fiverr'].map((h,i) => (
                    <th key={i} style={{ padding:'14px', fontSize:'13px', fontWeight:'700', color: i===1?'#B22234':'#4a6fa5', textAlign:'center', borderBottom:'1px solid #1e3a5f' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Speech-to-Speech IA','✅','❌','❌','❌'],
                  ['Trust Passport','✅','❌','❌','❌'],
                  ['Escrow intégré','✅','❌','⚠️','✅'],
                  ['Satellite Tracking','✅','❌','❌','❌'],
                  ['Wholesale Marketplace','✅','❌','✅','❌'],
                  ['AI Business Coach','✅','❌','❌','❌'],
                  ['Investors Hub','✅','⚠️','❌','❌'],
                  ['Contrats auto','✅','❌','❌','❌'],
                ].map((row,i) => (
                  <tr key={i} style={{ borderBottom:'1px solid #0f1f3d' }}>
                    {row.map((cell,j) => (
                      <td key={j} style={{ padding:'12px', fontSize:'13px', textAlign:'center', color: j===0?'#c8d8f0':j===1?'#00c896':'#4a6fa5', fontWeight: j===1?'700':'400' }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding:'80px 40px', maxWidth:'1000px', margin:'0 auto' }}>
        <h2 style={{ fontSize:'36px', fontWeight:'900', textAlign:'center', margin:'0 0 40px', letterSpacing:'-1px' }}>Ce que disent nos clients</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'20px' }}>
          {testimonials.map((t,i) => (
            <div key={i} style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'14px', padding:'24px' }}>
              <div style={{ fontSize:'24px', color:'#B22234', marginBottom:'12px' }}>"</div>
              <p style={{ fontSize:'13px', color:'#c8d8f0', lineHeight:'1.7', marginBottom:'16px' }}>{t.text}</p>
              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:'linear-gradient(135deg,#B22234,#3C3B6E)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px' }}>{t.flag}</div>
                <div>
                  <div style={{ fontSize:'13px', fontWeight:'700' }}>{t.name}</div>
                  <div style={{ fontSize:'11px', color:'#4a6fa5' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'80px 40px', background:'linear-gradient(135deg,#0f1f3d 0%,#1a0a0f 100%)', textAlign:'center', borderTop:'1px solid #1e3a5f' }}>
        <h2 style={{ fontSize:'40px', fontWeight:'900', margin:'0 0 16px', letterSpacing:'-1px' }}>Rejoignez ORBIS aujourd hui</h2>
        <p style={{ fontSize:'16px', color:'#6a8aaa', marginBottom:'32px' }}>Gratuit pour commencer. Aucune carte bancaire requise.</p>
        <div style={{ display:'flex', gap:'12px', justifyContent:'center', marginBottom:'16px' }}>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.com" style={{ padding:'14px 20px', background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'10px', color:'#fff', fontSize:'14px', outline:'none', width:'300px' }}/>
          <button onClick={() => { if(email) { setSubmitted(true); router.push('/') } }} style={{ padding:'14px 28px', background:'#B22234', border:'none', borderRadius:'10px', color:'#fff', fontSize:'14px', fontWeight:'700', cursor:'pointer' }}>
            {submitted ? '✅ Inscrit !' : 'Commencer gratuitement →'}
          </button>
        </div>
        <div style={{ fontSize:'12px', color:'#4a6fa5' }}>
          ORBIS Inc — Delaware, USA • support@orbis.app • 🇺🇸
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding:'32px 40px', borderTop:'1px solid #1e3a5f', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ width:'28px', height:'28px', borderRadius:'8px', background:'#B22234', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', fontWeight:'900', color:'#fff' }}>◎</div>
          <span style={{ fontSize:'14px', fontWeight:'700' }}>ORBIS</span>
          <span style={{ fontSize:'12px', color:'#4a6fa5' }}>© 2026 ORBIS Inc. Delaware, USA</span>
        </div>
        <div style={{ display:'flex', gap:'20px', fontSize:'12px', color:'#4a6fa5' }}>
          <a href="#" style={{ color:'#4a6fa5', textDecoration:'none' }}>Privacy</a>
          <a href="#" style={{ color:'#4a6fa5', textDecoration:'none' }}>Terms</a>
          <a href="#" style={{ color:'#4a6fa5', textDecoration:'none' }}>Contact</a>
          <a href="/pricing" style={{ color:'#4a6fa5', textDecoration:'none' }}>Pricing</a>
        </div>
      </footer>
    </div>
  )
}
