'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CardPage() {
  const router = useRouter()
  const [flipped, setFlipped] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [scanned, setScanned] = useState(false)
  const [selectedCard, setSelectedCard] = useState<any>(null)
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('orbis_user')||'{}') : {}

  const CARDS = [
    { name:'John Doe',       role:'CEO',      company:'ORBIS Corp',     country:'🇫🇷', trust:95, score:847, skills:['AI','B2B','SaaS'], deals:23,  color:'#1a6fff' },
    { name:'Yuki Tanaka',    role:'CTO',      company:'Tokyo AI Labs',  country:'🇯🇵', trust:97, score:923, skills:['AI','Quantum','ML'], deals:89, color:'#00c896' },
    { name:'Sarah Anderson', role:'Investor', company:'NY Consulting',  country:'🇺🇸', trust:91, score:801, skills:['VC','PE','M&A'], deals:234,   color:'#a78bfa' },
    { name:'Li Wei',         role:'Director', company:'Shanghai Trade', country:'🇨🇳', trust:85, score:756, skills:['Trade','Manufacturing'], deals:156, color:'#f4c842' },
  ]

  useEffect(() => {
    if (!localStorage.getItem('orbis_token')) { router.push('/'); return }
  }, [])

  async function scanCard() {
    setScanning(true)
    await new Promise(r => setTimeout(r, 2000))
    setScanning(false)
    setScanned(true)
    setSelectedCard(CARDS[Math.floor(Math.random() * CARDS.length)])
  }

  const myCard = {
    name: (user.firstName||'John') + ' ' + (user.lastName||'Doe'),
    role: 'CEO & Fondateur',
    company: 'ORBIS Corp',
    country: '🇫🇷',
    trust: 95,
    score: 847,
    skills: ['AI', 'B2B', 'SaaS', 'Marketplace'],
    deals: 23,
    color: '#1a6fff',
  }

  return (
    <div style={{ minHeight:'100vh', background:'#060e1a', color:'#fff', fontFamily:'system-ui', padding:'24px' }}>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <button onClick={() => router.push('/dashboard')} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid #1e3a5f', borderRadius:'8px', padding:'8px 14px', color:'#4a6fa5', cursor:'pointer', fontSize:'12px' }}>← Dashboard</button>
          <div>
            <h1 style={{ margin:0, fontSize:'22px', fontWeight:'900' }}>🪪 AR Business Card</h1>
            <p style={{ margin:0, fontSize:'12px', color:'#4a6fa5' }}>Carte de visite intelligente — Trust Passport en réalité augmentée</p>
          </div>
        </div>
        <div style={{ padding:'6px 14px', background:'rgba(167,139,250,0.15)', border:'1px solid #a78bfa', borderRadius:'20px', fontSize:'12px', color:'#a78bfa', fontWeight:'700' }}>
          🥽 AR Mode — Ready
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px' }}>

        {/* Left — My Card */}
        <div>
          <div style={{ fontSize:'13px', fontWeight:'800', color:'#5b9fff', marginBottom:'16px' }}>Ma carte ORBIS</div>

          {/* 3D Card */}
          <div onClick={() => setFlipped(!flipped)} style={{ cursor:'pointer', marginBottom:'20px', perspective:'1000px' }}>
            <div style={{ position:'relative', width:'100%', height:'200px', transformStyle:'preserve-3d', transition:'transform 0.6s', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)' }}>

              {/* Front */}
              <div style={{ position:'absolute', inset:0, backfaceVisibility:'hidden', background:'linear-gradient(135deg,#0f1f3d,#1a3a6f)', border:'1px solid #1e3a5f', borderRadius:'16px', padding:'24px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <div style={{ fontSize:'22px', fontWeight:'900', color:'#1a6fff' }}>◎ ORBIS</div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:'11px', color:'#4a6fa5' }}>Trust Score</div>
                    <div style={{ fontSize:'22px', fontWeight:'900', color:'#00c896' }}>{myCard.trust}</div>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize:'22px', fontWeight:'900', marginBottom:'4px' }}>{myCard.name}</div>
                  <div style={{ fontSize:'13px', color:'#5b9fff', marginBottom:'4px' }}>{myCard.role}</div>
                  <div style={{ fontSize:'12px', color:'#4a6fa5' }}>{myCard.country} {myCard.company}</div>
                </div>
                <div style={{ display:'flex', gap:'6px' }}>
                  {myCard.skills.slice(0,3).map((s,i) => (
                    <span key={i} style={{ padding:'2px 8px', background:'rgba(26,111,255,0.2)', border:'1px solid #1a6fff', borderRadius:'10px', fontSize:'10px', color:'#5b9fff' }}>{s}</span>
                  ))}
                </div>
                <div style={{ position:'absolute', bottom:'16px', right:'16px', fontSize:'10px', color:'#2a4a7f' }}>Cliquer pour retourner</div>
              </div>

              {/* Back */}
              <div style={{ position:'absolute', inset:0, backfaceVisibility:'hidden', transform:'rotateY(180deg)', background:'linear-gradient(135deg,#1a3a6f,#0f1f3d)', border:'1px solid #1e3a5f', borderRadius:'16px', padding:'24px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
                <div style={{ fontSize:'13px', fontWeight:'800', color:'#5b9fff' }}>QR Code ORBIS</div>
                <div style={{ display:'flex', justifyContent:'center' }}>
                  <div style={{ width:'100px', height:'100px', background:'#fff', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'2px', padding:'8px' }}>
                    {[...Array(8)].map((_,i) => (
                      <div key={i} style={{ display:'flex', gap:'2px' }}>
                        {[...Array(8)].map((_,j) => (
                          <div key={j} style={{ width:'8px', height:'8px', background: (i+j)%3===0||i===0||j===0||i===7||j===7?'#000':'transparent' }}></div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign:'center' }}>
                  <div style={{ fontSize:'11px', color:'#4a6fa5', marginBottom:'4px' }}>Score crédit</div>
                  <div style={{ fontSize:'28px', fontWeight:'900', color:'#00c896' }}>{myCard.score}/1000</div>
                  <div style={{ fontSize:'10px', color:'#4a6fa5' }}>Vérifié par ORBIS Trust Network</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'10px', marginBottom:'16px' }}>
            {[
              { icon:'🛂', label:'Trust',  value:myCard.trust+'/100' },
              { icon:'💳', label:'Credit', value:myCard.score },
              { icon:'🤝', label:'Deals',  value:myCard.deals },
            ].map((s,i) => (
              <div key={i} style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'10px', padding:'12px', textAlign:'center' }}>
                <div style={{ fontSize:'18px', marginBottom:'4px' }}>{s.icon}</div>
                <div style={{ fontSize:'16px', fontWeight:'900', color:'#1a6fff' }}>{s.value}</div>
                <div style={{ fontSize:'10px', color:'#4a6fa5' }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display:'flex', gap:'10px' }}>
            <button style={{ flex:1, padding:'10px', background:'rgba(26,111,255,0.15)', border:'1px solid #1a6fff', borderRadius:'10px', color:'#5b9fff', fontSize:'12px', fontWeight:'700', cursor:'pointer' }}>
              📤 Partager ma carte
            </button>
            <button style={{ flex:1, padding:'10px', background:'rgba(167,139,250,0.15)', border:'1px solid #a78bfa', borderRadius:'10px', color:'#a78bfa', fontSize:'12px', fontWeight:'700', cursor:'pointer' }}>
              🥽 Mode AR
            </button>
          </div>
        </div>

        {/* Right — Scanner */}
        <div>
          <div style={{ fontSize:'13px', fontWeight:'800', color:'#5b9fff', marginBottom:'16px' }}>Scanner une carte</div>

          {/* Scanner */}
          <div style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'14px', padding:'24px', textAlign:'center', marginBottom:'16px' }}>
            <div style={{ width:'200px', height:'200px', margin:'0 auto 20px', border:'2px solid #1a6fff', borderRadius:'12px', position:'relative', display:'flex', alignItems:'center', justifyContent:'center', background:'#060e1a' }}>
              <div style={{ position:'absolute', top:'-1px', left:'-1px', width:'20px', height:'20px', border:'3px solid #1a6fff', borderRight:'none', borderBottom:'none', borderRadius:'4px 0 0 0' }}></div>
              <div style={{ position:'absolute', top:'-1px', right:'-1px', width:'20px', height:'20px', border:'3px solid #1a6fff', borderLeft:'none', borderBottom:'none', borderRadius:'0 4px 0 0' }}></div>
              <div style={{ position:'absolute', bottom:'-1px', left:'-1px', width:'20px', height:'20px', border:'3px solid #1a6fff', borderRight:'none', borderTop:'none', borderRadius:'0 0 0 4px' }}></div>
              <div style={{ position:'absolute', bottom:'-1px', right:'-1px', width:'20px', height:'20px', border:'3px solid #1a6fff', borderLeft:'none', borderTop:'none', borderRadius:'0 0 4px 0' }}></div>
              {scanning && <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'#1a6fff', animation:'scan 1s ease-in-out infinite' }}></div>}
              <div style={{ fontSize:'32px' }}>{scanning ? '📡' : '📷'}</div>
            </div>
            <style>{`@keyframes scan { 0%{top:0} 100%{top:196px} }`}</style>
            <button onClick={scanCard} disabled={scanning} style={{ padding:'12px 32px', background: scanning?'#1e3a5f':'#a78bfa', border:'none', borderRadius:'10px', color:'#fff', fontSize:'13px', fontWeight:'700', cursor: scanning?'not-allowed':'pointer', marginBottom:'10px' }}>
              {scanning ? '⏳ Scan en cours...' : '🔍 Scanner un QR Code'}
            </button>
            <div style={{ fontSize:'11px', color:'#4a6fa5' }}>Pointez vers une carte ORBIS ou un QR code</div>
          </div>

          {/* Scanned Result */}
          {scanned && selectedCard && (
            <div style={{ background:'#0a1628', border:'2px solid '+selectedCard.color, borderRadius:'14px', padding:'20px' }}>
              <div style={{ fontSize:'12px', color:'#00c896', marginBottom:'12px', fontWeight:'700' }}>✅ Carte scannée avec succès</div>
              <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px' }}>
                <div style={{ width:'48px', height:'48px', borderRadius:'12px', background:selectedCard.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', fontWeight:'900', color:'#fff' }}>
                  {selectedCard.name[0]}
                </div>
                <div>
                  <div style={{ fontSize:'15px', fontWeight:'800' }}>{selectedCard.country} {selectedCard.name}</div>
                  <div style={{ fontSize:'12px', color:'#5b9fff' }}>{selectedCard.role} — {selectedCard.company}</div>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', marginBottom:'14px' }}>
                {[
                  { label:'Trust Score',  value:selectedCard.trust+'/100', color:'#00c896' },
                  { label:'Credit Score', value:selectedCard.score+'/1000', color:'#1a6fff' },
                  { label:'Deals',        value:selectedCard.deals,         color:'#a78bfa' },
                  { label:'Statut',       value:'Vérifié ✓',               color:'#00c896' },
                ].map((m,i) => (
                  <div key={i} style={{ background:'#060e1a', border:'1px solid #1e3a5f', borderRadius:'8px', padding:'10px' }}>
                    <div style={{ fontSize:'10px', color:'#4a6fa5', marginBottom:'2px' }}>{m.label}</div>
                    <div style={{ fontSize:'14px', fontWeight:'900', color:m.color }}>{m.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'6px', marginBottom:'14px' }}>
                {selectedCard.skills.map((s: string, i: number) => (
                  <span key={i} style={{ padding:'3px 10px', background:'rgba(255,255,255,0.05)', border:'1px solid #1e3a5f', borderRadius:'10px', fontSize:'11px', color:'#c8d8f0' }}>{s}</span>
                ))}
              </div>
              <div style={{ display:'flex', gap:'8px' }}>
                <button style={{ flex:1, padding:'8px', background:'rgba(26,111,255,0.15)', border:'1px solid #1a6fff', borderRadius:'8px', color:'#5b9fff', fontSize:'11px', fontWeight:'700', cursor:'pointer' }}>💬 Contacter</button>
                <button style={{ flex:1, padding:'8px', background:'rgba(0,200,150,0.15)', border:'1px solid #00c896', borderRadius:'8px', color:'#00c896', fontSize:'11px', fontWeight:'700', cursor:'pointer' }}>🤝 Proposer deal</button>
              </div>
            </div>
          )}

          {/* Network Cards */}
          <div style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'14px', padding:'16px', marginTop:'16px' }}>
            <div style={{ fontSize:'13px', fontWeight:'800', color:'#5b9fff', marginBottom:'12px' }}>Cartes dans mon réseau</div>
            {CARDS.map((c,i) => (
              <div key={i} onClick={() => setSelectedCard(c)} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'8px', borderRadius:'8px', cursor:'pointer', marginBottom:'4px', background: selectedCard?.name===c.name?'rgba(26,111,255,0.1)':'transparent' }}>
                <div style={{ width:'32px', height:'32px', borderRadius:'8px', background:c.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:'900', color:'#fff' }}>{c.name[0]}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:'12px', fontWeight:'700' }}>{c.country} {c.name}</div>
                  <div style={{ fontSize:'10px', color:'#4a6fa5' }}>{c.role} — {c.company}</div>
                </div>
                <div style={{ fontSize:'13px', fontWeight:'900', color:'#00c896' }}>{c.trust}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
