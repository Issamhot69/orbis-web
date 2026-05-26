'use client'
import { useEffect, useState } from 'react'
import { PageLayout, Card, Button, Input, Select, Badge, StatsGrid, EmptyState, SectionTitle, colors } from '../components/orbis-ui'

const API = 'http://localhost:4080'

const CATEGORIES = [
  { id:'food',      name:'Alimentaire',   icon:'🐟', sub:['Poisson','Légumes','Fruits','Viande','Céréales','Épices','Huiles','Produits laitiers'] },
  { id:'materials', name:'Matériaux',     icon:'⚙️', sub:['Acier','Aluminium','Cuivre','Bois','Textile','Plastique','Verre','Caoutchouc'] },
  { id:'machines',  name:'Machines',      icon:'🏭', sub:['Machines agricoles','Équipements industriels','Outils','Véhicules','Pompes','Générateurs'] },
  { id:'chemicals', name:'Chimie',        icon:'🧪', sub:['Engrais','Pesticides','Produits chimiques','Peintures','Solvants'] },
  { id:'energy',    name:'Énergie',       icon:'⚡', sub:['Panneaux solaires','Batteries','Générateurs','Carburant','Gaz'] },
  { id:'textile',   name:'Textile',       icon:'👕', sub:['Coton','Soie','Polyester','Cuir','Laine','Denim'] },
  { id:'agri',      name:'Agriculture',   icon:'🌾', sub:['Semences','Engrais','Équipements agricoles','Plants','Animaux'] },
  { id:'mineral',   name:'Minerais',      icon:'💎', sub:['Or','Argent','Cuivre','Fer','Lithium','Cobalt','Diamants'] },
]

const UNITS = ['Tonne','Kg','Quintal','Litre','M3','M2','Unité','Container','Palet']

const SAMPLE_PRODUCTS = [
  { id:'1', name:'Thon rouge frais', category:'food', subCategory:'Poisson', country:'🇳🇴 Norvège', price:8.5, unit:'Kg', minOrder:500, stock:50000, seller:'Nordic Seafood AS', trust:94, verified:true, image:'🐟', desc:'Thon rouge de l Atlantique, pêche durable certifiée MSC' },
  { id:'2', name:'Tomates cerises', category:'food', subCategory:'Légumes', country:'🇪🇸 Espagne', price:1.2, unit:'Kg', minOrder:1000, stock:200000, seller:'Andalucia Farms', trust:88, verified:true, image:'🍅', desc:'Tomates cerises bio, calibre 20-25mm, conditionnement plateau' },
  { id:'3', name:'Acier inoxydable 304', category:'materials', subCategory:'Acier', country:'🇨🇳 Chine', price:2.8, unit:'Kg', minOrder:5000, stock:500000, seller:'Shanghai Steel Corp', trust:91, verified:true, image:'⚙️', desc:'Acier inoxydable 304, épaisseur 2mm, largeur 1250mm' },
  { id:'4', name:'Panneaux solaires 450W', category:'energy', subCategory:'Panneaux solaires', country:'🇨🇳 Chine', price:120, unit:'Unité', minOrder:100, stock:10000, seller:'SunTech Energy', trust:96, verified:true, image:'☀️', desc:'Panneau solaire monocristallin 450W, garantie 25 ans' },
  { id:'5', name:'Coton brut grade A', category:'textile', subCategory:'Coton', country:'🇺🇸 USA', price:1.85, unit:'Kg', minOrder:10000, stock:1000000, seller:'Texas Cotton Inc', trust:97, verified:true, image:'🌿', desc:'Coton Pima grade A, fibre longue 38mm, humidité <8%' },
  { id:'6', name:'Blé dur premium', category:'agri', subCategory:'Céréales', country:'🇫🇷 France', price:0.35, unit:'Kg', minOrder:20000, stock:2000000, seller:'Bordeaux Grains', trust:92, verified:true, image:'🌾', desc:'Blé dur protéines 14%, poids spécifique 82kg/hl, humidité 12%' },
  { id:'7', name:'Lithium carbonate', category:'mineral', subCategory:'Lithium', country:'🇨🇱 Chili', price:18.5, unit:'Kg', minOrder:1000, stock:50000, seller:'Atacama Mining', trust:95, verified:true, image:'💎', desc:'Carbonate de lithium 99.5% pureté, certifié pour batteries EV' },
  { id:'8', name:'Tracteur 120CV', category:'machines', subCategory:'Machines agricoles', country:'🇩🇪 Allemagne', price:45000, unit:'Unité', minOrder:1, stock:200, seller:'AgriTech GmbH', trust:98, verified:true, image:'🚜', desc:'Tracteur 4x4 120CV, cabine climatisée, GPS intégré' },
  { id:'9', name:'Mangues Kent', category:'food', subCategory:'Fruits', country:'🇧🇷 Brésil', price:0.95, unit:'Kg', minOrder:2000, stock:150000, seller:'Amazon Fresh Brazil', trust:86, verified:true, image:'🥭', desc:'Mangues Kent calibre A, sucrées, export qualité' },
  { id:'10', name:'Huile olive extra vierge', category:'food', subCategory:'Huiles', country:'🇮🇹 Italie', price:4.2, unit:'Litre', minOrder:500, stock:80000, seller:'Sicilia Olives', trust:93, verified:true, image:'🫒', desc:'Huile olive extra vierge DOP, acidité <0.3%, récolte 2025' },
  { id:'11', name:'Aluminium 6061-T6', category:'materials', subCategory:'Aluminium', country:'🇩🇪 Allemagne', price:3.5, unit:'Kg', minOrder:2000, stock:100000, seller:'Euro Metals AG', trust:97, verified:true, image:'🔩', desc:'Aluminium 6061-T6, barres rondes, diamètre 10-200mm' },
  { id:'12', name:'Générateur 500KVA', category:'energy', subCategory:'Générateurs', country:'🇯🇵 Japon', price:85000, unit:'Unité', minOrder:1, stock:50, seller:'Yamaha Power', trust:99, verified:true, image:'⚡', desc:'Générateur industriel 500KVA, silencieux, automatique' },
]

export default function WholesalePage() {
  const [products, setProducts]     = useState(SAMPLE_PRODUCTS)
  const [showSuite, setShowSuite] = useState(false)
  const [suiteUser, setSuiteUser] = useState<any>(null)
  const [suiteContext, setSuiteContext] = useState('')
  const [selected, setSelected]     = useState<any>(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch]         = useState('')
  const [showForm, setShowForm]     = useState(false)
  const [showOrder, setShowOrder]   = useState(false)
  const [showTrust, setShowTrust]   = useState(false)
  const [orderQty, setOrderQty]     = useState('')
  const [sortBy, setSortBy]         = useState('trust')
  const [form, setForm]             = useState({ name:'', category:'food', subCategory:'', price:'', unit:'Kg', minOrder:'', stock:'', country:'', desc:'' })

  const filtered = products.filter(p => {
    if (activeCategory !== 'all' && p.category !== activeCategory) return false
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.subCategory.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }).sort((a,b) => {
    if (sortBy === 'trust') return b.trust - a.trust
    if (sortBy === 'price') return a.price - b.price
    if (sortBy === 'stock') return b.stock - a.stock
    return 0
  })

  const totalValue = products.reduce((s,p) => s + p.price * p.stock, 0)

  return (
    <PageLayout
      title="🌍 Wholesale Marketplace"
      subtitle="Commerce de gros B2B mondial — Alimentaire, Matériaux, Machines, Énergie"
      action={
        <div style={{ display:'flex', gap:'8px' }}>
          <Button variant="ghost" onClick={() => setShowForm(true)}>+ Publier un produit</Button>
          <Button onClick={() => setShowForm(true)}>+ Vendre en gros</Button>
        </div>
      }
    >
      <StatsGrid stats={[
        { icon:'📦', label:'Produits listés',    value: products.length,                             color: colors.info },
        { icon:'🌍', label:'Pays fournisseurs',  value: new Set(products.map(p=>p.country)).size,    color: colors.success },
        { icon:'✅', label:'Fournisseurs vérifiés', value: products.filter(p=>p.verified).length,    color: colors.warning },
        { icon:'💰', label:'Valeur totale stock', value: '$'+Math.round(totalValue/1000000)+'M+',    color: colors.primary },
      ]}/>

      {/* Search + Sort */}
      <div style={{ display:'flex', gap:'10px', marginBottom:'16px' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher produits, catégories, pays..." style={{ flex:1, padding:'12px 16px', background: colors.bgCard, border:'1px solid '+colors.border, borderRadius:'10px', color: colors.text, fontSize:'13px', outline:'none' }}/>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding:'12px', background: colors.bgCard, border:'1px solid '+colors.border, borderRadius:'10px', color: colors.text, fontSize:'12px', outline:'none' }}>
          <option value="trust">Trier: Trust Score</option>
          <option value="price">Trier: Prix</option>
          <option value="stock">Trier: Stock</option>
        </select>
      </div>

      {/* Categories */}
      <div style={{ display:'flex', gap:'8px', marginBottom:'24px', flexWrap:'wrap' }}>
        <button onClick={() => setActiveCategory('all')} style={{ padding:'7px 14px', borderRadius:'20px', border:'1px solid '+(activeCategory==='all'?colors.primary:colors.border), background: activeCategory==='all'?'rgba(178,34,52,0.15)':'transparent', color: activeCategory==='all'?colors.primary:colors.textMuted, fontSize:'12px', cursor:'pointer', fontWeight: activeCategory==='all'?'700':'400' }}>
          🌍 Tous ({products.length})
        </button>
        {CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{ padding:'7px 14px', borderRadius:'20px', border:'1px solid '+(activeCategory===cat.id?colors.primary:colors.border), background: activeCategory===cat.id?'rgba(178,34,52,0.15)':'transparent', color: activeCategory===cat.id?colors.primary:colors.textMuted, fontSize:'12px', cursor:'pointer', fontWeight: activeCategory===cat.id?'700':'400' }}>
            {cat.icon} {cat.name} ({products.filter(p=>p.category===cat.id).length})
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {!selected ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'16px' }}>
          {filtered.map((p, i) => (
            <Card key={i} onClick={() => setSelected(p)} style={{ cursor:'pointer', display:'flex', flexDirection:'column', gap:'10px' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ fontSize:'36px' }}>{p.image}</div>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'4px' }}>
                  {p.verified && <Badge color="success">✓ Vérifié</Badge>}
                  <div style={{ fontSize:'11px', color: colors.textMuted }}>{p.country}</div>
                </div>
              </div>
              <div>
                <h3 style={{ margin:'0 0 4px', fontSize:'14px', fontWeight:'800', color: colors.text }}>{p.name}</h3>
                <div style={{ fontSize:'11px', color: colors.textMuted, marginBottom:'4px' }}>{p.subCategory} • {p.seller}</div>
                <div style={{ fontSize:'11px', color:'#6a8aaa', lineHeight:'1.4' }}>{p.desc?.slice(0,70)}...</div>
              </div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div>
                  <div style={{ fontSize:'20px', fontWeight:'900', color: colors.success }}>${p.price}<span style={{ fontSize:'11px', color: colors.textMuted }}>/{p.unit}</span></div>
                  <div style={{ fontSize:'10px', color: colors.textMuted }}>Min: {p.minOrder} {p.unit}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:'12px', color: colors.warning, fontWeight:'700' }}>Trust {p.trust}/100</div>
                  <div style={{ fontSize:'10px', color: colors.textMuted }}>Stock: {p.stock} {p.unit}</div>
                </div>
              </div>
              <div style={{ height:'3px', background: colors.border, borderRadius:'2px', overflow:'hidden' }}>
                <div style={{ width:p.trust+'%', height:'100%', background: p.trust>90?colors.success:p.trust>75?colors.warning:colors.danger, borderRadius:'2px' }}></div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Product Detail */
        <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:'20px' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
            <Card>
              <div style={{ display:'flex', gap:'20px', marginBottom:'20px' }}>
                <div style={{ fontSize:'72px' }}>{selected.image}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px' }}>
                    <Badge color="success">✓ Vérifié ORBIS</Badge>
                    <Badge color="info">{selected.subCategory}</Badge>
                  </div>
                  <h2 style={{ margin:'0 0 4px', fontSize:'22px', fontWeight:'900' }}>{selected.name}</h2>
                  <div style={{ fontSize:'13px', color: colors.textMuted, marginBottom:'8px' }}>{selected.country} • {selected.seller}</div>
                  <div style={{ fontSize:'14px', color:'#6a8aaa', lineHeight:'1.6' }}>{selected.desc}</div>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px' }}>
                {[
                  { icon:'💰', label:'Prix unitaire', value:'$'+selected.price+'/'+selected.unit },
                  { icon:'📦', label:'Stock disponible', value:selected.stock+' '+selected.unit },
                  { icon:'🛒', label:'Commande min.', value:selected.minOrder+' '+selected.unit },
                  { icon:'🛂', label:'Trust Score', value:selected.trust+'/100' },
                ].map((s,i) => (
                  <div key={i} style={{ background: colors.bg, border:'1px solid '+colors.border, borderRadius:'10px', padding:'12px', textAlign:'center' }}>
                    <div style={{ fontSize:'18px', marginBottom:'4px' }}>{s.icon}</div>
                    <div style={{ fontSize:'13px', fontWeight:'900', color: colors.text }}>{s.value}</div>
                    <div style={{ fontSize:'10px', color: colors.textMuted, marginTop:'2px' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Order Calculator */}
            <Card>
              <SectionTitle color={colors.success}>Calculateur de commande</SectionTitle>
              <div style={{ display:'flex', gap:'12px', alignItems:'flex-end' }}>
                <div style={{ flex:1 }}>
                  <label style={{ fontSize:'12px', color: colors.textMuted, display:'block', marginBottom:'6px' }}>Quantité ({selected.unit})</label>
                  <input type="number" value={orderQty} onChange={e => setOrderQty(e.target.value)} placeholder={'Min: '+selected.minOrder} min={selected.minOrder} style={{ width:'100%', padding:'10px', background: colors.bg, border:'1px solid '+colors.border, borderRadius:'8px', color: colors.text, fontSize:'13px', outline:'none', boxSizing:'border-box' }}/>
                </div>
                <div style={{ flex:1, background: colors.bg, border:'1px solid '+colors.border, borderRadius:'8px', padding:'10px' }}>
                  <div style={{ fontSize:'11px', color: colors.textMuted, marginBottom:'4px' }}>Total estimé</div>
                  <div style={{ fontSize:'20px', fontWeight:'900', color: colors.success }}>
                    ${orderQty ? (Number(orderQty) * selected.price) : '0'}
                  </div>
                </div>
                <Button variant="success" onClick={() => setShowOrder(true)}>
                  Commander
                </Button>
              </div>
              {orderQty && Number(orderQty) < selected.minOrder && (
                <div style={{ marginTop:'8px', fontSize:'12px', color: colors.danger }}>
                  ⚠️ Quantité minimum: {selected.minOrder} {selected.unit}
                </div>
              )}
            </Card>
          </div>

          {/* Right Panel */}
          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            <Card>
              <SectionTitle>Fournisseur</SectionTitle>
              <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'14px' }}>
                <div style={{ width:'44px', height:'44px', borderRadius:'12px', background:'linear-gradient(135deg,'+colors.primary+',#7a0f1e)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', fontWeight:'900', color:'#fff' }}>
                  {selected.seller[0]}
                </div>
                <div>
                  <div style={{ fontSize:'14px', fontWeight:'700' }}>{selected.seller}</div>
                  <div style={{ fontSize:'11px', color: colors.textMuted }}>{selected.country}</div>
                </div>
              </div>
              <div style={{ marginBottom:'12px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'12px', marginBottom:'4px' }}>
                  <span style={{ color: colors.textMuted }}>Trust Score</span>
                  <span style={{ color: colors.success, fontWeight:'700' }}>{selected.trust}/100</span>
                </div>
                <div style={{ height:'6px', background: colors.border, borderRadius:'3px', overflow:'hidden' }}>
                  <div style={{ width:selected.trust+'%', height:'100%', background: colors.success, borderRadius:'3px' }}></div>
                </div>
              </div>
              <div style={{ display:'flex', gap:'8px' }}>
                <Button size="sm" style={{ flex:1 }}>💬 Contacter</Button>
                <Button size="sm" variant="ghost" style={{ flex:1 }}>🛂 Trust</Button>
              </div>
            </Card>

            <Card>
              <SectionTitle>Livraison & Logistique</SectionTitle>
              {[
                ['🚢', 'Maritime', 'Disponible'],
                ['✈️', 'Aérien', 'Disponible'],
                ['🚛', 'Routier', 'Disponible'],
                ['🛰️', 'Tracking', 'ORBIS GPS'],
                ['📝', 'Contrat', 'Auto-généré'],
                ['💳', 'Paiement', 'Escrow ORBIS'],
              ].map(([icon,label,value],i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid '+colors.border, fontSize:'12px' }}>
                  <span style={{ color: colors.textMuted }}>{icon} {label}</span>
                  <span style={{ color: colors.success, fontWeight:'700' }}>{value}</span>
                </div>
              ))}
            </Card>

            <Button variant="secondary" onClick={() => setSelected(null)} style={{ width:'100%' }}>
              ← Retour aux produits
            </Button>
          </div>
        </div>
      )}

      {showTrust && selected && (
        <TrustTransaction
          seller={{ name: selected.seller, trust: selected.trust, verified: selected.verified, country: selected.country }}
          product={{ name: selected.name, price: selected.price * (Number(orderQty)||selected.minOrder), currency: '$' }}
          onClose={() => setShowTrust(false)}
          onConfirm={() => { setShowTrust(false); setSelected(null); alert('Transaction completee ! Paiement libere.') }}
        />
      )}
      {/* Order Modal */}
      {showOrder && selected && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
          <Card style={{ width:'400px', padding:'28px' }}>
            <SectionTitle color={colors.success}>Confirmer la commande</SectionTitle>
            <div style={{ marginBottom:'16px' }}>
              {[
                ['Produit',    selected.name],
                ['Quantité',   (orderQty||selected.minOrder)+' '+selected.unit],
                ['Prix unit.', '$'+selected.price+'/'+selected.unit],
                ['Total',      '$'+((Number(orderQty)||selected.minOrder)*selected.price)],
                ['Fournisseur',selected.seller],
                ['Paiement',   'Escrow ORBIS'],
              ].map(([k,v]) => (
                <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid '+colors.border, fontSize:'13px' }}>
                  <span style={{ color: colors.textMuted }}>{k}</span>
                  <span style={{ color: colors.text, fontWeight:'700' }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', gap:'10px' }}>
              <Button variant="secondary" onClick={() => setShowOrder(false)} style={{ flex:1 }}>Annuler</Button>
              <Button variant='success' onClick={() => { setShowOrder(false); setShowTrust(true) }} style={{ flex:1 }}>✅ Processus sécurisé ORBIS</Button>
            </div>
          </Card>
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
