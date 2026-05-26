'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const API = 'http://localhost:4080'

const STAGES = [
  { id:'identified',  label:'Identifie',   color:'#4a6fa5', bg:'rgba(74,111,165,0.15)' },
  { id:'qualified',   label:'Qualifie',    color:'#1a6fff', bg:'rgba(26,111,255,0.15)' },
  { id:'proposal',    label:'Proposition', color:'#a78bfa', bg:'rgba(167,139,250,0.15)' },
  { id:'negotiation', label:'Negociation', color:'#f4c842', bg:'rgba(244,200,66,0.15)' },
  { id:'won',         label:'Gagne',       color:'#00c896', bg:'rgba(0,200,150,0.15)' },
  { id:'lost',        label:'Perdu',       color:'#ff6b6b', bg:'rgba(255,107,107,0.15)' },
]

export default function OpportunitiesPage() {
  const router = useRouter()
  const [opportunities, setOpportunities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [orgs, setOrgs] = useState<any[]>([])
  const [form, setForm] = useState({ title:'', description:'', orgId:'', type:'outbound', value:'', currency:'USD', probability:'50' })
  const token = typeof window !== 'undefined' ? localStorage.getItem('orbis_token') : ''

  useEffect(() => {
    if (!token) { router.push('/'); return }
    fetchOpportunities()
    fetchOrgs()
  }, [])

  async function fetchOpportunities() {
    try {
      const res = await fetch(API + '/api/opportunity', { headers:{ Authorization:'Bearer '+token } })
      const data = await res.json()
      setOpportunities(data.opportunities || [])
    } catch(e) {} finally { setLoading(false) }
  }

  async function fetchOrgs() {
    try {
      const res = await fetch(API + '/api/organizations', { headers:{ Authorization:'Bearer '+token } })
      const data = await res.json()
      setOrgs(data.organizations || [])
    } catch(e) {}
  }

  async function createOpportunity(e: any) {
    e.preventDefault()
    try {
      const res = await fetch(API + '/api/opportunity', {
        method:'POST',
        headers:{ 'Content-Type':'application/json', Authorization:'Bearer '+token },
        body: JSON.stringify({ ...form, value: Number(form.value), probability: Number(form.probability) })
      })
      const data = await res.json()
      if (res.status >= 400) throw new Error(data.error)
      setOpportunities(prev => [data.opportunity, ...prev])
      setShowForm(false)
      setForm({ title:'', description:'', orgId:'', type:'outbound', value:'', currency:'USD', probability:'50' })
    } catch(err: any) { alert(err.message) }
  }

  async function moveStage(oppId: string, stage: string) {
    try {
      await fetch(API + '/api/opportunity/' + oppId + '/stage', {
        method:'PATCH',
        headers:{ 'Content-Type':'application/json', Authorization:'Bearer '+token },
        body: JSON.stringify({ stage })
      })
      setOpportunities(prev => prev.map(o => o.id === oppId ? {...o, stage} : o))
    } catch(e) {}
  }

  const totalValue    = opportunities.reduce((s, o) => s + (o.value||0), 0)
  const weightedValue = opportunities.reduce((s, o) => s + ((o.value||0) * o.probability/100), 0)
  const wonValue      = opportunities.filter(o => o.stage==='won').reduce((s, o) => s + (o.value||0), 0)

  return (
    <div style={{ minHeight:'100vh', background:'#060e1a', color:'#fff', fontFamily:'system-ui', padding:'24px' }}>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <button onClick={() => router.push('/dashboard')} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid #1e3a5f', borderRadius:'8px', padding:'8px 14px', color:'#4a6fa5', cursor:'pointer', fontSize:'12px' }}>← Dashboard</button>
          <div>
            <h1 style={{ margin:0, fontSize:'22px', fontWeight:'900' }}>💡 Opportunites</h1>
            <p style={{ margin:0, fontSize:'12px', color:'#4a6fa5' }}>Pipeline commercial ORBIS</p>
          </div>
        </div>
        <button onClick={() => setShowForm(true)} style={{ padding:'10px 20px', background:'#1a6fff', border:'none', borderRadius:'10px', color:'#fff', fontSize:'13px', fontWeight:'700', cursor:'pointer' }}>+ Nouvelle opportunite</button>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'14px', marginBottom:'24px' }}>
        {[
          { label:'Total opportunites', value: opportunities.length, color:'#5b9fff', icon:'💡' },
          { label:'Valeur totale', value:'$'+totalValue.toLocaleString(), color:'#f4c842', icon:'💰' },
          { label:'Valeur ponderee', value:'$'+Math.round(weightedValue).toLocaleString(), color:'#a78bfa', icon:'📊' },
          { label:'Deals gagnes', value:'$'+wonValue.toLocaleString(), color:'#00c896', icon:'🏆' },
        ].map((s, i) => (
          <div key={i} style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'12px', padding:'16px' }}>
            <div style={{ fontSize:'20px', marginBottom:'8px' }}>{s.icon}</div>
            <div style={{ fontSize:'22px', fontWeight:'900', color:s.color }}>{s.value}</div>
            <div style={{ fontSize:'11px', color:'#4a6fa5', marginTop:'4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Create Form */}
      {showForm && (
        <div style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'14px', padding:'24px', marginBottom:'24px' }}>
          <h3 style={{ margin:'0 0 16px', color:'#5b9fff' }}>Nouvelle opportunite</h3>
          <form onSubmit={createOpportunity} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
            <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
              <label style={{ fontSize:'12px', color:'#4a6fa5' }}>Titre *</label>
              <input value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))} required placeholder="Ex: Partnership Dubai" style={{ padding:'10px', background:'#060e1a', border:'1px solid #1e3a5f', borderRadius:'8px', color:'#fff', fontSize:'13px', outline:'none' }}/>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
              <label style={{ fontSize:'12px', color:'#4a6fa5' }}>Type</label>
              <select value={form.type} onChange={e => setForm(f=>({...f,type:e.target.value}))} style={{ padding:'10px', background:'#060e1a', border:'1px solid #1e3a5f', borderRadius:'8px', color:'#fff', fontSize:'13px', outline:'none' }}>
                <option value="inbound">Inbound</option>
                <option value="outbound">Outbound</option>
                <option value="partnership">Partenariat</option>
                <option value="referral">Referral</option>
              </select>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
              <label style={{ fontSize:'12px', color:'#4a6fa5' }}>Valeur (USD)</label>
              <input type="number" value={form.value} onChange={e => setForm(f=>({...f,value:e.target.value}))} placeholder="Ex: 50000" style={{ padding:'10px', background:'#060e1a', border:'1px solid #1e3a5f', borderRadius:'8px', color:'#fff', fontSize:'13px', outline:'none' }}/>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
              <label style={{ fontSize:'12px', color:'#4a6fa5' }}>Probabilite ({form.probability}%)</label>
              <input type="range" min="0" max="100" value={form.probability} onChange={e => setForm(f=>({...f,probability:e.target.value}))} style={{ width:'100%', accentColor:'#1a6fff' }}/>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
              <label style={{ fontSize:'12px', color:'#4a6fa5' }}>Organisation</label>
              <select value={form.orgId} onChange={e => setForm(f=>({...f,orgId:e.target.value}))} style={{ padding:'10px', background:'#060e1a', border:'1px solid #1e3a5f', borderRadius:'8px', color:'#fff', fontSize:'13px', outline:'none' }}>
                <option value="">Selectionner...</option>
                {orgs.map((o:any) => <option key={o.org?.id||o.id} value={o.org?.id||o.id}>{o.org?.name||o.name}</option>)}
              </select>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
              <label style={{ fontSize:'12px', color:'#4a6fa5' }}>Description</label>
              <input value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} placeholder="Description courte" style={{ padding:'10px', background:'#060e1a', border:'1px solid #1e3a5f', borderRadius:'8px', color:'#fff', fontSize:'13px', outline:'none' }}/>
            </div>
            <div style={{ gridColumn:'span 2', display:'flex', gap:'10px', justifyContent:'flex-end' }}>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding:'10px 20px', background:'transparent', border:'1px solid #1e3a5f', borderRadius:'8px', color:'#4a6fa5', cursor:'pointer', fontSize:'13px' }}>Annuler</button>
              <button type="submit" style={{ padding:'10px 20px', background:'#1a6fff', border:'none', borderRadius:'8px', color:'#fff', cursor:'pointer', fontSize:'13px', fontWeight:'700' }}>Creer</button>
            </div>
          </form>
        </div>
      )}

      {/* Pipeline Kanban */}
      {loading ? (
        <div style={{ textAlign:'center', color:'#4a6fa5', padding:'60px' }}>Chargement...</div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:'10px', overflowX:'auto' }}>
          {STAGES.map(stage => (
            <div key={stage.id} style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'12px', padding:'12px', minHeight:'300px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'12px' }}>
                <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:stage.color }}></div>
                <span style={{ fontSize:'11px', fontWeight:'700', color:stage.color, textTransform:'uppercase', letterSpacing:'0.5px' }}>{stage.label}</span>
                <span style={{ marginLeft:'auto', fontSize:'11px', color:'#4a6fa5' }}>{opportunities.filter(o=>o.stage===stage.id).length}</span>
              </div>
              {opportunities.filter(o => o.stage === stage.id).map((opp: any, i) => (
                <div key={i} style={{ background:'#060e1a', border:'1px solid #1e3a5f', borderRadius:'8px', padding:'10px', marginBottom:'8px' }}>
                  <div style={{ fontSize:'12px', fontWeight:'700', marginBottom:'4px', color:'#fff' }}>{opp.title}</div>
                  {opp.value > 0 && <div style={{ fontSize:'13px', fontWeight:'900', color:'#00c896', marginBottom:'4px' }}>${opp.value?.toLocaleString()}</div>}
                  <div style={{ display:'flex', alignItems:'center', gap:'4px', marginBottom:'8px' }}>
                    <div style={{ flex:1, height:'3px', background:'#1e3a5f', borderRadius:'2px' }}>
                      <div style={{ width:opp.probability+'%', height:'100%', background:stage.color, borderRadius:'2px' }}></div>
                    </div>
                    <span style={{ fontSize:'10px', color:'#4a6fa5' }}>{opp.probability}%</span>
                  </div>
                  <select onChange={e => moveStage(opp.id, e.target.value)} value={opp.stage} style={{ width:'100%', padding:'4px 6px', background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'4px', color:'#4a6fa5', fontSize:'10px', cursor:'pointer' }}>
                    {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
              ))}
              {opportunities.filter(o=>o.stage===stage.id).length === 0 && (
                <div style={{ textAlign:'center', color:'#2a4a7f', fontSize:'11px', padding:'20px 0' }}>Vide</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
