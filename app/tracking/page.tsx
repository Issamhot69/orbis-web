'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

const SHIPMENTS = [
  { id:'ORB-2026-001', product:'Serveurs IA ORBIS', from:'Shanghai, China', to:'Paris, France', status:'in-transit', progress:65, carrier:'ORBIS Satellite', weight:'2.4T', value:'$850,000', eta:'26 Mai 2026', coords:[ {lat:31.2, lng:121.5}, {lat:35.0, lng:100.0}, {lat:40.0, lng:60.0}, {lat:44.0, lng:20.0}, {lat:48.8, lng:2.3} ], currentStep:3, temp:'18°C', humidity:'45%', signal:'99.8%' },
  { id:'ORB-2026-002', product:'Equipements Manufacturing', from:'Dubai, UAE', to:'San Francisco, USA', status:'in-transit', progress:40, carrier:'ORBIS GPS Pro', weight:'5.1T', value:'$1,200,000', eta:'28 Mai 2026', coords:[ {lat:25.2, lng:55.3}, {lat:24.0, lng:45.0}, {lat:22.0, lng:30.0}, {lat:28.0, lng:10.0}, {lat:33.5, lng:-7.6} ], currentStep:2, temp:'22°C', humidity:'38%', signal:'97.2%' },
  { id:'ORB-2026-003', product:'Materiaux Rares', from:'Lagos, Nigeria', to:'Tokyo, Japan', status:'customs', progress:25, carrier:'ORBIS Space Track', weight:'800KG', value:'$3,500,000', eta:'02 Juin 2026', coords:[ {lat:6.5, lng:3.4}, {lat:15.0, lng:30.0}, {lat:20.0, lng:60.0}, {lat:25.0, lng:100.0}, {lat:35.7, lng:139.7} ], currentStep:1, temp:'20°C', humidity:'52%', signal:'95.1%' },
  { id:'ORB-2026-004', product:'Composants Quantiques', from:'New York, USA', to:'Riyadh, Saudi Arabia', status:'delivered', progress:100, carrier:'ORBIS Quantum Track', weight:'120KG', value:'$12,000,000', eta:'Livre', coords:[ {lat:40.7, lng:-74.0}, {lat:45.0, lng:-30.0}, {lat:40.0, lng:0.0}, {lat:35.0, lng:25.0}, {lat:24.7, lng:46.7} ], currentStep:4, temp:'N/A', humidity:'N/A', signal:'100%' },
]

const STATUS_CONFIG: any = {
  'in-transit': { color:'#1a6fff', bg:'rgba(26,111,255,0.15)', label:'En Transit', icon:'🚢' },
  'customs':    { color:'#f4c842', bg:'rgba(244,200,66,0.15)',  label:'Douanes',   icon:'🛃' },
  'delivered':  { color:'#00c896', bg:'rgba(0,200,150,0.15)',   label:'Livré',     icon:'✅' },
  'delayed':    { color:'#ff6b6b', bg:'rgba(255,107,107,0.15)', label:'Retard',    icon:'⚠️' },
}

export default function TrackingPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<any>(SHIPMENTS[0])
  const [tick, setTick] = useState(0)
  const [view, setView] = useState('list')

  useEffect(() => {
    const token = localStorage.getItem('orbis_token')
    if (!token) { router.push('/'); return }
    const interval = setInterval(() => setTick(t => t + 1), 2000)
    return () => clearInterval(interval)
  }, [])

  const animatedProgress = (base: number) => Math.min(100, base + (tick % 3))

  return (
    <div style={{ minHeight:'100vh', background:'#060e1a', color:'#fff', fontFamily:'system-ui', padding:'24px' }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <button onClick={() => router.push('/dashboard')} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid #1e3a5f', borderRadius:'8px', padding:'8px 14px', color:'#4a6fa5', cursor:'pointer', fontSize:'12px' }}>← Dashboard</button>
          <div>
            <h1 style={{ margin:0, fontSize:'22px', fontWeight:'900' }}>🛰️ ORBIS Satellite Tracking</h1>
            <p style={{ margin:0, fontSize:'12px', color:'#4a6fa5' }}>Suivi GPS/Satellite en temps reel — Produits mondiaux</p>
          </div>
        </div>
        <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'6px', padding:'6px 14px', background:'rgba(0,200,150,0.1)', border:'1px solid #00c896', borderRadius:'20px' }}>
            <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#00c896' }}></div>
            <span style={{ fontSize:'12px', color:'#00c896', fontWeight:'700' }}>Satellite ORBIS — Live</span>
          </div>
          <div style={{ padding:'6px 14px', background:'rgba(26,111,255,0.1)', border:'1px solid #1a6fff', borderRadius:'20px', fontSize:'12px', color:'#5b9fff', fontWeight:'700' }}>
            {SHIPMENTS.length} envois actifs
          </div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'380px 1fr', gap:'16px' }}>

        {/* Left — Shipments List */}
        <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
          <div style={{ fontSize:'11px', color:'#4a6fa5', fontWeight:'700', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'4px' }}>Envois en cours</div>
          {SHIPMENTS.map((s, i) => {
            const cfg = STATUS_CONFIG[s.status]
            return (
              <div key={i} onClick={() => setSelected(s)} style={{ background: selected?.id===s.id ? '#0f1f3d' : '#0a1628', border:'1px solid '+(selected?.id===s.id?'#1a6fff':'#1e3a5f'), borderRadius:'12px', padding:'14px', cursor:'pointer', transition:'all 0.2s' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'8px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                    <span style={{ fontSize:'18px' }}>{cfg.icon}</span>
                    <div>
                      <div style={{ fontSize:'12px', fontWeight:'800', color:'#fff' }}>{s.id}</div>
                      <div style={{ fontSize:'10px', color:'#4a6fa5' }}>{s.carrier}</div>
                    </div>
                  </div>
                  <span style={{ padding:'3px 8px', background:cfg.bg, border:'1px solid '+cfg.color, borderRadius:'10px', fontSize:'10px', color:cfg.color, fontWeight:'700' }}>{cfg.label}</span>
                </div>
                <div style={{ fontSize:'13px', fontWeight:'700', marginBottom:'4px' }}>{s.product}</div>
                <div style={{ fontSize:'11px', color:'#4a6fa5', marginBottom:'10px' }}>{s.from} → {s.to}</div>
                <div style={{ background:'#060e1a', borderRadius:'6px', height:'6px', overflow:'hidden' }}>
                  <div style={{ width: animatedProgress(s.progress) + '%', height:'100%', background: s.status==='delivered'?'#00c896':s.status==='customs'?'#f4c842':'#1a6fff', borderRadius:'6px', transition:'width 0.5s' }}></div>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', marginTop:'4px' }}>
                  <span style={{ fontSize:'10px', color:'#4a6fa5' }}>{animatedProgress(s.progress)}%</span>
                  <span style={{ fontSize:'10px', color:'#4a6fa5' }}>ETA: {s.eta}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Right — Detail */}
        {selected && (
          <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>

            {/* Map Simulation */}
            <div style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'14px', padding:'20px' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px' }}>
                <div style={{ fontSize:'14px', fontWeight:'800', color:'#5b9fff' }}>🗺️ Carte Satellite — {selected.id}</div>
                <div style={{ fontSize:'11px', color:'#00c896', display:'flex', alignItems:'center', gap:'4px' }}>
                  <div style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#00c896' }}></div>
                  Signal {selected.signal}
                </div>
              </div>

              {/* SVG World Map Simulation */}
              <div style={{ background:'#060e1a', borderRadius:'10px', padding:'16px', position:'relative', overflow:'hidden' }}>
                <svg viewBox="0 0 700 320" style={{ width:'100%', height:'200px' }}>
                  {/* Grid */}
                  {[0,1,2,3,4,5,6].map(i => <line key={'h'+i} x1="0" y1={i*50} x2="700" y2={i*50} stroke="#1e3a5f" strokeWidth="0.5"/>)}
                  {[0,1,2,3,4,5,6,7,8,9,10,11,12,13].map(i => <line key={'v'+i} x1={i*54} y1="0" x2={i*54} y2="320" stroke="#1e3a5f" strokeWidth="0.5"/>)}

                  {/* Continents simplified */}
                  <ellipse cx="120" cy="160" rx="80" ry="60" fill="#0d2040" stroke="#1e3a5f" strokeWidth="1"/>
                  <ellipse cx="340" cy="140" rx="100" ry="70" fill="#0d2040" stroke="#1e3a5f" strokeWidth="1"/>
                  <ellipse cx="520" cy="150" rx="120" ry="80" fill="#0d2040" stroke="#1e3a5f" strokeWidth="1"/>
                  <ellipse cx="200" cy="230" rx="50" ry="40" fill="#0d2040" stroke="#1e3a5f" strokeWidth="1"/>
                  <ellipse cx="600" cy="240" rx="40" ry="30" fill="#0d2040" stroke="#1e3a5f" strokeWidth="1"/>

                  {/* Route */}
                  {selected.coords.map((c: any, i: number) => {
                    const x = ((c.lng + 180) / 360) * 700
                    const y = ((90 - c.lat) / 180) * 320
                    const next = selected.coords[i+1]
                    if (!next) return null
                    const nx = ((next.lng + 180) / 360) * 700
                    const ny = ((90 - next.lat) / 180) * 320
                    return <line key={i} x1={x} y1={y} x2={nx} y2={ny} stroke={i < selected.currentStep ? '#1a6fff' : '#1e3a5f'} strokeWidth="2" strokeDasharray={i >= selected.currentStep ? '4,4' : 'none'}/>
                  })}

                  {/* Points */}
                  {selected.coords.map((c: any, i: number) => {
                    const x = ((c.lng + 180) / 360) * 700
                    const y = ((90 - c.lat) / 180) * 320
                    const isActive = i === selected.currentStep
                    return (
                      <g key={i}>
                        <circle cx={x} cy={y} r={isActive ? 8 : 5} fill={isActive ? '#1a6fff' : i < selected.currentStep ? '#00c896' : '#1e3a5f'} stroke={isActive ? '#5b9fff' : 'none'} strokeWidth="2"/>
                        {isActive && <circle cx={x} cy={y} r={12} fill="none" stroke="#1a6fff" strokeWidth="1" opacity={tick%2===0?'0.8':'0.3'}/>}
                      </g>
                    )
                  })}

                  {/* Labels */}
                  {[
                    {name:'FROM', coord:selected.coords[0]},
                    {name:'TO',   coord:selected.coords[selected.coords.length-1]},
                  ].map(({name, coord}) => {
                    const x = ((coord.lng + 180) / 360) * 700
                    const y = ((90 - coord.lat) / 180) * 320
                    return <text key={name} x={x} y={y-12} fill="#4a6fa5" fontSize="9" textAnchor="middle">{name}</text>
                  })}
                </svg>
                <div style={{ position:'absolute', bottom:'8px', right:'8px', fontSize:'10px', color:'#2a4a7f' }}>ORBIS Satellite Network v2.0</div>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'10px' }}>
              {[
                {icon:'📦', label:'Produit', value:selected.product},
                {icon:'💰', label:'Valeur', value:selected.value},
                {icon:'⚖️', label:'Poids', value:selected.weight},
                {icon:'📅', label:'ETA', value:selected.eta},
                {icon:'🌡️', label:'Temperature', value:selected.temp},
                {icon:'💧', label:'Humidite', value:selected.humidity},
                {icon:'📡', label:'Signal', value:selected.signal},
                {icon:'🚢', label:'Carrier', value:selected.carrier},
              ].map((stat, i) => (
                <div key={i} style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'10px', padding:'12px' }}>
                  <div style={{ fontSize:'16px', marginBottom:'4px' }}>{stat.icon}</div>
                  <div style={{ fontSize:'10px', color:'#4a6fa5', marginBottom:'2px' }}>{stat.label}</div>
                  <div style={{ fontSize:'12px', fontWeight:'700', color:'#fff' }}>{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Route Steps */}
            <div style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'14px', padding:'20px' }}>
              <div style={{ fontSize:'13px', fontWeight:'800', color:'#5b9fff', marginBottom:'16px' }}>Etapes de livraison</div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                {selected.coords.map((_: any, i: number) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', flex: i < selected.coords.length-1 ? 1 : 0 }}>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'4px' }}>
                      <div style={{ width:'28px', height:'28px', borderRadius:'50%', background: i <= selected.currentStep ? '#1a6fff' : '#1e3a5f', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', border: i === selected.currentStep ? '2px solid #5b9fff' : 'none' }}>
                        {i < selected.currentStep ? '✓' : i === selected.currentStep ? '📍' : i+1}
                      </div>
                      <div style={{ fontSize:'9px', color: i <= selected.currentStep ? '#5b9fff' : '#2a4a7f', textAlign:'center', maxWidth:'60px' }}>
                        {i === 0 ? 'Depart' : i === selected.coords.length-1 ? 'Arrivee' : 'Etape '+i}
                      </div>
                    </div>
                    {i < selected.coords.length-1 && (
                      <div style={{ flex:1, height:'2px', background: i < selected.currentStep ? '#1a6fff' : '#1e3a5f', margin:'0 4px', marginBottom:'16px' }}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display:'flex', gap:'10px' }}>
              <button onClick={() => alert('Alerte configuree pour '+selected.id)} style={{ flex:1, padding:'12px', background:'rgba(26,111,255,0.15)', border:'1px solid #1a6fff', borderRadius:'10px', color:'#5b9fff', fontSize:'13px', fontWeight:'700', cursor:'pointer' }}>
                🔔 Configurer alertes
              </button>
              <button onClick={() => alert('Rapport genere pour '+selected.id)} style={{ flex:1, padding:'12px', background:'rgba(0,200,150,0.15)', border:'1px solid #00c896', borderRadius:'10px', color:'#00c896', fontSize:'13px', fontWeight:'700', cursor:'pointer' }}>
                📊 Rapport detaille
              </button>
              <button onClick={() => alert('Litige ouvert pour '+selected.id)} style={{ flex:1, padding:'12px', background:'rgba(255,107,107,0.15)', border:'1px solid #ff6b6b', borderRadius:'10px', color:'#ff6b6b', fontSize:'13px', fontWeight:'700', cursor:'pointer' }}>
                ⚠️ Signaler probleme
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
