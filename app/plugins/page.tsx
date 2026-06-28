'use client'
import { useState } from 'react'
import { PageLayout, Card, Button, Badge, StatsGrid, SectionTitle, colors } from '../components/orbis-ui'

const PLUGINS = [
  {
    id:'ai-translator',     name:'AI Translator Pro',      author:'ORBIS Labs',     version:'2.1.0',
    category:'AI',          icon:'🌍',                     color:'#1a6fff',
    installed:true,         official:true,                 rating:4.9,              downloads:12450,
    price:0,                desc:'Traduction temps reel dans 50 langues. Integre au Speech-to-Speech ORBIS.',
    features:['50 langues','Voice cloning','Real-time','Offline mode'],
  },
  {
    id:'crm-sync',          name:'CRM Sync',               author:'DataBridge Inc',  version:'1.3.2',
    category:'Integration', icon:'🔄',                     color:'#00c896',
    installed:true,         official:false,                rating:4.7,              downloads:8320,
    price:0,                desc:'Synchronisation bidirectionnelle avec Salesforce, HubSpot et Pipedrive.',
    features:['Salesforce','HubSpot','Pipedrive','Auto-sync'],
  },
  {
    id:'contract-ai',       name:'Contract AI Generator',  author:'LegalTech Pro',  version:'3.0.1',
    category:'Legal',       icon:'📝',                     color:'#a78bfa',
    installed:false,        official:false,                rating:4.8,              downloads:5670,
    price:29,               desc:'Generation automatique de contrats B2B en 30 secondes. 190 juridictions.',
    features:['190 pays','Auto-sign','PDF export','Template library'],
  },
  {
    id:'analytics-pro',     name:'Analytics Pro',          author:'DataViz Studio',  version:'2.2.0',
    category:'Analytics',   icon:'📊',                     color:'#f4c842',
    installed:false,        official:false,                rating:4.6,              downloads:4230,
    price:19,               desc:'Tableaux de bord BI avances avec 100+ charts et export Excel/PDF.',
    features:['100+ charts','Export','Real-time','AI insights'],
  },
  {
    id:'payment-gateway',   name:'Multi Payment Gateway',  author:'PayCore',         version:'1.5.0',
    category:'Payments',    icon:'💳',                     color:'#00c896',
    installed:false,        official:true,                 rating:4.9,              downloads:9870,
    price:0,                desc:'150+ methodes de paiement. Crypto, virement SWIFT, PayPal, Stripe.',
    features:['150+ methods','Crypto','SWIFT','Auto-invoicing'],
  },
  {
    id:'satellite-track',   name:'Satellite Tracker Pro',  author:'ORBIS Labs',     version:'1.0.5',
    category:'Logistics',   icon:'🛰️',                     color:'#1a6fff',
    installed:true,         official:true,                 rating:5.0,              downloads:3210,
    price:0,                desc:'Suivi GPS satellite temps reel. Alertes intelligentes. 99.9% uptime.',
    features:['GPS real-time','Smart alerts','99.9% uptime','Global coverage'],
  },
  {
    id:'email-marketing',   name:'Email Marketing Suite',  author:'MailPro',         version:'2.0.0',
    category:'Marketing',   icon:'📧',                     color:'#ff6b6b',
    installed:false,        official:false,                rating:4.5,              downloads:6540,
    price:39,               desc:'Campagnes email automatisees. Templates, A/B testing, analytics.',
    features:['Automation','A/B testing','Analytics','500+ templates'],
  },
  {
    id:'video-conf',        name:'Video Conference HD',    author:'ORBIS Labs',     version:'3.1.0',
    category:'Communication',icon:'📹',                    color:'#00c896',
    installed:true,         official:true,                 rating:4.8,              downloads:15230,
    price:0,                desc:'Video HD 4K, traduction simultanee, enregistrement securise, 100 participants.',
    features:['4K HD','Translation','Recording','100 participants'],
  },
  {
    id:'blockchain-trust',  name:'Blockchain Trust',       author:'TrustChain',      version:'1.2.0',
    category:'Security',    icon:'🔗',                     color:'#f4c842',
    installed:false,        official:false,                rating:4.7,              downloads:2890,
    price:49,               desc:'Verification d identite sur blockchain. Smart contracts Ethereum.',
    features:['Ethereum','Smart contracts','KYC','Immutable records'],
  },
  {
    id:'ai-coach',          name:'AI Business Coach',      author:'ORBIS Labs',     version:'2.5.0',
    category:'AI',          icon:'🤖',                     color:'#a78bfa',
    installed:true,         official:true,                 rating:4.9,              downloads:11200,
    price:0,                desc:'Coach IA personnel qui analyse vos deals et suggere des ameliorations.',
    features:['Deal analysis','Predictions','Coaching','24/7 available'],
  },
  {
    id:'invoice-gen',       name:'Invoice Generator',      author:'InvoiceKit',      version:'1.8.0',
    category:'Finance',     icon:'🧾',                     color:'#1a6fff',
    installed:false,        official:false,                rating:4.6,              downloads:7650,
    price:0,                desc:'Generation PDF factures pro. 50+ templates. Multi-devise. Signature.',
    features:['50+ templates','Multi-currency','E-signature','Auto-send'],
  },
  {
    id:'social-share',      name:'Social Media Autopost',  author:'SocialPro',       version:'1.1.0',
    category:'Marketing',   icon:'📢',                     color:'#ff6b6b',
    installed:false,        official:false,                rating:4.4,              downloads:3450,
    price:15,               desc:'Publication automatique sur LinkedIn, Twitter, Instagram depuis ORBIS.',
    features:['LinkedIn','Twitter','Instagram','Scheduling'],
  },
]

const CATEGORIES = ['Tous','AI','Integration','Legal','Analytics','Payments','Logistics','Marketing','Communication','Security','Finance']

export default function PluginsPage() {
  const [activeCategory, setActiveCategory] = useState('Tous')
  const [search, setSearch]                 = useState('')
  const [installed, setInstalled]           = useState<string[]>(
    PLUGINS.filter(p => p.installed).map(p => p.id)
  )
  const [selected, setSelected]             = useState<any>(null)

  const filtered = PLUGINS.filter(p => {
    if (activeCategory !== 'Tous' && p.category !== activeCategory) return false
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.desc.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  function toggleInstall(id: string) {
    setInstalled(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  return (
    <PageLayout
      title="🧩 Plugins & Extensions"
      subtitle="Etendez ORBIS avec des plugins certifies — marketplace de modules"
      action={<Button variant="ghost">+ Publier un plugin</Button>}
    >
      <StatsGrid stats={[
        { icon:'🧩', label:'Plugins disponibles', value: PLUGINS.length,                              color: colors.info },
        { icon:'✅', label:'Installes',            value: installed.length,                           color: colors.success },
        { icon:'⭐', label:'Officiels ORBIS',      value: PLUGINS.filter(p=>p.official).length,       color: colors.warning },
        { icon:'🆓', label:'Gratuits',             value: PLUGINS.filter(p=>p.price===0).length,      color: colors.primary },
      ]}/>

      <div style={{ display:'flex', gap:'10px', marginBottom:'16px' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher des plugins..." style={{ flex:1, padding:'12px 16px', background: colors.bgCard, border:'1px solid '+colors.border, borderRadius:'10px', color: colors.text, fontSize:'13px', outline:'none' }}/>
      </div>

      <div style={{ display:'flex', gap:'6px', marginBottom:'24px', flexWrap:'wrap' }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding:'6px 14px', borderRadius:'20px', border:'1px solid '+(activeCategory===cat?colors.primary:colors.border), background: activeCategory===cat?'rgba(178,34,52,0.15)':'transparent', color: activeCategory===cat?colors.primary:colors.textMuted, fontSize:'12px', cursor:'pointer', fontWeight: activeCategory===cat?'700':'400' }}>
            {cat}
          </button>
        ))}
      </div>

      {!selected ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px' }}>
          {filtered.map((plugin, i) => {
            const isInstalled = installed.includes(plugin.id)
            return (
              <Card key={i} style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                    <div style={{ width:'44px', height:'44px', borderRadius:'12px', background:plugin.color+'22', border:'1px solid '+plugin.color+'44', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px' }}>
                      {plugin.icon}
                    </div>
                    <div>
                      <div style={{ fontSize:'14px', fontWeight:'800', color: colors.text }}>{plugin.name}</div>
                      <div style={{ fontSize:'11px', color: colors.textMuted }}>par {plugin.author}</div>
                    </div>
                  </div>
                  {plugin.official && <Badge color="warning">✓ Officiel</Badge>}
                </div>

                <p style={{ margin:0, fontSize:'12px', color:'#6a8aaa', lineHeight:'1.5', flex:1 }}>{plugin.desc.slice(0,80)}...</p>

                <div style={{ display:'flex', flexWrap:'wrap', gap:'4px' }}>
                  {plugin.features.slice(0,3).map((f,j) => (
                    <span key={j} style={{ padding:'2px 8px', background:'rgba(255,255,255,0.05)', border:'1px solid '+colors.border, borderRadius:'10px', fontSize:'10px', color: colors.textMuted }}>{f}</span>
                  ))}
                </div>

                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', borderTop:'1px solid '+colors.border, paddingTop:'10px' }}>
                  <div>
                    <div style={{ fontSize:'14px', fontWeight:'900', color: plugin.price===0?colors.success:colors.text }}>
                      {plugin.price===0 ? 'Gratuit' : '$'+plugin.price+'/mois'}
                    </div>
                    <div style={{ fontSize:'10px', color: colors.textMuted }}>⭐ {plugin.rating} • {plugin.downloads.toLocaleString()} installs</div>
                  </div>
                  <div style={{ display:'flex', gap:'6px' }}>
                    <Button size="sm" variant="ghost" onClick={() => setSelected(plugin)}>Détails</Button>
                    <Button size="sm" variant={isInstalled?'danger':'primary'} onClick={() => toggleInstall(plugin.id)}>
                      {isInstalled ? 'Désinstaller' : 'Installer'}
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:'20px' }}>
          <Card>
            <div style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'24px' }}>
              <div style={{ width:'64px', height:'64px', borderRadius:'16px', background:selected.color+'22', border:'1px solid '+selected.color+'44', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'32px' }}>
                {selected.icon}
              </div>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' }}>
                  <h2 style={{ margin:0, fontSize:'20px', fontWeight:'900' }}>{selected.name}</h2>
                  {selected.official && <Badge color="warning">✓ Officiel</Badge>}
                </div>
                <div style={{ fontSize:'13px', color: colors.textMuted }}>par {selected.author} • v{selected.version}</div>
              </div>
            </div>
            <p style={{ fontSize:'14px', color:'#c8d8f0', lineHeight:'1.7', marginBottom:'20px' }}>{selected.desc}</p>
            <SectionTitle>Fonctionnalites</SectionTitle>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', marginBottom:'20px' }}>
              {selected.features.map((f: string, i: number) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'13px', color: colors.text }}>
                  <span style={{ color: colors.success }}>✓</span>{f}
                </div>
              ))}
            </div>
            <div style={{ display:'flex', gap:'10px' }}>
              <Button onClick={() => toggleInstall(selected.id)} variant={installed.includes(selected.id)?'danger':'primary'} style={{ flex:1 }}>
                {installed.includes(selected.id) ? '🗑️ Désinstaller' : '⬇️ Installer maintenant'}
              </Button>
              <Button variant="secondary" onClick={() => setSelected(null)} style={{ flex:1 }}>← Retour</Button>
            </div>
          </Card>
          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            <Card>
              <SectionTitle>Informations</SectionTitle>
              {[
                ['Version', 'v'+selected.version],
                ['Categorie', selected.category],
                ['Prix', selected.price===0?'Gratuit':'$'+selected.price+'/mois'],
                ['Note', '⭐ '+selected.rating+'/5'],
                ['Installations', selected.downloads.toLocaleString()],
                ['Statut', installed.includes(selected.id)?'Installe':'Non installe'],
              ].map(([k,v]) => (
                <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid '+colors.border, fontSize:'12px' }}>
                  <span style={{ color: colors.textMuted }}>{k}</span>
                  <span style={{ color: colors.text, fontWeight:'600' }}>{v}</span>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}
    </PageLayout>
  )
}
