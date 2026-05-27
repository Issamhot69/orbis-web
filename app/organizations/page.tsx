'use client'
import { useEffect, useState } from 'react'
import { PageLayout, Card, Button, Input, Select, Badge, StatsGrid, EmptyState, SectionTitle, colors } from '../components/orbis-ui'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4080'

const INDUSTRIES = ['Technology','Finance','Healthcare','Education','Manufacturing','Logistics','Marketing','Legal','Consulting','Real Estate','Energy','Agriculture'].map(i => ({ value:i, label:i }))

export default function OrganizationsPage() {
  const [orgs, setOrgs]       = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [error, setError]     = useState('')
  const [form, setForm]       = useState({ name:'', description:'', industry:'', website:'' })
  const token = typeof window !== 'undefined' ? localStorage.getItem('orbis_token') : ''

  useEffect(() => { if (token) fetchOrgs() }, [])

  async function fetchOrgs() {
    try {
      const res  = await fetch(API + '/api/organizations', { headers:{ Authorization:'Bearer '+token } })
      const data = await res.json()
      setOrgs(data.organizations || [])
    } catch(e) {} finally { setLoading(false) }
  }

  async function createOrg(e: any) {
    e.preventDefault()
    setError('')
    try {
      const res  = await fetch(API + '/api/organizations', {
        method:'POST',
        headers:{ 'Content-Type':'application/json', Authorization:'Bearer '+token },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (res.status >= 400) throw new Error(data.error)
      setOrgs(prev => [...prev, { org: data.organization, role:'owner' }])
      setShowForm(false)
      setForm({ name:'', description:'', industry:'', website:'' })
    } catch(err: any) { setError(err.message) }
  }

  return (
    <PageLayout
      title="🏢 Organisations"
      subtitle="Gérez vos organisations ORBIS"
      action={<Button onClick={() => setShowForm(!showForm)}>+ Nouvelle organisation</Button>}
    >
      <StatsGrid stats={[
        { icon:'🏢', label:'Total',   value: orgs.length,                                        color: colors.info },
        { icon:'👑', label:'Owner',   value: orgs.filter((o:any) => o.role==='owner').length,    color: colors.warning },
        { icon:'👥', label:'Membre',  value: orgs.filter((o:any) => o.role==='member').length,   color: colors.success },
        { icon:'✅', label:'Actives', value: orgs.length,                                        color: colors.success },
      ]}/>

      {showForm && (
        <Card style={{ marginBottom:'24px' }}>
          <SectionTitle>Créer une organisation</SectionTitle>
          <form onSubmit={createOrg} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
            <Input label="Nom *" value={form.name} onChange={v => setForm(f=>({...f,name:v}))} placeholder="Ex: ORBIS Corp" required/>
            <Select label="Industrie" value={form.industry} onChange={v => setForm(f=>({...f,industry:v}))} options={[{value:'',label:'Sélectionner...'}, ...INDUSTRIES]}/>
            <Input label="Site web" value={form.website} onChange={v => setForm(f=>({...f,website:v}))} placeholder="https://..."/>
            <Input label="Description" value={form.description} onChange={v => setForm(f=>({...f,description:v}))} placeholder="Description courte"/>
            {error && <div style={{ gridColumn:'span 2', padding:'10px', background:'rgba(255,107,107,0.1)', border:'1px solid '+colors.danger, borderRadius:'8px', color:colors.danger, fontSize:'12px' }}>{error}</div>}
            <div style={{ gridColumn:'span 2', display:'flex', gap:'10px', justifyContent:'flex-end' }}>
              <Button variant="secondary" onClick={() => setShowForm(false)}>Annuler</Button>
              <Button>Créer</Button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <div style={{ textAlign:'center', color: colors.textMuted, padding:'60px' }}>Chargement...</div>
      ) : orgs.length === 0 ? (
        <EmptyState icon="🏢" title="Aucune organisation" description="Créez votre première organisation ORBIS" action={<Button onClick={() => setShowForm(true)}>+ Créer maintenant</Button>}/>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'16px' }}>
          {orgs.map((item: any, i) => {
            const org  = item.org || item
            const role = item.role || 'member'
            return (
              <Card key={i} style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ width:'44px', height:'44px', borderRadius:'12px', background:'linear-gradient(135deg,'+colors.primary+',#7a0f1e)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', fontWeight:'900', color:'#fff' }}>
                    {org.name?.[0] || '?'}
                  </div>
                  <Badge color={role==='owner'?'warning':'info'}>{role}</Badge>
                </div>
                <div>
                  <h3 style={{ margin:'0 0 4px', fontSize:'15px', fontWeight:'800', color: colors.text }}>{org.name}</h3>
                  <p style={{ margin:0, fontSize:'12px', color: colors.textMuted }}>{org.industry || 'Non spécifié'}</p>
                </div>
                {org.description && <p style={{ margin:0, fontSize:'12px', color:'#6a8aaa', lineHeight:'1.5' }}>{org.description}</p>}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', borderTop:'1px solid '+colors.border, paddingTop:'12px', marginTop:'auto' }}>
                  <span style={{ fontSize:'11px', color:'#2a4a7f' }}>{new Date(org.createdAt).toLocaleDateString('fr-FR')}</span>
                  <Badge color="success">Active</Badge>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </PageLayout>
  )
}
