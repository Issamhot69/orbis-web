'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

const API = 'http://localhost:4080'

const MOCK_NODES = [
  { id:'1', name:'ORBIS Corp',        industry:'Technology',    location:'Casablanca', size:'startup',    connections:8,  trustScore:95, color:'#1a6fff' },
  { id:'2', name:'Dubai Ventures',    industry:'Finance',       location:'Dubai',      size:'enterprise', connections:12, trustScore:88, color:'#f4c842' },
  { id:'3', name:'Tokyo AI Labs',     industry:'Technology',    location:'Tokyo',      size:'startup',    connections:6,  trustScore:92, color:'#00c896' },
  { id:'4', name:'London Capital',    industry:'Finance',       location:'London',     size:'enterprise', connections:15, trustScore:97, color:'#a78bfa' },
  { id:'5', name:'Shanghai Trade',    industry:'Manufacturing', location:'Shanghai',   size:'large',      connections:10, trustScore:85, color:'#ff6b6b' },
  { id:'6', name:'NY Consulting',     industry:'Consulting',    location:'New York',   size:'medium',     connections:7,  trustScore:91, color:'#00c896' },
  { id:'7', name:'Berlin Tech',       industry:'Technology',    location:'Berlin',     size:'startup',    connections:5,  trustScore:89, color:'#1a6fff' },
  { id:'8', name:'Singapore Hub',     industry:'Logistics',     location:'Singapore',  size:'large',      connections:11, trustScore:94, color:'#f4c842' },
  { id:'9', name:'Riyadh Invest',     industry:'Finance',       location:'Riyadh',     size:'enterprise', connections:9,  trustScore:87, color:'#a78bfa' },
  { id:'10', name:'Lagos Growth',     industry:'Agriculture',   location:'Lagos',      size:'medium',     connections:4,  trustScore:82, color:'#00c896' },
]

const MOCK_CONNECTIONS = [
  {from:'1', to:'2'}, {from:'1', to:'3'}, {from:'1', to:'4'},
  {from:'2', to:'5'}, {from:'2', to:'9'}, {from:'3', to:'7'},
  {from:'4', to:'6'}, {from:'4', to:'8'}, {from:'5', to:'10'},
  {from:'6', to:'7'}, {from:'8', to:'9'}, {from:'1', to:'8'},
]

export default function UniversePage() {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selected, setSelected] = useState<any>(null)
  const [search, setSearch] = useState('')
  const [filterIndustry, setFilterIndustry] = useState('')
  const [stats, setStats] = useState({ nodes:0, connections:0, countries:0, industries:0 })
  const animRef = useRef<number>(0)
  const posRef = useRef<any>({})
  const velRef = useRef<any>({})

  const filtered = MOCK_NODES.filter(n => {
    if (search && !n.name.toLowerCase().includes(search.toLowerCase()) && !n.location.toLowerCase().includes(search.toLowerCase())) return false
    if (filterIndustry && n.industry !== filterIndustry) return false
    return true
  })

  const industries = [...new Set(MOCK_NODES.map(n => n.industry))]

  useEffect(() => {
    const token = localStorage.getItem('orbis_token')
    if (!token) { router.push('/'); return }
    setStats({ nodes: MOCK_NODES.length, connections: MOCK_CONNECTIONS.length, countries: 10, industries: industries.length })
    initPositions()
    animate()
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  function initPositions() {
    MOCK_NODES.forEach((n, i) => {
      const angle = (i / MOCK_NODES.length) * Math.PI * 2
      const r = 160
      posRef.current[n.id] = { x: 300 + r * Math.cos(angle), y: 200 + r * Math.sin(angle) }
      velRef.current[n.id] = { x: 0, y: 0 }
    })
  }

  function animate() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    MOCK_NODES.forEach(n => {
      const pos = posRef.current[n.id]
      if (!pos) return
      MOCK_NODES.forEach(m => {
        if (n.id === m.id) return
        const mpos = posRef.current[m.id]
        if (!mpos) return
        const dx = pos.x - mpos.x
        const dy = pos.y - mpos.y
        const dist = Math.sqrt(dx*dx + dy*dy) || 1
        const force = 800 / (dist * dist)
        velRef.current[n.id].x += (dx / dist) * force * 0.01
        velRef.current[n.id].y += (dy / dist) * force * 0.01
      })
      const cx = 300, cy = 200
      velRef.current[n.id].x += (cx - pos.x) * 0.002
      velRef.current[n.id].y += (cy - pos.y) * 0.002
      velRef.current[n.id].x *= 0.85
      velRef.current[n.id].y *= 0.85
      pos.x += velRef.current[n.id].x
      pos.y += velRef.current[n.id].y
      pos.x = Math.max(30, Math.min(570, pos.x))
      pos.y = Math.max(30, Math.min(370, pos.y))
    })

    ctx.clearRect(0, 0, 600, 400)
    ctx.fillStyle = '#060e1a'
    ctx.fillRect(0, 0, 600, 400)

    MOCK_CONNECTIONS.forEach(conn => {
      const from = posRef.current[conn.from]
      const to   = posRef.current[conn.to]
      if (!from || !to) return
      ctx.beginPath()
      ctx.moveTo(from.x, from.y)
      ctx.lineTo(to.x, to.y)
      ctx.strokeStyle = 'rgba(26,111,255,0.3)'
      ctx.lineWidth = 1
      ctx.stroke()
    })

    MOCK_NODES.forEach(n => {
      const pos = posRef.current[n.id]
      if (!pos) return
      const r = Math.max(12, Math.min(22, n.connections * 1.5))
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2)
      ctx.fillStyle = n.color + (selected?.id === n.id ? 'ff' : '99')
      ctx.fill()
      if (selected?.id === n.id) {
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, r + 4, 0, Math.PI * 2)
        ctx.strokeStyle = n.color
        ctx.lineWidth = 2
        ctx.stroke()
      }
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 8px system-ui'
      ctx.textAlign = 'center'
      ctx.fillText(n.name.slice(0,10), pos.x, pos.y + r + 10)
    })

    animRef.current = requestAnimationFrame(animate)
  }

  function handleCanvasClick(e: any) {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scaleX = 600 / rect.width
    const scaleY = 400 / rect.height
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY
    let found = null
    MOCK_NODES.forEach(n => {
      const pos = posRef.current[n.id]
      if (!pos) return
      const r = Math.max(12, Math.min(22, n.connections * 1.5))
      const dx = x - pos.x
      const dy = y - pos.y
      if (Math.sqrt(dx*dx + dy*dy) < r + 5) found = n
    })
    setSelected(found)
  }

  return (
    <div style={{ minHeight:'100vh', background:'#060e1a', color:'#fff', fontFamily:'system-ui', padding:'24px' }}>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <button onClick={() => router.push('/dashboard')} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid #1e3a5f', borderRadius:'8px', padding:'8px 14px', color:'#4a6fa5', cursor:'pointer', fontSize:'12px' }}>← Dashboard</button>
          <div>
            <h1 style={{ margin:0, fontSize:'22px', fontWeight:'900' }}>🌐 Universe Graph</h1>
            <p style={{ margin:0, fontSize:'12px', color:'#4a6fa5' }}>Reseau B2B mondial ORBIS — {MOCK_NODES.length} entreprises connectees</p>
          </div>
        </div>
        <div style={{ display:'flex', gap:'8px' }}>
          <div style={{ padding:'6px 14px', background:'rgba(0,200,150,0.1)', border:'1px solid #00c896', borderRadius:'20px', fontSize:'12px', color:'#00c896', fontWeight:'700' }}>
            🟢 Live Network
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'14px', marginBottom:'24px' }}>
        {[
          { label:'Entreprises',   value:stats.nodes,       color:'#5b9fff', icon:'🏢' },
          { label:'Connexions',    value:stats.connections, color:'#00c896', icon:'🔗' },
          { label:'Pays',          value:stats.countries,   color:'#f4c842', icon:'🌍' },
          { label:'Industries',    value:stats.industries,  color:'#a78bfa', icon:'🏭' },
        ].map((s, i) => (
          <div key={i} style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'12px', padding:'16px' }}>
            <div style={{ fontSize:'20px', marginBottom:'8px' }}>{s.icon}</div>
            <div style={{ fontSize:'28px', fontWeight:'900', color:s.color }}>{s.value}</div>
            <div style={{ fontSize:'11px', color:'#4a6fa5', marginTop:'4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:'16px' }}>

        {/* Graph */}
        <div style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'14px', overflow:'hidden' }}>
          <div style={{ padding:'12px 16px', borderBottom:'1px solid #1e3a5f', display:'flex', gap:'10px' }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher une entreprise..." style={{ flex:1, padding:'8px 12px', background:'#060e1a', border:'1px solid #1e3a5f', borderRadius:'8px', color:'#fff', fontSize:'12px', outline:'none' }}/>
            <select value={filterIndustry} onChange={e => setFilterIndustry(e.target.value)} style={{ padding:'8px 12px', background:'#060e1a', border:'1px solid #1e3a5f', borderRadius:'8px', color:'#fff', fontSize:'12px', outline:'none' }}>
              <option value="">Toutes industries</option>
              {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
            </select>
          </div>
          <canvas ref={canvasRef} width={600} height={400} onClick={handleCanvasClick} style={{ width:'100%', cursor:'pointer' }}/>
          <div style={{ padding:'10px 16px', borderTop:'1px solid #1e3a5f', fontSize:'11px', color:'#2a4a7f', textAlign:'center' }}>
            Cliquez sur un noeud pour voir les details • Taille = nombre de connexions
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>

          {selected ? (
            <div style={{ background:'#0a1628', border:'2px solid '+selected.color, borderRadius:'14px', padding:'20px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'16px' }}>
                <div style={{ width:'44px', height:'44px', borderRadius:'12px', background:selected.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', fontWeight:'900', color:'#fff' }}>
                  {selected.name[0]}
                </div>
                <div>
                  <div style={{ fontSize:'15px', fontWeight:'800' }}>{selected.name}</div>
                  <div style={{ fontSize:'11px', color:'#4a6fa5' }}>📍 {selected.location}</div>
                </div>
              </div>
              {[
                ['Industrie',    selected.industry],
                ['Taille',       selected.size],
                ['Connexions',   selected.connections],
                ['Trust Score',  selected.trustScore + '/100'],
              ].map(([k,v]) => (
                <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #1e3a5f', fontSize:'12px' }}>
                  <span style={{ color:'#4a6fa5' }}>{k}</span>
                  <span style={{ color:'#fff', fontWeight:'700' }}>{v}</span>
                </div>
              ))}
              <div style={{ marginTop:'14px', display:'flex', gap:'8px' }}>
                <button style={{ flex:1, padding:'8px', background:'rgba(26,111,255,0.15)', border:'1px solid #1a6fff', borderRadius:'8px', color:'#5b9fff', fontSize:'11px', fontWeight:'700', cursor:'pointer' }}>🤝 Connecter</button>
                <button style={{ flex:1, padding:'8px', background:'rgba(0,200,150,0.15)', border:'1px solid #00c896', borderRadius:'8px', color:'#00c896', fontSize:'11px', fontWeight:'700', cursor:'pointer' }}>💬 Message</button>
              </div>
            </div>
          ) : (
            <div style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'14px', padding:'20px', textAlign:'center' }}>
              <div style={{ fontSize:'32px', marginBottom:'10px' }}>🌐</div>
              <div style={{ fontSize:'13px', color:'#5b9fff', fontWeight:'700', marginBottom:'4px' }}>Selectionnez un noeud</div>
              <div style={{ fontSize:'11px', color:'#4a6fa5' }}>Cliquez sur une entreprise dans le graphe</div>
            </div>
          )}

          {/* Node List */}
          <div style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'14px', padding:'16px', flex:1, overflowY:'auto', maxHeight:'400px' }}>
            <div style={{ fontSize:'11px', color:'#4a6fa5', fontWeight:'700', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'10px' }}>Entreprises ({filtered.length})</div>
            {filtered.map((n, i) => (
              <div key={i} onClick={() => setSelected(n)} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'8px', borderRadius:'8px', cursor:'pointer', background: selected?.id===n.id?'rgba(26,111,255,0.1)':'transparent', marginBottom:'4px' }}>
                <div style={{ width:'28px', height:'28px', borderRadius:'8px', background:n.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:'900', color:'#fff', flexShrink:0 }}>{n.name[0]}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:'12px', fontWeight:'600', color:'#fff' }}>{n.name}</div>
                  <div style={{ fontSize:'10px', color:'#4a6fa5' }}>📍 {n.location}</div>
                </div>
                <div style={{ fontSize:'11px', color:n.color, fontWeight:'700' }}>{n.trustScore}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
