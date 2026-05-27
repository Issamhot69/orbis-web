'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const SLIDES = [
  {
    id:1, title:'ORBIS', subtitle:'One platform. Every business. Everywhere.',
    type:'cover',
    content: null,
  },
  {
    id:2, title:'Le probleme', subtitle:'Le commerce B2B mondial est brise',
    type:'problem',
    points:[
      { icon:'😤', text:'LinkedIn pour reseau, Alibaba pour produits, Fiverr pour services, Zoom pour reunions, DocuSign pour contrats — 6 outils differents' },
      { icon:'🗣️', text:'Barriere de langue — 70% des deals B2B echouent a cause de la communication' },
      { icon:'🚫', text:'Zero confiance — impossible de verifier qui est vraiment votre partenaire' },
      { icon:'💸', text:'$4.2 trillion de commerce B2B bloque par des frictions inutiles chaque annee' },
    ]
  },
  {
    id:3, title:'La solution', subtitle:'ORBIS — Le Business OS mondial',
    type:'solution',
    points:[
      { icon:'🌍', text:'4 Marketplaces en 1 — Services B2B, Wholesale, Dev Market, Investors Hub' },
      { icon:'🎙️', text:'Speech-to-Speech IA — parlez votre langue, votre partenaire entend dans la sienne' },
      { icon:'🛂', text:'Trust Passport — score de confiance verifie pour chaque entreprise' },
      { icon:'🤖', text:'AI Business Coach — analyse, negocie, predit vos deals 72h avant' },
    ]
  },
  {
    id:4, title:'Marche', subtitle:'Une opportunite de $850 milliards',
    type:'market',
    stats:[
      { label:'TAM Global B2B', value:'$850B', desc:'Marche total adressable' },
      { label:'SAM Platforms', value:'$120B', desc:'Marche adressable serviceable' },
      { label:'SOM Year 1', value:'$12M', desc:'Part de marche atteignable' },
      { label:'CAGR', value:'23%', desc:'Croissance annuelle du marche' },
    ]
  },
  {
    id:5, title:'Traction', subtitle:'ORBIS croit vite',
    type:'traction',
    stats:[
      { label:'Modules live', value:'24', desc:'Business OS complet' },
      { label:'API Endpoints', value:'80+', desc:'Backend robuste' },
      { label:'Langues', value:'12', desc:'Speech-to-Speech' },
      { label:'Deploye', value:'Today', desc:'Vercel + Railway' },
    ]
  },
  {
    id:6, title:'Business Model', subtitle:'3 sources de revenus',
    type:'business',
    points:[
      { icon:'💳', text:'SaaS Subscriptions — Free / Pro $49/mois / Enterprise $199/mois' },
      { icon:'💰', text:'Transaction Fees — 2.5% sur chaque deal marketplace' },
      { icon:'🔌', text:'API Access — $0.01 par requete pour les developpeurs' },
    ]
  },
  {
    id:7, title:'Competitive Advantage', subtitle:'Pourquoi ORBIS gagne',
    type:'competition',
    points:[
      { icon:'🏆', text:'Speech-to-Speech IA temps reel — aucun concurrent ne fait ca' },
      { icon:'🛂', text:'Trust Passport — systeme de confiance B2B unique au monde' },
      { icon:'🔒', text:'Escrow + Tracking satellite integres — securite totale des transactions' },
      { icon:'🤖', text:'Predictive Deal Engine — IA qui predit vos deals 72h avant' },
    ]
  },
  {
    id:8, title:'Use of Funds', subtitle:'$5M Series A',
    type:'funds',
    allocations:[
      { label:'Product & Engineering', pct:40, amount:'$2M', color:'#B22234' },
      { label:'Sales & Marketing', pct:30, amount:'$1.5M', color:'#1a6fff' },
      { label:'Operations', pct:20, amount:'$1M', color:'#00c896' },
      { label:'Legal & Compliance', pct:10, amount:'$500K', color:'#f4c842' },
    ]
  },
  {
    id:9, title:'Team', subtitle:'Les fondateurs ORBIS',
    type:'team',
    members:[
      { name:'Issam', role:'CEO & Founder', bg:'Vision produit, architecture plateforme, 5 ans B2B', flag:'🇺🇸' },
      { name:'CTO', role:'Co-Founder CTO', bg:'Ex-Google, Expert Node.js + AI, 10 ans engineering', flag:'🇩🇪' },
      { name:'CMO', role:'Co-Founder CMO', bg:'Ex-LinkedIn, Growth hacker, 100K+ B2B connections', flag:'🇬🇧' },
    ]
  },
  {
    id:10, title:'The Ask', subtitle:'Rejoignez la revolution B2B',
    type:'ask',
    content: null,
  },
]

export default function PitchPage() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const slide = SLIDES[currentSlide]

  return (
    <div style={{ minHeight:'100vh', background:'#060e1a', color:'#fff', fontFamily:'system-ui', display:'flex', flexDirection:'column' }}>

      {/* Nav */}
      <nav style={{ padding:'12px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid #1e3a5f', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ width:'32px', height:'32px', borderRadius:'8px', background:'#B22234', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', fontWeight:'900', color:'#fff' }}>◎</div>
          <span style={{ fontSize:'16px', fontWeight:'900' }}>ORBIS Pitch Deck</span>
          <span style={{ fontSize:'11px', color:'#4a6fa5' }}>Series A — $5M</span>
        </div>
        <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
          <span style={{ fontSize:'12px', color:'#4a6fa5' }}>{currentSlide+1} / {SLIDES.length}</span>
          <button onClick={() => router.push('/landing')} style={{ padding:'6px 14px', background:'transparent', border:'1px solid #1e3a5f', borderRadius:'6px', color:'#4a6fa5', cursor:'pointer', fontSize:'12px' }}>← Retour</button>
        </div>
      </nav>

      {/* Slide */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'40px' }}>
        <div style={{ width:'100%', maxWidth:'900px', minHeight:'500px', background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'20px', padding:'60px', display:'flex', flexDirection:'column', justifyContent:'center' }}>

          {/* Slide number */}
          <div style={{ fontSize:'11px', color:'#B22234', fontWeight:'700', textTransform:'uppercase', letterSpacing:'2px', marginBottom:'16px' }}>
            {String(slide.id).padStart(2,'0')} / {String(SLIDES.length).padStart(2,'0')}
          </div>

          <h1 style={{ fontSize: slide.type==='cover'?'56px':'40px', fontWeight:'900', letterSpacing:'-2px', margin:'0 0 12px', color:'#fff' }}>
            {slide.title}
          </h1>
          <p style={{ fontSize:'18px', color:'#6a8aaa', margin:'0 0 40px' }}>{slide.subtitle}</p>

          {/* Cover */}
          {slide.type === 'cover' && (
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:'80px', marginBottom:'24px' }}>◎</div>
              <div style={{ display:'flex', gap:'20px', justifyContent:'center', marginBottom:'32px' }}>
                {['$850B Market','24 Modules','12 Languages','Series A $5M'].map((tag,i) => (
                  <span key={i} style={{ padding:'6px 16px', background:'rgba(178,34,52,0.15)', border:'1px solid #B22234', borderRadius:'20px', fontSize:'12px', color:'#B22234', fontWeight:'700' }}>{tag}</span>
                ))}
              </div>
              <div style={{ fontSize:'14px', color:'#4a6fa5' }}>ORBIS Inc — Delaware, USA • 2026</div>
            </div>
          )}

          {/* Points */}
          {(slide.type === 'problem' || slide.type === 'solution' || slide.type === 'business' || slide.type === 'competition') && (
            <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
              {(slide as any).points.map((p: any, i: number) => (
                <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'16px', padding:'16px', background:'rgba(255,255,255,0.03)', border:'1px solid #1e3a5f', borderRadius:'12px' }}>
                  <span style={{ fontSize:'24px', flexShrink:0 }}>{p.icon}</span>
                  <span style={{ fontSize:'15px', color:'#c8d8f0', lineHeight:'1.6' }}>{p.text}</span>
                </div>
              ))}
            </div>
          )}

          {/* Stats */}
          {(slide.type === 'market' || slide.type === 'traction') && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px' }}>
              {(slide as any).stats.map((s: any, i: number) => (
                <div key={i} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid #1e3a5f', borderRadius:'12px', padding:'24px', textAlign:'center' }}>
                  <div style={{ fontSize:'36px', fontWeight:'900', color:'#B22234', marginBottom:'8px' }}>{s.value}</div>
                  <div style={{ fontSize:'14px', fontWeight:'700', color:'#fff', marginBottom:'4px' }}>{s.label}</div>
                  <div style={{ fontSize:'12px', color:'#4a6fa5' }}>{s.desc}</div>
                </div>
              ))}
            </div>
          )}

          {/* Funds */}
          {slide.type === 'funds' && (
            <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              {(slide as any).allocations.map((a: any, i: number) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:'16px' }}>
                  <div style={{ width:'160px', fontSize:'13px', color:'#c8d8f0', flexShrink:0 }}>{a.label}</div>
                  <div style={{ flex:1, height:'32px', background:'#1e3a5f', borderRadius:'6px', overflow:'hidden' }}>
                    <div style={{ width:a.pct+'%', height:'100%', background:a.color, borderRadius:'6px', display:'flex', alignItems:'center', paddingLeft:'12px' }}>
                      <span style={{ fontSize:'12px', fontWeight:'700', color:'#fff' }}>{a.pct}%</span>
                    </div>
                  </div>
                  <div style={{ width:'80px', fontSize:'14px', fontWeight:'700', color:a.color, textAlign:'right', flexShrink:0 }}>{a.amount}</div>
                </div>
              ))}
              <div style={{ marginTop:'16px', padding:'16px', background:'rgba(178,34,52,0.1)', border:'1px solid #B22234', borderRadius:'10px', textAlign:'center', fontSize:'14px', color:'#B22234', fontWeight:'700' }}>
                Runway 24 mois — Objectif $500K ARR a 12 mois
              </div>
            </div>
          )}

          {/* Team */}
          {slide.type === 'team' && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'20px' }}>
              {(slide as any).members.map((m: any, i: number) => (
                <div key={i} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid #1e3a5f', borderRadius:'14px', padding:'24px', textAlign:'center' }}>
                  <div style={{ width:'64px', height:'64px', borderRadius:'50%', background:'linear-gradient(135deg,#B22234,#3C3B6E)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'28px', margin:'0 auto 16px' }}>{m.flag}</div>
                  <div style={{ fontSize:'18px', fontWeight:'900', marginBottom:'4px' }}>{m.name}</div>
                  <div style={{ fontSize:'13px', color:'#B22234', fontWeight:'700', marginBottom:'10px' }}>{m.role}</div>
                  <div style={{ fontSize:'12px', color:'#6a8aaa', lineHeight:'1.5' }}>{m.bg}</div>
                </div>
              ))}
            </div>
          )}

          {/* Ask */}
          {slide.type === 'ask' && (
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:'64px', fontWeight:'900', color:'#B22234', marginBottom:'16px' }}>$5,000,000</div>
              <div style={{ fontSize:'18px', color:'#6a8aaa', marginBottom:'32px' }}>Series A Round — ORBIS Inc</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px', marginBottom:'32px' }}>
                {[
                  { label:'Valuation', value:'$20M', desc:'Pre-money' },
                  { label:'Equity', value:'25%', desc:'Pour les investisseurs' },
                  { label:'Closing', value:'Q3 2026', desc:'Target date' },
                ].map((s,i) => (
                  <div key={i} style={{ background:'rgba(178,34,52,0.1)', border:'1px solid #B22234', borderRadius:'12px', padding:'20px' }}>
                    <div style={{ fontSize:'28px', fontWeight:'900', color:'#B22234' }}>{s.value}</div>
                    <div style={{ fontSize:'13px', fontWeight:'700', color:'#fff' }}>{s.label}</div>
                    <div style={{ fontSize:'11px', color:'#4a6fa5' }}>{s.desc}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize:'16px', color:'#c8d8f0', marginBottom:'8px' }}>contact@orbis.app</div>
              <div style={{ fontSize:'13px', color:'#4a6fa5' }}>ORBIS Inc — Delaware, USA</div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ padding:'16px 24px', borderTop:'1px solid #1e3a5f', display:'flex', alignItems:'center', justifyContent:'center', gap:'12px', flexShrink:0 }}>
        <button onClick={() => setCurrentSlide(s => Math.max(0,s-1))} disabled={currentSlide===0} style={{ padding:'10px 24px', background: currentSlide===0?'#1e3a5f':'#0a1628', border:'1px solid #1e3a5f', borderRadius:'8px', color: currentSlide===0?'#2a4a7f':'#fff', cursor: currentSlide===0?'not-allowed':'pointer', fontSize:'14px' }}>
          ← Previous
        </button>
        <div style={{ display:'flex', gap:'6px' }}>
          {SLIDES.map((_,i) => (
            <button key={i} onClick={() => setCurrentSlide(i)} style={{ width:'8px', height:'8px', borderRadius:'50%', border:'none', background: i===currentSlide?'#B22234':'#1e3a5f', cursor:'pointer', padding:0 }}/>
          ))}
        </div>
        <button onClick={() => setCurrentSlide(s => Math.min(SLIDES.length-1,s+1))} disabled={currentSlide===SLIDES.length-1} style={{ padding:'10px 24px', background: currentSlide===SLIDES.length-1?'#1e3a5f':'#B22234', border:'none', borderRadius:'8px', color:'#fff', cursor: currentSlide===SLIDES.length-1?'not-allowed':'pointer', fontSize:'14px', fontWeight:'700' }}>
          Next →
        </button>
      </div>
    </div>
  )
}
