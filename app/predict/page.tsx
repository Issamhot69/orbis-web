'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const PREDICTIONS = [
  { company:'Tokyo AI Labs', country:'🇯🇵', probability:94, value:'$500K', timeframe:'18h', signal:'Visite profil 3x + téléchargement brochure', type:'partnership', color:'#00c896', urgent:true },
  { company:'London Capital', country:'🇬🇧', probability:87, value:'$2.1M', timeframe:'36h', signal:'Recherche active marketplace + contact LinkedIn', type:'investment', color:'#1a6fff', urgent:true },
  { company:'NY Consulting', country:'🇺🇸', probability:76, value:'$350K', timeframe:'48h', signal:'3 réunions planifiées + demande contrat', type:'service', color:'#a78bfa', urgent:false },
  { company:'Berlin Tech GmbH', country:'🇩🇪', probability:68, value:'$180K', timeframe:'60h', signal:'Visite pricing page + calcul ROI', type:'license', color:'#f4c842', urgent:false },
  { company:'Singapore Hub', country:'🇸🇬', probability:61, value:'$900K', timeframe:'72h', signal:'Comparaison concurrents + inscription newsletter', type:'partnership', color:'#5b9fff', urgent:false },
]

const SIGNALS = [
  { icon:'👁️', label:'Visites profil',      value:47,  change:'+23%', color:'#1a6fff' },
  { icon:'📥', label:'Téléchargements',     value:12,  change:'+156%', color:'#00c896' },
  { icon:'💬', label:'Messages reçus',      value:8,   change:'+67%', color:'#a78bfa' },
  { icon:'🔍', label:'Recherches matching', value:234, change:'+12%', color:'#f4c842' },
]

export default function PredictPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<any>(PREDICTIONS[0])
  const [tick, setTick] = useState(0)
  const token = typeof window !== 'undefined' ? localStorage.getItem('orbis_token') : ''

  useEffect(() => {
    if (!token) { router.push('/'); return }
    const interval = setInterval(() => setTick(t => t + 1), 3000)
    return () => clearInterval(interval)
  }, [])

  const animatedProb = (base: number) => Math.min(99, base + (tick % 2))

  return (
    <div style={{ minHeight:'100vh', background:'#060e1a', color:'#fff', fontFamily:'system-ui', padding:'24px' }}>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <button onClick={() => router.push('/dashboard')} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid #1e3a5f', borderRadius:'8px', padding:'8px 14px', color:'#4a6fa5', cursor:'pointer', fontSize:'12px' }}>← Dashboard</button>
          <div>
            <h1 style={{ margin:0, fontSize:'22px', fontWeight:'900' }}>🔮 Predictive Deal Engine</h1>
            <p style={{ margin:0, fontSize:'12px', color:'#4a6fa5' }}>IA qui prédit tes deals 72h avant — en temps réel</p>
          </div>
        </div>
        <div style={{ display:'flex', gap:'8px' }}>
          <div style={{ padding:'6px 14px', background:'rgba(0,200,150,0.1)', border:'1px solid #00c896', borderRadius:'20px', fontSize:'12px', color:'#00c896', fontWeight:'700' }}>
            🟢 AI Prediction — Live
          </div>
          <div style={{ padding:'6px 14px', background:'rgba(255,107,107,0.1)', border:'1px solid #ff6b6b', borderRadius:'20px', fontSize:'12px', color:'#ff6b6b', fontWeight:'700' }}>
            🔴 2 deals urgents
          </div>
        </div>
      </div>

      {/* Signal Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'14px', marginBottom:'24px' }}>
        {SIGNALS.map((s, i) => (
          <div key={i} style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'12px', padding:'16px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'8px' }}>
              <span style={{ fontSize:'20px' }}>{s.icon}</span>
              <span style={{ fontSize:'11px', color:'#00c896', fontWeight:'700', background:'rgba(0,200,150,0.1)', padding:'2px 6px', borderRadius:'10px' }}>{s.change}</span>
            </div>
            <div style={{ fontSize:'28px', fontWeight:'900', color:s.color }}>{s.value}</div>
            <div style={{ fontSize:'11px', color:'#4a6fa5', marginTop:'4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'380px 1fr', gap:'20px' }}>

        {/* Left — Predictions List */}
        <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
          <div style={{ fontSize:'11px', color:'#4a6fa5', fontWeight:'700', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'4px' }}>
            Deals prédits — prochaines 72h
          </div>
          {PREDICTIONS.map((p, i) => (
            <div key={i} onClick={() => setSelected(p)} style={{ background: selected?.company===p.company?'#0f1f3d':'#0a1628', border:'1px solid '+(selected?.company===p.company?p.color:'#1e3a5f'), borderRadius:'12px', padding:'14px', cursor:'pointer', position:'relative', overflow:'hidden' }}>
              {p.urgent && (
                <div style={{ position:'absolute', top:'8px', right:'8px', padding:'2px 8px', background:'rgba(255,107,107,0.2)', border:'1px solid #ff6b6b', borderRadius:'10px', fontSize:'9px', color:'#ff6b6b', fontWeight:'700' }}>URGENT</div>
              )}
              <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
                <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:p.color+'22', border:'1px solid '+p.color+'44', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px' }}>
                  {p.country}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:'13px', fontWeight:'800', color:'#fff' }}>{p.company}</div>
                  <div style={{ fontSize:'10px', color:'#4a6fa5' }}>dans {p.timeframe} • {p.type}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:'16px', fontWeight:'900', color:p.color }}>{animatedProb(p.probability)}%</div>
                  <div style={{ fontSize:'10px', color:'#4a6fa5' }}>{p.value}</div>
                </div>
              </div>
              <div style={{ height:'4px', background:'#1e3a5f', borderRadius:'2px', overflow:'hidden' }}>
                <div style={{ width:animatedProb(p.probability)+'%', height:'100%', background:p.color, borderRadius:'2px', transition:'width 0.5s' }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Right — Detail */}
        {selected && (
          <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>

            {/* Main Prediction */}
            <div style={{ background:'#0a1628', border:'2px solid '+selected.color, borderRadius:'14px', padding:'24px' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
                <div>
                  <div style={{ fontSize:'20px', fontWeight:'900', marginBottom:'4px' }}>{selected.country} {selected.company}</div>
                  <div style={{ fontSize:'13px', color:'#4a6fa5' }}>Type: {selected.type} • Délai: {selected.timeframe}</div>
                </div>
                <div style={{ textAlign:'center' }}>
                  <div style={{ fontSize:'48px', fontWeight:'900', color:selected.color }}>{animatedProb(selected.probability)}%</div>
                  <div style={{ fontSize:'11px', color:'#4a6fa5' }}>probabilité deal</div>
                </div>
              </div>

              {/* Probability meter */}
              <div style={{ marginBottom:'20px' }}>
                <div style={{ height:'12px', background:'#1e3a5f', borderRadius:'6px', overflow:'hidden' }}>
                  <div style={{ width:animatedProb(selected.probability)+'%', height:'100%', background:'linear-gradient(90deg,'+selected.color+','+selected.color+'aa)', borderRadius:'6px', transition:'width 0.5s' }}></div>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', marginTop:'4px', fontSize:'10px', color:'#2a4a7f' }}>
                  <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
                </div>
              </div>

              <div style={{ display:'flex', alignItems:'center', gap:'8px', padding:'12px', background:'rgba(255,255,255,0.03)', borderRadius:'10px', border:'1px solid #1e3a5f' }}>
                <span style={{ fontSize:'18px' }}>📡</span>
                <div>
                  <div style={{ fontSize:'11px', color:'#4a6fa5', marginBottom:'2px' }}>Signal détecté</div>
                  <div style={{ fontSize:'13px', color:'#c8d8f0' }}>{selected.signal}</div>
                </div>
              </div>
            </div>

            {/* Value & Timeline */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
              <div style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'12px', padding:'20px', textAlign:'center' }}>
                <div style={{ fontSize:'13px', color:'#4a6fa5', marginBottom:'8px' }}>Valeur estimée</div>
                <div style={{ fontSize:'32px', fontWeight:'900', color:'#00c896' }}>{selected.value}</div>
                <div style={{ fontSize:'11px', color:'#4a6fa5', marginTop:'4px' }}>USD</div>
              </div>
              <div style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'12px', padding:'20px', textAlign:'center' }}>
                <div style={{ fontSize:'13px', color:'#4a6fa5', marginBottom:'8px' }}>Fenêtre optimale</div>
                <div style={{ fontSize:'32px', fontWeight:'900', color:'#f4c842' }}>{selected.timeframe}</div>
                <div style={{ fontSize:'11px', color:'#4a6fa5', marginTop:'4px' }}>pour agir</div>
              </div>
            </div>

            {/* AI Recommendations */}
            <div style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'14px', padding:'20px' }}>
              <div style={{ fontSize:'13px', fontWeight:'800', color:'#5b9fff', marginBottom:'14px' }}>🤖 Recommandations IA</div>
              {[
                { icon:'📧', text:'Envoyer un message personnalisé dans les 2 prochaines heures', priority:'haute' },
                { icon:'📊', text:'Préparer une proposition commerciale avec cas usage similaires', priority:'haute' },
                { icon:'📅', text:'Proposer une réunion de démonstration ORBIS', priority:'moyenne' },
                { icon:'🎁', text:'Offrir un accès trial 14 jours à la plateforme', priority:'moyenne' },
              ].map((r, i) => (
                <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'10px', padding:'10px 0', borderBottom:'1px solid #0f1f3d' }}>
                  <span style={{ fontSize:'16px', flexShrink:0 }}>{r.icon}</span>
                  <div style={{ flex:1, fontSize:'12px', color:'#c8d8f0', lineHeight:'1.5' }}>{r.text}</div>
                  <span style={{ fontSize:'10px', color: r.priority==='haute'?'#ff6b6b':'#f4c842', fontWeight:'700', flexShrink:0 }}>{r.priority}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display:'flex', gap:'10px' }}>
              <button style={{ flex:1, padding:'12px', background:'rgba(0,200,150,0.15)', border:'1px solid #00c896', borderRadius:'10px', color:'#00c896', fontSize:'13px', fontWeight:'700', cursor:'pointer' }}>
                📧 Contacter maintenant
              </button>
              <button style={{ flex:1, padding:'12px', background:'rgba(26,111,255,0.15)', border:'1px solid #1a6fff', borderRadius:'10px', color:'#5b9fff', fontSize:'13px', fontWeight:'700', cursor:'pointer' }}>
                📅 Planifier réunion
              </button>
              <button style={{ flex:1, padding:'12px', background:'rgba(167,139,250,0.15)', border:'1px solid #a78bfa', borderRadius:'10px', color:'#a78bfa', fontSize:'13px', fontWeight:'700', cursor:'pointer' }}>
                📊 Préparer offre
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
