'use client'
import { useEffect, useState } from 'react'
import { PageLayout, Card, Button, Badge, StatsGrid, SectionTitle, colors } from '../components/orbis-ui'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4080'

const priorityColor: any = { high:'danger', medium:'warning', low:'success' }
const typeColor: any = { opportunity:'info', warning:'danger', action:'primary', success:'success', tip:'warning' }

export default function InsightsPage() {
  const [insights, setInsights]             = useState<any[]>([])
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [context, setContext]               = useState<any>(null)
  const [loading, setLoading]               = useState(true)
  const [refreshing, setRefreshing]         = useState(false)
  const [generatedAt, setGeneratedAt]       = useState<string>('')
  const token = typeof window !== 'undefined' ? localStorage.getItem('orbis_token') : ''

  useEffect(() => { if (token) { fetchInsights(); fetchRecommendations() } }, [])

  async function fetchInsights() {
    try {
      const res  = await fetch(API + '/api/ai-insights/insights', { headers:{ Authorization:'Bearer '+token } })
      const data = await res.json()
      setInsights(data.insights || [])
      setContext(data.context)
      setGeneratedAt(data.generatedAt)
    } catch(e) {} finally { setLoading(false) }
  }

  async function fetchRecommendations() {
    try {
      const res  = await fetch(API + '/api/ai-insights/recommendations', { headers:{ Authorization:'Bearer '+token } })
      const data = await res.json()
      setRecommendations(data.recommendations || [])
    } catch(e) {}
  }

  async function refresh() {
    setRefreshing(true)
    await fetchInsights()
    setRefreshing(false)
  }

  return (
    <PageLayout
      title="🧠 AI Business Insights"
      subtitle="Votre coach IA personnel — analyse et recommandations en temps reel"
      action={
        <Button onClick={refresh} disabled={refreshing} variant="ghost">
          {refreshing ? 'Analyse...' : '🔄 Actualiser'}
        </Button>
      }
    >
      {context && (
        <StatsGrid stats={[
          { icon:'🏢', label:'Organisations',  value: context.organizations, color: colors.info },
          { icon:'📁', label:'Projets actifs', value: context.projects,      color: colors.success },
          { icon:'🛒', label:'Listings',       value: context.listings,      color: colors.warning },
          { icon:'💡', label:'Opportunites',   value: context.opportunities, color: colors.primary },
        ]}/>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' }}>

        {/* AI Insights */}
        <div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px' }}>
            <SectionTitle>Insights IA personnalises</SectionTitle>
            {generatedAt && <span style={{ fontSize:'11px', color: colors.textMuted }}>Genere: {new Date(generatedAt).toLocaleTimeString('fr-FR')}</span>}
          </div>

          {loading ? (
            <Card style={{ textAlign:'center', padding:'40px' }}>
              <div style={{ fontSize:'32px', marginBottom:'12px' }}>🤖</div>
              <div style={{ color: colors.textMuted, fontSize:'13px' }}>Analyse de vos donnees en cours...</div>
            </Card>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              {insights.map((insight, i) => (
                <Card key={i} style={{ borderLeft:'3px solid '+(insight.type==='warning'?colors.danger:insight.type==='success'?colors.success:insight.type==='opportunity'?colors.info:colors.warning) }}>
                  <div style={{ display:'flex', alignItems:'flex-start', gap:'12px' }}>
                    <span style={{ fontSize:'24px', flexShrink:0 }}>{insight.icon}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px' }}>
                        <span style={{ fontSize:'13px', fontWeight:'800', color: colors.text }}>{insight.title}</span>
                        <Badge color={priorityColor[insight.priority] || 'default'}>{insight.priority}</Badge>
                      </div>
                      <p style={{ margin:0, fontSize:'12px', color:'#6a8aaa', lineHeight:'1.6' }}>{insight.desc}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div>
          <SectionTitle color={colors.success}>Actions recommandees</SectionTitle>
          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            {recommendations.map((rec, i) => (
              <Card key={i} style={{ cursor:'pointer' }} onClick={() => window.location.href = rec.cta}>
                <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
                  <div style={{ width:'28px', height:'28px', borderRadius:'50%', background:'#B22234', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:'900', color:'#fff', flexShrink:0 }}>
                    {rec.priority}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:'13px', fontWeight:'700', color: colors.text }}>{rec.action}</div>
                    <div style={{ fontSize:'10px', color: colors.textMuted }}>{rec.category}</div>
                  </div>
                  <Badge color="success">{rec.impact}</Badge>
                </div>
                <p style={{ margin:0, fontSize:'11px', color:'#6a8aaa', lineHeight:'1.5' }}>{rec.reason}</p>
              </Card>
            ))}
          </div>

          {/* AI Coach Chat */}
          <Card style={{ marginTop:'16px', background:'linear-gradient(135deg,rgba(178,34,52,0.1),rgba(60,59,110,0.1))', border:'1px solid #B22234' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px' }}>
              <span style={{ fontSize:'24px' }}>🤖</span>
              <div>
                <div style={{ fontSize:'13px', fontWeight:'800', color: colors.text }}>ORBIS AI Coach</div>
                <div style={{ fontSize:'11px', color: colors.textMuted }}>Propulse par Claude (Anthropic)</div>
              </div>
              <Badge color="success" style={{ marginLeft:'auto' }}>En ligne</Badge>
            </div>
            <p style={{ margin:'0 0 14px', fontSize:'12px', color:'#6a8aaa', lineHeight:'1.6' }}>
              Votre coach IA analyse votre activite business en continu et vous suggere les meilleures actions pour maximiser votre croissance.
            </p>
            <Button onClick={() => window.location.href = '/ai'} style={{ width:'100%' }}>
              💬 Parler a ORBIS AI Coach
            </Button>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}
