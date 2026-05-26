'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const COMPANIES = [
  { name:'ORBIS Corp',       country:'🇲🇦 Maroc',        score:847, grade:'AA', revenue:'$2.5M', employees:12,  founded:2024, payments:98, trust:95, deals:23, risk:'Très faible', color:'#00c896' },
  { name:'Dubai Ventures',   country:'🇦🇪 UAE',           score:791, grade:'A',  revenue:'$45M',  employees:120, founded:2018, payments:94, trust:88, deals:156, risk:'Faible',     color:'#1a6fff' },
  { name:'Tokyo AI Labs',    country:'🇯🇵 Japon',         score:923, grade:'AAA',revenue:'$12M',  employees:45,  founded:2021, payments:99, trust:97, deals:89,  risk:'Minimal',    color:'#00c896' },
  { name:'London Capital',   country:'🇬🇧 UK',            score:856, grade:'AA', revenue:'$200M', employees:450, founded:2005, payments:97, trust:95, deals:892, risk:'Très faible', color:'#00c896' },
  { name:'Berlin Tech GmbH', country:'🇩🇪 Allemagne',    score:734, grade:'B+', revenue:'$8M',   employees:28,  founded:2020, payments:89, trust:82, deals:45,  risk:'Modéré',     color:'#f4c842' },
  { name:'NY Consulting',    country:'🇺🇸 USA',           score:801, grade:'A',  revenue:'$35M',  employees:85,  founded:2015, payments:95, trust:91, deals:234, risk:'Faible',     color:'#1a6fff' },
]

export default function CreditPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<any>(COMPANIES[0])
  const [search, setSearch] = useState('')
  const [scanning, setScanning] = useState(false)
  const [scanned, setScanned] = useState(false)
  const [customCompany, setCustomCompany] = useState('')
  const token = typeof window !== 'undefined' ? localStorage.getItem('orbis_token') : ''

  useEffect(() => {
    if (!token) { router.push('/'); return }
  }, [])

  async function scanCompany() {
    if (!customCompany.trim()) return
    setScanning(true)
    await new Promise(r => setTimeout(r, 2000))
    setScanning(false)
    setScanned(true)
    const newCompany = {
      name: customCompany,
      country: '🌍 International',
      score: Math.floor(Math.random() * 300 + 600),
      grade: ['B', 'B+', 'A', 'A+', 'AA'][Math.floor(Math.random() * 5)],
      revenue: '$' + (Math.random() * 50 + 1).toFixed(1) + 'M',
      employees: Math.floor(Math.random() * 200 + 10),
      founded: Math.floor(Math.random() * 20 + 2005),
      payments: Math.floor(Math.random() * 20 + 80),
      trust: Math.floor(Math.random() * 20 + 75),
      deals: Math.floor(Math.random() * 100 + 5),
      risk: 'Modéré',
      color: '#f4c842',
    }
    setSelected(newCompany)
    setCustomCompany('')
  }

  const scoreColor = (s: number) => s >= 850 ? '#00c896' : s >= 750 ? '#1a6fff' : s >= 650 ? '#f4c842' : '#ff6b6b'
  const scoreLabel = (s: number) => s >= 850 ? 'Excellent' : s >= 750 ? 'Très bon' : s >= 650 ? 'Bon' : 'Risqué'

  const filtered = COMPANIES.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.country.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ minHeight:'100vh', background:'#060e1a', color:'#fff', fontFamily:'system-ui', padding:'24px' }}>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <button onClick={() => router.push('/dashboard')} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid #1e3a5f', borderRadius:'8px', padding:'8px 14px', color:'#4a6fa5', cursor:'pointer', fontSize:'12px' }}>← Dashboard</button>
          <div>
            <h1 style={{ margin:0, fontSize:'22px', fontWeight:'900' }}>💳 Business Credit Score</h1>
            <p style={{ margin:0, fontSize:'12px', color:'#4a6fa5' }}>Score de crédit B2B en temps réel — avant chaque deal</p>
          </div>
        </div>
        <div style={{ padding:'6px 14px', background:'rgba(0,200,150,0.1)', border:'1px solid #00c896', borderRadius:'20px', fontSize:'12px', color:'#00c896', fontWeight:'700' }}>
          🟢 Credit AI — Live
        </div>
      </div>

      {/* Scan new company */}
      <div style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'14px', padding:'20px', marginBottom:'20px' }}>
        <div style={{ fontSize:'13px', fontWeight:'800', color:'#5b9fff', marginBottom:'12px' }}>Scanner une nouvelle entreprise</div>
        <div style={{ display:'flex', gap:'10px' }}>
          <input value={customCompany} onChange={e => setCustomCompany(e.target.value)} onKeyDown={e => e.key==='Enter' && scanCompany()} placeholder="Nom de l'entreprise, site web ou numéro SIRET..." style={{ flex:1, padding:'12px 16px', background:'#060e1a', border:'1px solid #1e3a5f', borderRadius:'10px', color:'#fff', fontSize:'13px', outline:'none' }}/>
          <button onClick={scanCompany} disabled={scanning || !customCompany.trim()} style={{ padding:'12px 24px', background: scanning?'#1e3a5f':'#1a6fff', border:'none', borderRadius:'10px', color:'#fff', fontSize:'13px', fontWeight:'700', cursor: scanning?'not-allowed':'pointer' }}>
            {scanning ? '⏳ Scan...' : '🔍 Scanner'}
          </button>
        </div>
        {scanned && <div style={{ marginTop:'10px', fontSize:'12px', color:'#00c896' }}>✅ Analyse terminée — score calculé en 2 secondes</div>}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'320px 1fr', gap:'20px' }}>

        {/* Left — Company List */}
        <div style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'14px', padding:'16px' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." style={{ width:'100%', padding:'8px 12px', background:'#060e1a', border:'1px solid #1e3a5f', borderRadius:'8px', color:'#fff', fontSize:'12px', outline:'none', marginBottom:'12px', boxSizing:'border-box' }}/>
          {filtered.map((c, i) => (
            <div key={i} onClick={() => setSelected(c)} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px', borderRadius:'10px', cursor:'pointer', background: selected?.name===c.name?'rgba(26,111,255,0.15)':'transparent', marginBottom:'4px', border: selected?.name===c.name?'1px solid #1a6fff':'1px solid transparent' }}>
              <div style={{ width:'40px', height:'40px', borderRadius:'10px', background:'rgba(26,111,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:'900', color:scoreColor(c.score), flexShrink:0 }}>
                {c.grade}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:'13px', fontWeight:'700', color:'#fff' }}>{c.name}</div>
                <div style={{ fontSize:'10px', color:'#4a6fa5' }}>{c.country}</div>
              </div>
              <div style={{ fontSize:'18px', fontWeight:'900', color:scoreColor(c.score) }}>{c.score}</div>
            </div>
          ))}
        </div>

        {/* Right — Score Detail */}
        {selected && (
          <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>

            {/* Main Score */}
            <div style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'14px', padding:'24px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'20px' }}>
                <div style={{ position:'relative', width:'100px', height:'100px', flexShrink:0 }}>
                  <svg viewBox="0 0 100 100" style={{ width:'100%', height:'100%', transform:'rotate(-90deg)' }}>
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#1e3a5f" strokeWidth="8"/>
                    <circle cx="50" cy="50" r="42" fill="none" stroke={scoreColor(selected.score)} strokeWidth="8" strokeDasharray={`${(selected.score/1000)*264} 264`} strokeLinecap="round"/>
                  </svg>
                  <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                    <div style={{ fontSize:'22px', fontWeight:'900', color:scoreColor(selected.score) }}>{selected.score}</div>
                    <div style={{ fontSize:'10px', color:'#4a6fa5' }}>/ 1000</div>
                  </div>
                </div>
                <div style={{ flex:1 }}>
                  <h2 style={{ margin:'0 0 4px', fontSize:'20px', fontWeight:'900' }}>{selected.name}</h2>
                  <div style={{ fontSize:'13px', color:'#4a6fa5', marginBottom:'8px' }}>{selected.country}</div>
                  <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                    <span style={{ padding:'4px 12px', background:'rgba(0,200,150,0.15)', border:'1px solid '+scoreColor(selected.score), borderRadius:'20px', fontSize:'12px', color:scoreColor(selected.score), fontWeight:'700' }}>
                      Grade {selected.grade}
                    </span>
                    <span style={{ padding:'4px 12px', background:'rgba(255,255,255,0.05)', border:'1px solid #1e3a5f', borderRadius:'20px', fontSize:'12px', color:'#c8d8f0' }}>
                      {scoreLabel(selected.score)}
                    </span>
                    <span style={{ padding:'4px 12px', background:'rgba(255,255,255,0.05)', border:'1px solid #1e3a5f', borderRadius:'20px', fontSize:'12px', color:'#c8d8f0' }}>
                      Risque {selected.risk}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'12px' }}>
              {[
                { label:'Revenus annuels',  value:selected.revenue,            icon:'💰' },
                { label:'Employés',         value:selected.employees,          icon:'👥' },
                { label:'Fondée en',        value:selected.founded,            icon:'📅' },
                { label:'Taux paiement',    value:selected.payments+'%',       icon:'✅' },
                { label:'Trust Score',      value:selected.trust+'/100',       icon:'🛂' },
                { label:'Deals complétés',  value:selected.deals,              icon:'🤝' },
              ].map((m, i) => (
                <div key={i} style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'10px', padding:'14px' }}>
                  <div style={{ fontSize:'18px', marginBottom:'6px' }}>{m.icon}</div>
                  <div style={{ fontSize:'16px', fontWeight:'900', color:'#fff' }}>{m.value}</div>
                  <div style={{ fontSize:'10px', color:'#4a6fa5', marginTop:'2px' }}>{m.label}</div>
                </div>
              ))}
            </div>

            {/* Score Bars */}
            <div style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'14px', padding:'20px' }}>
              <div style={{ fontSize:'13px', fontWeight:'800', color:'#5b9fff', marginBottom:'16px' }}>Détail du score</div>
              {[
                { label:'Historique paiements', value:selected.payments, color:'#00c896' },
                { label:'Trust Passport',        value:selected.trust,    color:'#1a6fff' },
                { label:'Activité marketplace',  value:Math.min(100, selected.deals), color:'#a78bfa' },
                { label:'Ancienneté',            value:Math.min(100, (2026-selected.founded)*5), color:'#f4c842' },
              ].map((b, i) => (
                <div key={i} style={{ marginBottom:'12px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                    <span style={{ fontSize:'12px', color:'#c8d8f0' }}>{b.label}</span>
                    <span style={{ fontSize:'12px', fontWeight:'700', color:b.color }}>{b.value}%</span>
                  </div>
                  <div style={{ height:'6px', background:'#1e3a5f', borderRadius:'3px', overflow:'hidden' }}>
                    <div style={{ width:b.value+'%', height:'100%', background:b.color, borderRadius:'3px', transition:'width 1s' }}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display:'flex', gap:'10px' }}>
              <button style={{ flex:1, padding:'12px', background:'rgba(26,111,255,0.15)', border:'1px solid #1a6fff', borderRadius:'10px', color:'#5b9fff', fontSize:'13px', fontWeight:'700', cursor:'pointer' }}>
                📊 Rapport complet
              </button>
              <button style={{ flex:1, padding:'12px', background:'rgba(0,200,150,0.15)', border:'1px solid #00c896', borderRadius:'10px', color:'#00c896', fontSize:'13px', fontWeight:'700', cursor:'pointer' }}>
                🤝 Initier un deal
              </button>
              <button style={{ flex:1, padding:'12px', background:'rgba(255,107,107,0.1)', border:'1px solid #ff6b6b', borderRadius:'10px', color:'#ff6b6b', fontSize:'13px', fontWeight:'700', cursor:'pointer' }}>
                ⚠️ Signaler
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
