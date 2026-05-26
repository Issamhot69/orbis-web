'use client'
import { useState } from 'react'
import { OrbisActionBar } from '../components/orbis-suite'
import { PageLayout, Card, Button, Badge, StatsGrid, SectionTitle, colors } from '../components/orbis-ui'
import { TrustTransaction } from '../components/trust-transaction'

const PRODUCTS = [
  { id:'1',  name:'ORBIS Auth SDK',        type:'API',      category:'auth',      price:49,   billing:'month', rating:4.9, reviews:127, installs:2340,  dev:'ORBIS Team',      country:'🇲🇦', desc:'SDK authentification complet — JWT, OAuth, 2FA. Drop-in solution pour Node.js, Python, Go.', tags:['Auth','Security','SDK'], color:'#1a6fff', free:true, freeLabel:'Freemium' },
  { id:'2',  name:'AI Contract Generator', type:'SaaS',     category:'legal',     price:99,   billing:'month', rating:4.8, reviews:89,  installs:1250,  dev:'LegalAI Inc',     country:'🇺🇸', desc:'Génère des contrats B2B en 30 secondes. 190 juridictions. 50+ templates. Signature électronique.', tags:['Legal','AI','Contracts'], color:'#a78bfa', free:false, freeLabel:'Trial 14j' },
  { id:'3',  name:'B2B Email Finder API',  type:'API',      category:'sales',     price:29,   billing:'month', rating:4.7, reviews:203, installs:5670,  dev:'DataHunter',      country:'🇩🇪', desc:'Trouve emails pro vérifiés de n importe quelle entreprise. 95% accuracy. 10000 req/mois.', tags:['Email','Sales','API'], color:'#00c896', free:true, freeLabel:'500 req/mois' },
  { id:'4',  name:'Dashboard UI Kit',      type:'Template', category:'design',    price:79,   billing:'once',  rating:4.9, reviews:445, installs:8920,  dev:'DesignPro',       country:'🇫🇷', desc:'200+ composants React. Dark mode. Tailwind CSS. Compatible ORBIS Design System.', tags:['React','UI','Tailwind'], color:'#f4c842', free:false, freeLabel:'Demo' },
  { id:'5',  name:'Payment Gateway SDK',   type:'API',      category:'payments',  price:0,    billing:'usage', rating:4.8, reviews:312, installs:4560,  dev:'PayCore',         country:'🇬🇧', desc:'Intégration paiements 150+ pays. Stripe, PayPal, crypto. 0.5% par transaction.', tags:['Payments','Fintech','API'], color:'#00c896', free:true, freeLabel:'0.5% /transaction' },
  { id:'6',  name:'AI Translation API',    type:'API',      category:'ai',        price:39,   billing:'month', rating:4.9, reviews:178, installs:3210,  dev:'LinguaAI',        country:'🇯🇵', desc:'Traduction temps réel 50 langues. Clone vocal inclus. Latence < 200ms. API REST simple.', tags:['AI','Translation','NLP'], color:'#1a6fff', free:true, freeLabel:'1000 mots/mois' },
  { id:'7',  name:'B2B CRM Starter',       type:'SaaS',     category:'crm',       price:29,   billing:'month', rating:4.6, reviews:67,  installs:890,   dev:'CRMBuilder',      country:'🇸🇪', desc:'CRM minimaliste pour startups B2B. Pipeline, contacts, emails. Intégration ORBIS native.', tags:['CRM','Sales','B2B'], color:'#a78bfa', free:true, freeLabel:'5 users' },
  { id:'8',  name:'Satellite Tracking SDK','type':'API',    category:'logistics', price:149,  billing:'month', rating:4.9, reviews:43,  installs:234,   dev:'TrackCore',       country:'🇺🇸', desc:'Tracking GPS/satellite temps réel. Intégration ORBIS. Alertes intelligentes. 99.9% uptime.', tags:['GPS','Logistics','IoT'], color:'#f4c842', free:false, freeLabel:'Trial 7j' },
  { id:'9',  name:'SaaS Boilerplate Pro',  type:'Template', category:'dev',       price:199,  billing:'once',  rating:4.8, reviews:234, installs:3450,  dev:'DevKit Studio',   country:'🇨🇦', desc:'Next.js + Node.js + PostgreSQL + Auth + Stripe + Email. Lancez votre SaaS en 24h.', tags:['Next.js','SaaS','Boilerplate'], color:'#B22234', free:false, freeLabel:'Demo live' },
  { id:'10', name:'AI Sales Coach',        type:'SaaS',     category:'ai',        price:79,   billing:'month', rating:4.7, reviews:156, installs:1890,  dev:'SalesAI Labs',    country:'🇺🇸', desc:'Coach IA qui analyse vos calls de vente et suggère améliorations. Intégration ORBIS Conference.', tags:['AI','Sales','Coaching'], color:'#00c896', free:true, freeLabel:'3 calls/mois' },
  { id:'11', name:'Invoice Generator API', type:'API',      category:'finance',   price:19,   billing:'month', rating:4.6, reviews:289, installs:6780,  dev:'InvoiceKit',      country:'🇳🇱', desc:'Génère PDF factures professionnelles. 50+ templates. Multi-devise. Logo custom. Signature.', tags:['Finance','PDF','API'], color:'#1a6fff', free:true, freeLabel:'50 factures/mois' },
  { id:'12', name:'Business Intelligence', type:'SaaS',     category:'analytics', price:149,  billing:'month', rating:4.8, reviews:98,  installs:1230,  dev:'BI Studio',       country:'🇩🇪', desc:'Dashboards BI automatiques depuis vos données ORBIS. 50+ charts. Export PDF/Excel.', tags:['BI','Analytics','Dashboard'], color:'#a78bfa', free:false, freeLabel:'Trial 14j' },
]

const CATEGORIES = [
  { id:'all',      name:'Tous',         icon:'🌍' },
  { id:'ai',       name:'IA & ML',      icon:'🤖' },
  { id:'api',      name:'APIs',         icon:'🔌' },
  { id:'auth',     name:'Auth',         icon:'🔐' },
  { id:'payments', name:'Paiements',    icon:'💳' },
  { id:'legal',    name:'Legal',        icon:'⚖️' },
  { id:'sales',    name:'Sales',        icon:'📈' },
  { id:'design',   name:'Design',       icon:'🎨' },
  { id:'dev',      name:'Dev Tools',    icon:'🛠️' },
  { id:'analytics',name:'Analytics',    icon:'📊' },
  { id:'logistics',name:'Logistique',   icon:'🚚' },
  { id:'crm',      name:'CRM',          icon:'👥' },
]

export default function DevMarketPage() {
  const [showSuite, setShowSuite] = useState(false)
  const [suiteUser, setSuiteUser] = useState<any>(null)
  const [suiteContext, setSuiteContext] = useState('')
  const [selected, setSelected]     = useState<any>(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeType, setActiveType] = useState('all')
  const [search, setSearch]         = useState('')
  const [sortBy, setSortBy]         = useState('installs')
  const [showTrust, setShowTrust]   = useState(false)

  const filtered = PRODUCTS.filter(p => {
    if (activeCategory !== 'all' && p.category !== activeCategory) return false
    if (activeType !== 'all' && p.type !== activeType) return false
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.desc.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }).sort((a,b) => {
    if (sortBy === 'installs') return b.installs - a.installs
    if (sortBy === 'rating')   return b.rating - a.rating
    if (sortBy === 'price')    return a.price - b.price
    return 0
  })

  const typeColor: any = { SaaS:'info', API:'success', Template:'warning', Plugin:'danger' }

  return (
    <PageLayout
      title="🛠️ Developer Marketplace"
      subtitle="SaaS, APIs, Templates, AI Models — vendez et achetez des outils tech"
      action={<Button>+ Publier mon produit</Button>}
    >
      <StatsGrid stats={[
        { icon:'📦', label:'Produits listés',   value: PRODUCTS.length,                                    color: colors.info },
        { icon:'🔌', label:'APIs disponibles',  value: PRODUCTS.filter(p=>p.type==='API').length,          color: colors.success },
        { icon:'🆓', label:'Freemium',          value: PRODUCTS.filter(p=>p.free).length,                 color: colors.warning },
        { icon:'⭐', label:'Note moyenne',       value: (PRODUCTS.reduce((s,p)=>s+p.rating,0)/PRODUCTS.length).toFixed(1), color: colors.primary },
      ]}/>

      {/* Search + Filter */}
      <div style={{ display:'flex', gap:'10px', marginBottom:'16px' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher outils, APIs, templates..." style={{ flex:1, padding:'12px 16px', background: colors.bgCard, border:'1px solid '+colors.border, borderRadius:'10px', color: colors.text, fontSize:'13px', outline:'none' }}/>
        <div style={{ display:'flex', gap:'4px', background: colors.bgCard, borderRadius:'10px', padding:'4px', border:'1px solid '+colors.border }}>
          {['all','SaaS','API','Template'].map(t => (
            <button key={t} onClick={() => setActiveType(t)} style={{ padding:'6px 12px', borderRadius:'7px', border:'none', background: activeType===t?colors.primary:'transparent', color: activeType===t?'#fff':colors.textMuted, fontSize:'12px', fontWeight:'700', cursor:'pointer' }}>
              {t === 'all' ? 'Tous' : t}
            </button>
          ))}
        </div>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding:'12px', background: colors.bgCard, border:'1px solid '+colors.border, borderRadius:'10px', color: colors.text, fontSize:'12px', outline:'none' }}>
          <option value="installs">Plus populaires</option>
          <option value="rating">Mieux notés</option>
          <option value="price">Prix croissant</option>
        </select>
      </div>

      {/* Categories */}
      <div style={{ display:'flex', gap:'6px', marginBottom:'24px', flexWrap:'wrap' }}>
        {CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{ padding:'6px 12px', borderRadius:'20px', border:'1px solid '+(activeCategory===cat.id?colors.primary:colors.border), background: activeCategory===cat.id?'rgba(178,34,52,0.15)':'transparent', color: activeCategory===cat.id?colors.primary:colors.textMuted, fontSize:'11px', cursor:'pointer', fontWeight: activeCategory===cat.id?'700':'400' }}>
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {!selected ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'16px' }}>
          {filtered.map((p, i) => (
            <Card key={i} onClick={() => setSelected(p)} style={{ cursor:'pointer', display:'flex', flexDirection:'column', gap:'10px' }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                  <Badge color={typeColor[p.type]||'default'}>{p.type}</Badge>
                  {p.free && <Badge color="success">🆓 {p.freeLabel}</Badge>}
                </div>
                <div style={{ fontSize:'11px', color: colors.textMuted }}>{p.country}</div>
              </div>
              <div>
                <h3 style={{ margin:'0 0 4px', fontSize:'14px', fontWeight:'800', color: colors.text }}>{p.name}</h3>
                <div style={{ fontSize:'11px', color: colors.textMuted, marginBottom:'6px' }}>par {p.dev}</div>
                <p style={{ margin:0, fontSize:'12px', color:'#6a8aaa', lineHeight:'1.5' }}>{p.desc.slice(0,80)}...</p>
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'4px' }}>
                {p.tags.map((tag,j) => (
                  <span key={j} style={{ padding:'2px 8px', background:'rgba(255,255,255,0.05)', border:'1px solid '+colors.border, borderRadius:'10px', fontSize:'10px', color: colors.textMuted }}>{tag}</span>
                ))}
              </div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', borderTop:'1px solid '+colors.border, paddingTop:'10px', marginTop:'auto' }}>
                <div>
                  <div style={{ fontSize:'18px', fontWeight:'900', color: p.price === 0 ? colors.success : colors.text }}>
                    {p.price === 0 ? 'Gratuit' : '$'+p.price}
                    {p.price > 0 && <span style={{ fontSize:'11px', color: colors.textMuted }}>/{p.billing==='once'?'unique':p.billing==='month'?'mois':'usage'}</span>}
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'11px', color: colors.textMuted }}>
                  <span>⭐ {p.rating}</span>
                  <span>📥 {p.installs}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Product Detail */
        <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:'20px' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
            <Card>
              <div style={{ display:'flex', alignItems:'flex-start', gap:'16px', marginBottom:'20px' }}>
                <div style={{ width:'64px', height:'64px', borderRadius:'16px', background:selected.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'28px', fontWeight:'900', color:'#fff', flexShrink:0 }}>
                  {selected.name[0]}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px', flexWrap:'wrap' }}>
                    <h2 style={{ margin:0, fontSize:'20px', fontWeight:'900' }}>{selected.name}</h2>
                    <Badge color={typeColor[selected.type]||'default'}>{selected.type}</Badge>
                    {selected.free && <Badge color="success">🆓 {selected.freeLabel}</Badge>}
                  </div>
                  <div style={{ fontSize:'13px', color: colors.textMuted, marginBottom:'8px' }}>par {selected.dev} • {selected.country}</div>
                  <p style={{ margin:0, fontSize:'13px', color:'#6a8aaa', lineHeight:'1.6' }}>{selected.desc}</p>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px' }}>
                {[
                  { icon:'⭐', label:'Note',       value:selected.rating+'/5' },
                  { icon:'💬', label:'Avis',       value:selected.reviews },
                  { icon:'📥', label:'Installs',   value:selected.installs },
                  { icon:'🏷️', label:'Catégorie',  value:selected.category },
                ].map((s,i) => (
                  <div key={i} style={{ background: colors.bg, border:'1px solid '+colors.border, borderRadius:'10px', padding:'12px', textAlign:'center' }}>
                    <div style={{ fontSize:'18px', marginBottom:'4px' }}>{s.icon}</div>
                    <div style={{ fontSize:'14px', fontWeight:'900', color: colors.info }}>{s.value}</div>
                    <div style={{ fontSize:'10px', color: colors.textMuted, marginTop:'2px' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </Card>

            <div style={{ display:'flex', gap:'10px' }}>
              <Button onClick={() => setShowTrust(true)} style={{ flex:2 }}>
                {selected.price === 0 ? '🚀 Installer gratuitement' : '💳 Acheter via ORBIS sécurisé'}
              </Button>
              <Button variant="ghost" style={{ flex:1 }}>📖 Documentation</Button>
              <Button variant="ghost" style={{ flex:1 }}>💬 Support</Button>
            </div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            <Card>
              <SectionTitle>Tarification</SectionTitle>
              <div style={{ textAlign:'center', padding:'16px 0' }}>
                <div style={{ fontSize:'36px', fontWeight:'900', color: selected.price===0?colors.success:colors.warning }}>
                  {selected.price === 0 ? 'Gratuit' : '$'+selected.price}
                </div>
                {selected.price > 0 && <div style={{ fontSize:'13px', color: colors.textMuted }}>par {selected.billing==='once'?'achat unique':selected.billing==='month'?'mois':'utilisation'}</div>}
                {selected.free && <div style={{ marginTop:'8px' }}><Badge color="success">🆓 {selected.freeLabel} disponible</Badge></div>}
              </div>
              <Button style={{ width:'100%' }}>
                {selected.free ? '🆓 Démarrer gratuitement' : '💳 Acheter maintenant'}
              </Button>
            </Card>

            <Card>
              <SectionTitle>Tags</SectionTitle>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                {selected.tags.map((tag: string, i: number) => (
                  <Badge key={i} color="default">{tag}</Badge>
                ))}
              </div>
            </Card>

            <Card>
              <SectionTitle>Développeur</SectionTitle>
              <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px' }}>
                <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:selected.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', fontWeight:'900', color:'#fff' }}>{selected.dev[0]}</div>
                <div>
                  <div style={{ fontSize:'13px', fontWeight:'700' }}>{selected.dev}</div>
                  <div style={{ fontSize:'11px', color: colors.textMuted }}>{selected.country}</div>
                </div>
              </div>
              <Button variant="ghost" size="sm" style={{ width:'100%' }}>Voir profil ORBIS</Button>
            </Card>

            <Button variant="secondary" onClick={() => setSelected(null)} style={{ width:'100%' }}>
              ← Retour aux produits
            </Button>
          </div>
        </div>
      )}
      {showTrust && selected && (
        <TrustTransaction
          seller={{ name: selected.dev, trust: 95, verified: true, country: selected.country }}
          product={{ name: selected.name, price: selected.price, currency: '$' }}
          onClose={() => setShowTrust(false)}
          onConfirm={() => { setShowTrust(false); alert('Installation confirmee ! Acces active.') }}
        />
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
