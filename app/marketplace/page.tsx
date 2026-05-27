'use client'
import { useEffect, useState } from 'react'
import { PageLayout, Card, Button, Input, Select, Badge, StatsGrid, EmptyState, SectionTitle, colors } from '../components/orbis-ui'
import { OrbisActionBar } from '../components/orbis-suite'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4080'
const CATEGORIES = [
  {id:'1',name:'Technology',icon:'💻'},{id:'2',name:'Marketing',icon:'📢'},
  {id:'3',name:'Finance',icon:'💰'},{id:'4',name:'Legal',icon:'⚖️'},
  {id:'5',name:'Design',icon:'🎨'},{id:'6',name:'Consulting',icon:'🧠'},
  {id:'7',name:'Manufacturing',icon:'🏭'},{id:'8',name:'Logistics',icon:'🚚'},
]

export default function MarketplacePage() {
  const [listings, setListings]   = useState<any[]>([])
  const [showSuite, setShowSuite] = useState(false)
  const [suiteUser, setSuiteUser] = useState<any>(null)
  const [suiteContext, setSuiteContext] = useState("")
  const [loading, setLoading]     = useState(true)
  const [showForm, setShowForm]   = useState(false)
  const [search, setSearch]       = useState('')
  const [selectedCat, setSelectedCat] = useState('')
  const [orgs, setOrgs]           = useState<any[]>([])
  const [form, setForm]           = useState({ title:'', description:'', categoryId:'1', type:'service', price:'', currency:'USD', priceType:'fixed', orgId:'', remote:true })
  const token = typeof window !== 'undefined' ? localStorage.getItem('orbis_token') : ''

  useEffect(() => { if (token) { fetchListings(); fetchOrgs() } }, [])

  async function fetchListings(q='', cat='') {
    try {
      let url = API + '/api/marketplace/listings?'
      if (q)   url += 'search='+q+'&'
      if (cat) url += 'categoryId='+cat
      const res  = await fetch(url, { headers:{ Authorization:'Bearer '+token } })
      const data = await res.json()
      setListings(data.listings || [])
    } catch(e) {} finally { setLoading(false) }
  }

  async function fetchOrgs() {
    try {
      const res  = await fetch(API + '/api/organizations', { headers:{ Authorization:'Bearer '+token } })
      const data = await res.json()
      setOrgs(data.organizations || [])
    } catch(e) {}
  }

  async function createListing(e: any) {
    e.preventDefault()
    try {
      const res  = await fetch(API + '/api/marketplace/listings', {
        method:'POST',
        headers:{ 'Content-Type':'application/json', Authorization:'Bearer '+token },
        body: JSON.stringify({ ...form, price: Number(form.price) })
      })
      const data = await res.json()
      if (res.status >= 400) throw new Error(data.error)
      setListings(prev => [data.listing, ...prev])
      setShowForm(false)
    } catch(err: any) { alert(err.message) }
  }

  function getOrgs() {
    return [{ value:'', label:'Sélectionner...' }, ...orgs.map((o:any) => ({ value: o.org?.id||o.id, label: o.org?.name||o.name }))]
  }

  const typeColor: any = { service:'info', product:'success', expertise:'warning', partnership:'danger' }

  return (
    <PageLayout
      title="🛒 Marketplace B2B"
      subtitle="Trouvez des partenaires, services et experts mondiaux"
      action={<Button onClick={() => setShowForm(true)}>+ Publier une offre</Button>}
    >
      <StatsGrid stats={[
        { icon:'🛒', label:'Listings actifs',  value: listings.length,                                         color: colors.info },
        { icon:'💼', label:'Services',          value: listings.filter(l=>l.type==='service').length,           color: colors.primary },
        { icon:'🤝', label:'Partenariats',      value: listings.filter(l=>l.type==='partnership').length,       color: colors.success },
        { icon:'🧠', label:'Expertises',        value: listings.filter(l=>l.type==='expertise').length,         color: colors.warning },
      ]}/>

      <div style={{ display:'flex', gap:'10px', marginBottom:'16px' }}>
        <input value={search} onChange={e => { setSearch(e.target.value); fetchListings(e.target.value, selectedCat) }} placeholder="Rechercher..." style={{ flex:1, padding:'12px 16px', background: colors.bgCard, border:'1px solid '+colors.border, borderRadius:'10px', color: colors.text, fontSize:'13px', outline:'none' }}/>
      </div>

      <div style={{ display:'flex', gap:'8px', marginBottom:'24px', flexWrap:'wrap' }}>
        {CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => { const c = cat.id===selectedCat?'':cat.id; setSelectedCat(c); fetchListings(search,c) }} style={{ padding:'7px 14px', borderRadius:'20px', border:'1px solid '+(selectedCat===cat.id?colors.primary:colors.border), background: selectedCat===cat.id?'rgba(178,34,52,0.15)':'transparent', color: selectedCat===cat.id?colors.primary:colors.textMuted, fontSize:'12px', cursor:'pointer', fontWeight: selectedCat===cat.id?'700':'400' }}>
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {showForm && (
        <Card style={{ marginBottom:'24px' }}>
          <SectionTitle>Publier une offre</SectionTitle>
          <form onSubmit={createListing} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
            <Input label="Titre *" value={form.title} onChange={v => setForm(f=>({...f,title:v}))} placeholder="Ex: Développement App" required/>
            <Select label="Type" value={form.type} onChange={v => setForm(f=>({...f,type:v}))} options={[{value:'service',label:'Service'},{value:'product',label:'Produit'},{value:'expertise',label:'Expertise'},{value:'partnership',label:'Partenariat'}]}/>
            <Select label="Catégorie" value={form.categoryId} onChange={v => setForm(f=>({...f,categoryId:v}))} options={CATEGORIES.map(c => ({value:c.id,label:c.icon+' '+c.name}))}/>
            <Select label="Organisation" value={form.orgId} onChange={v => setForm(f=>({...f,orgId:v}))} options={getOrgs()}/>
            <Input label="Prix (USD)" value={form.price} onChange={v => setForm(f=>({...f,price:v}))} placeholder="Ex: 5000" type="number"/>
            <Select label="Type de prix" value={form.priceType} onChange={v => setForm(f=>({...f,priceType:v}))} options={[{value:'fixed',label:'Fixe'},{value:'hourly',label:'Par heure'},{value:'monthly',label:'Par mois'},{value:'custom',label:'Sur devis'}]}/>
            <div style={{ gridColumn:'span 2' }}>
              <Input label="Description *" value={form.description} onChange={v => setForm(f=>({...f,description:v}))} placeholder="Décrivez votre offre..." required/>
            </div>
            <div style={{ gridColumn:'span 2', display:'flex', gap:'10px', justifyContent:'flex-end' }}>
              <Button variant="secondary" onClick={() => setShowForm(false)}>Annuler</Button>
              <Button>Publier</Button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <div style={{ textAlign:'center', color: colors.textMuted, padding:'60px' }}>Chargement...</div>
      ) : listings.length === 0 ? (
        <EmptyState icon="🛒" title="Marketplace vide" description="Publiez la première offre ORBIS" action={<Button onClick={() => setShowForm(true)}>+ Publier maintenant</Button>}/>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'16px' }}>
          {listings.map((l:any, i) => (
            <Card key={i} style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <Badge color={typeColor[l.type]||'info'}>{l.type}</Badge>
                <span style={{ fontSize:'12px', color: colors.textMuted }}>👁 {l.views||0}</span>
              </div>
              <h3 style={{ margin:0, fontSize:'14px', fontWeight:'800', color: colors.text }}>{l.title}</h3>
              <p style={{ margin:0, fontSize:'12px', color: colors.textMuted, lineHeight:'1.5' }}>{l.description?.slice(0,100)}...</p>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', borderTop:'1px solid '+colors.border, paddingTop:'10px', marginTop:'auto' }}>
                <div>
                  <div style={{ fontSize:'18px', fontWeight:'900', color: colors.success }}>${Number(l.price)?.toLocaleString()}</div>
                  <div style={{ fontSize:'10px', color: colors.textMuted }}>{l.priceType||'fixe'}</div>
                </div>
                <Button size="sm">Contacter</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      {showSuite && suiteUser && (
        <OrbisActionBar
          withUser={suiteUser}
          context={suiteContext}
          onClose={() => setShowSuite(false)}
        />
      )}
    </PageLayout>
  )
}
