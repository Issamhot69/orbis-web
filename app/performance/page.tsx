'use client'
import { useEffect, useState } from 'react'
import { PageLayout, Card, Badge, StatsGrid, SectionTitle, colors } from '../components/orbis-ui'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4080'

export default function PerformancePage() {
  const [metrics, setMetrics]   = useState<any>(null)
  const [loading, setLoading]   = useState(true)
  const [history, setHistory]   = useState<any[]>([])

  useEffect(() => {
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 5000)
    return () => clearInterval(interval)
  }, [])

  async function fetchMetrics() {
    try {
      const res  = await fetch(API + '/metrics')
      const data = await res.json()
      setMetrics(data)
      setHistory(prev => [...prev.slice(-19), { ...data, time: new Date().toLocaleTimeString('fr-FR') }])
    } catch(e) {} finally { setLoading(false) }
  }

  const getLatencyColor = (ms: number) => {
    if (ms < 100) return colors.success
    if (ms < 300) return colors.warning
    return colors.danger
  }

  const getErrorRateColor = (rate: number) => {
    if (rate < 1) return colors.success
    if (rate < 5) return colors.warning
    return colors.danger
  }

  const errorRate = metrics ? Math.round((metrics.requests.errors / Math.max(metrics.requests.total, 1)) * 100) : 0

  return (
    <PageLayout title="⚡ Performance & Monitoring" subtitle="Surveillance temps reel de l infrastructure ORBIS">

      {loading ? (
        <div style={{ textAlign:'center', color: colors.textMuted, padding:'60px' }}>
          <div style={{ fontSize:'32px', marginBottom:'12px' }}>⚡</div>
          Chargement des metriques...
        </div>
      ) : metrics ? (
        <>
          <StatsGrid stats={[
            { icon:'⏱️', label:'Latence moyenne',   value: metrics.requests.avgMs + 'ms', color: getLatencyColor(metrics.requests.avgMs) },
            { icon:'📊', label:'Total requetes',    value: metrics.requests.total,         color: colors.info },
            { icon:'❌', label:'Taux d erreur',     value: errorRate + '%',               color: getErrorRateColor(errorRate) },
            { icon:'🕐', label:'Uptime serveur',    value: metrics.uptime,                color: colors.success },
          ]}/>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' }}>

            {/* Server Health */}
            <Card>
              <SectionTitle>Sante du serveur</SectionTitle>
              <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                {[
                  { label:'Statut API',        value:'En ligne',          color: colors.success, icon:'🟢' },
                  { label:'Version Node.js',   value: metrics.node,       color: colors.info,    icon:'🟦' },
                  { label:'Environnement',     value: metrics.env,        color: colors.warning, icon:'⚙️' },
                  { label:'Memoire utilisee',  value: metrics.memory.heapUsed, color: colors.info, icon:'💾' },
                  { label:'Memoire totale',    value: metrics.memory.heapTotal, color: colors.textMuted, icon:'📦' },
                  { label:'RAM process (RSS)', value: metrics.memory.rss, color: colors.textMuted, icon:'🖥️' },
                ].map((item, i) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px', background: colors.bg, border:'1px solid '+colors.border, borderRadius:'8px' }}>
                    <span style={{ fontSize:'12px', color: colors.textMuted }}>{item.icon} {item.label}</span>
                    <span style={{ fontSize:'12px', fontWeight:'700', color: item.color }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Services Status */}
            <Card>
              <SectionTitle>Statut des services</SectionTitle>
              <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                {[
                  { name:'API Backend',       status:'online',  latency:'< 50ms',   icon:'⚙️' },
                  { name:'WebSocket',         status:'online',  latency:'< 10ms',   icon:'🔌' },
                  { name:'PostgreSQL',        status:'online',  latency:'< 20ms',   icon:'🐘' },
                  { name:'Vercel Frontend',   status:'online',  latency:'< 100ms',  icon:'▲' },
                  { name:'Railway Backend',   status:'offline', latency:'N/A',      icon:'🚂' },
                  { name:'Stripe Payments',   status:'demo',    latency:'< 200ms',  icon:'💳' },
                  { name:'Anthropic AI',      status:'limited', latency:'< 500ms',  icon:'🤖' },
                  { name:'CORS Protection',   status:'online',  latency:'< 1ms',    icon:'🛡️' },
                ].map((svc, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px', background: colors.bg, border:'1px solid '+colors.border, borderRadius:'8px' }}>
                    <span style={{ fontSize:'16px' }}>{svc.icon}</span>
                    <span style={{ flex:1, fontSize:'12px', color: colors.text }}>{svc.name}</span>
                    <span style={{ fontSize:'11px', color: colors.textMuted }}>{svc.latency}</span>
                    <Badge color={svc.status==='online'?'success':svc.status==='offline'?'danger':svc.status==='demo'?'warning':'default'}>
                      {svc.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Request History */}
          {history.length > 1 && (
            <Card style={{ marginTop:'20px' }}>
              <SectionTitle>Historique des metriques (5s)</SectionTitle>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12px' }}>
                  <thead>
                    <tr style={{ borderBottom:'1px solid '+colors.border }}>
                      {['Heure','Requetes','Erreurs','Latence moy.','Heap utilise'].map(h => (
                        <th key={h} style={{ padding:'8px 12px', textAlign:'left', color: colors.textMuted, fontWeight:'700', fontSize:'11px' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {history.slice().reverse().map((h, i) => (
                      <tr key={i} style={{ borderBottom:'1px solid rgba(30,58,95,0.3)' }}>
                        <td style={{ padding:'8px 12px', color: colors.textMuted, fontFamily:'monospace' }}>{h.time}</td>
                        <td style={{ padding:'8px 12px', color: colors.info }}>{h.requests.total}</td>
                        <td style={{ padding:'8px 12px', color: h.requests.errors > 0 ? colors.danger : colors.success }}>{h.requests.errors}</td>
                        <td style={{ padding:'8px 12px', color: getLatencyColor(h.requests.avgMs), fontWeight:'700' }}>{h.requests.avgMs}ms</td>
                        <td style={{ padding:'8px 12px', color: colors.text }}>{h.memory?.heapUsed}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ fontSize:'11px', color: colors.textMuted, marginTop:'10px', textAlign:'center' }}>
                Mise a jour automatique toutes les 5 secondes
              </div>
            </Card>
          )}
        </>
      ) : (
        <div style={{ textAlign:'center', color: colors.danger, padding:'60px' }}>
          <div style={{ fontSize:'32px', marginBottom:'12px' }}>❌</div>
          Backend inaccessible — verifiez que le serveur tourne sur le port 4080
        </div>
      )}
    </PageLayout>
  )
}
