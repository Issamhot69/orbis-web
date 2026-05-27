'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageLayout, Card, Button, Badge, StatsGrid, SectionTitle, colors } from '../components/orbis-ui'

const INTEGRATIONS = [
  { name:'Zapier', icon:'⚡', category:'Automation', status:'available', users:'5000+ apps', desc:'Automatisez ORBIS avec 5000+ applications. Triggers sur nouveaux deals, contrats, messages.', color:'#ff6b00', popular:true },
  { name:'Make (Integromat)', icon:'🔄', category:'Automation', status:'available', users:'1000+ apps', desc:'Workflows visuels complexes. Connectez ORBIS a vos outils existants sans code.', color:'#6c3fc5', popular:true },
  { name:'Salesforce', icon:'☁️', category:'CRM', status:'available', users:'CRM #1 mondial', desc:'Sync automatique contacts, deals et opportunites entre ORBIS et Salesforce.', color:'#00a1e0', popular:true },
  { name:'HubSpot', icon:'🧲', category:'CRM', status:'available', users:'CRM PME', desc:'Import/export contacts, deals, emails. Newsletter ORBIS vers HubSpot automatique.', color:'#ff7a59', popular:true },
  { name:'Slack', icon:'💬', category:'Communication', status:'available', users:'Chat equipe', desc:'Notifications ORBIS dans Slack. Nouveaux deals, messages, alertes contrats.', color:'#4a154b', popular:false },
  { name:'Microsoft Teams', icon:'👥', category:'Communication', status:'available', users:'Enterprise', desc:'Integration native Teams. Reunions ORBIS synchronisees avec votre calendrier Teams.', color:'#6264a7', popular:false },
  { name:'Google Workspace', icon:'🔵', category:'Productivity', status:'available', users:'Gmail + Drive', desc:'Sync emails Gmail, fichiers Drive, Calendar. Contrats ORBIS exportes vers Docs.', color:'#4285f4', popular:true },
  { name:'Stripe', icon:'💳', category:'Payments', status:'connected', users:'Paiements', desc:'Paiements reels actives. Subscriptions Pro et Enterprise. Webhooks configures.', color:'#635bff', popular:true },
  { name:'QuickBooks', icon:'📊', category:'Finance', status:'available', users:'Comptabilite', desc:'Export automatique factures ORBIS vers QuickBooks. Reconciliation bancaire auto.', color:'#2ca01c', popular:false },
  { name:'LinkedIn', icon:'💼', category:'Social', status:'available', users:'Reseau pro', desc:'Import contacts LinkedIn dans ORBIS. Auto-post vos offres marketplace sur LinkedIn.', color:'#0077b5', popular:true },
  { name:'WhatsApp Business', icon:'📱', category:'Communication', status:'coming', users:'Messaging', desc:'Envoyer messages ORBIS via WhatsApp Business. Notifications deals et contrats.', color:'#25d366', popular:false },
  { name:'Shopify', icon:'🛍️', category:'E-commerce', status:'coming', users:'E-commerce', desc:'Connectez votre boutique Shopify au Wholesale Marketplace ORBIS.', color:'#96bf48', popular:false },
]

const WEBHOOKS = [
  { event:'deal.created', desc:'Nouveau deal cree sur marketplace', method:'POST' },
  { event:'contract.signed', desc:'Contrat signe electroniquement', method:'POST' },
  { event:'payment.completed', desc:'Paiement escrow libere', method:'POST' },
  { event:'user.registered', desc:'Nouvel utilisateur inscrit', method:'POST' },
  { event:'message.received', desc:'Nouveau message recu', method:'POST' },
  { event:'trust.updated', desc:'Trust Score mis a jour', method:'POST' },
]

export default function IntegrationsPage() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState('all')
  const [selected, setSelected] = useState<any>(null)
  const [webhookUrl, setWebhookUrl] = useState('')
  const [webhookSaved, setWebhookSaved] = useState(false)

  const categories = ['all', 'Automation', 'CRM', 'Communication', 'Productivity', 'Payments', 'Finance', 'Social']

  const filtered = INTEGRATIONS.filter(i => activeCategory === 'all' || i.category === activeCategory)

  const statusColor: any = {
    available:  { color:'#5b9fff', label:'Disponible' },
    connected:  { color:'#00c896', label:'Connecte' },
    coming:     { color:'#f4c842', label:'Bientot' },
  }

  return (
    <PageLayout
      title="🔌 Integrations"
      subtitle="Connectez ORBIS a vos outils existants — 5000+ applications"
    >
      <StatsGrid stats={[
        { icon:'🔌', label:'Integrations disponibles', value: INTEGRATIONS.filter(i=>i.status==='available').length, color: colors.info },
        { icon:'✅', label:'Connectees',               value: INTEGRATIONS.filter(i=>i.status==='connected').length, color: colors.success },
        { icon:'⏳', label:'Bientot',                  value: INTEGRATIONS.filter(i=>i.status==='coming').length,    color: colors.warning },
        { icon:'📡', label:'Webhooks disponibles',     value: WEBHOOKS.length,                                       color: colors.primary },
      ]}/>

      {/* Categories */}
      <div style={{ display:'flex', gap:'8px', marginBottom:'24px', flexWrap:'wrap' }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding:'7px 14px', borderRadius:'20px', border:'1px solid '+(activeCategory===cat?colors.primary:colors.border), background: activeCategory===cat?'rgba(178,34,52,0.15)':'transparent', color: activeCategory===cat?colors.primary:colors.textMuted, fontSize:'12px', cursor:'pointer', fontWeight: activeCategory===cat?'700':'400' }}>
            {cat === 'all' ? 'Toutes' : cat}
          </button>
        ))}
      </div>

      {!selected ? (
        <>
          {/* Integrations Grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px', marginBottom:'32px' }}>
            {filtered.map((integration, i) => {
              const status = statusColor[integration.status]
              return (
                <Card key={i} onClick={() => setSelected(integration)} style={{ cursor:'pointer', position:'relative' }}>
                  {integration.popular && (
                    <div style={{ position:'absolute', top:'-8px', right:'16px', padding:'2px 10px', background:'#B22234', borderRadius:'10px', fontSize:'10px', fontWeight:'700', color:'#fff' }}>Popular</div>
                  )}
                  <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'12px' }}>
                    <div style={{ width:'44px', height:'44px', borderRadius:'12px', background:integration.color+'22', border:'1px solid '+integration.color+'44', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px' }}>
                      {integration.icon}
                    </div>
                    <div>
                      <div style={{ fontSize:'15px', fontWeight:'800', color: colors.text }}>{integration.name}</div>
                      <div style={{ fontSize:'11px', color: colors.textMuted }}>{integration.category}</div>
                    </div>
                    <div style={{ marginLeft:'auto' }}>
                      <Badge color={integration.status==='connected'?'success':integration.status==='coming'?'warning':'info'}>
                        {status.label}
                      </Badge>
                    </div>
                  </div>
                  <p style={{ margin:'0 0 12px', fontSize:'12px', color:'#6a8aaa', lineHeight:'1.5' }}>{integration.desc.slice(0,80)}...</p>
                  <div style={{ fontSize:'11px', color: colors.textMuted }}>{integration.users}</div>
                </Card>
              )
            })}
          </div>

          {/* Webhooks */}
          <Card>
            <SectionTitle>Webhooks ORBIS</SectionTitle>
            <p style={{ fontSize:'13px', color:'#6a8aaa', marginBottom:'16px' }}>
              Recevez des notifications en temps reel dans votre application quand des evenements se produisent sur ORBIS.
            </p>
            <div style={{ display:'flex', gap:'10px', marginBottom:'20px' }}>
              <input value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} placeholder="https://votre-app.com/webhook" style={{ flex:1, padding:'10px 14px', background: colors.bg, border:'1px solid '+colors.border, borderRadius:'8px', color: colors.text, fontSize:'13px', outline:'none' }}/>
              <Button onClick={() => { if(webhookUrl) setWebhookSaved(true) }}>
                {webhookSaved ? '✅ Sauvegarde' : 'Ajouter webhook'}
              </Button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
              {WEBHOOKS.map((w,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'10px 14px', background: colors.bg, border:'1px solid '+colors.border, borderRadius:'8px' }}>
                  <span style={{ padding:'2px 8px', background:'rgba(0,200,150,0.1)', border:'1px solid #00c896', borderRadius:'4px', fontSize:'10px', color:'#00c896', fontFamily:'monospace', flexShrink:0 }}>{w.method}</span>
                  <code style={{ fontSize:'12px', color: colors.info, flex:1 }}>{w.event}</code>
                  <span style={{ fontSize:'12px', color: colors.textMuted }}>{w.desc}</span>
                </div>
              ))}
            </div>
          </Card>
        </>
      ) : (
        /* Integration Detail */
        <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:'20px' }}>
          <Card>
            <div style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'24px' }}>
              <div style={{ width:'64px', height:'64px', borderRadius:'16px', background:selected.color+'22', border:'1px solid '+selected.color+'44', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'32px' }}>
                {selected.icon}
              </div>
              <div>
                <h2 style={{ margin:'0 0 4px', fontSize:'22px', fontWeight:'900' }}>{selected.name}</h2>
                <div style={{ fontSize:'13px', color: colors.textMuted }}>{selected.category} • {selected.users}</div>
              </div>
              <div style={{ marginLeft:'auto' }}>
                <Badge color={selected.status==='connected'?'success':selected.status==='coming'?'warning':'info'}>
                  {statusColor[selected.status].label}
                </Badge>
              </div>
            </div>
            <p style={{ fontSize:'14px', color:'#c8d8f0', lineHeight:'1.7', marginBottom:'24px' }}>{selected.desc}</p>
            <SectionTitle>Comment integrer</SectionTitle>
            {[
              '1. Cliquez sur "Connecter" pour authoriser ORBIS',
              '2. Selectionnez les evenements a synchroniser',
              '3. Configurez les champs de mapping',
              '4. Testez la connexion avec un evenement test',
              '5. Activez pour la production',
            ].map((step,i) => (
              <div key={i} style={{ display:'flex', gap:'10px', padding:'8px 0', fontSize:'13px', color:'#c8d8f0', borderBottom:'1px solid '+colors.border }}>
                <span style={{ color: colors.primary }}>{step}</span>
              </div>
            ))}
            <div style={{ display:'flex', gap:'10px', marginTop:'24px' }}>
              <Button onClick={() => alert('Integration ' + selected.name + ' en cours de connexion...')} style={{ flex:1 }}>
                🔌 {selected.status === 'connected' ? 'Configurer' : selected.status === 'coming' ? 'Notifier quand disponible' : 'Connecter maintenant'}
              </Button>
              <Button variant="secondary" onClick={() => setSelected(null)} style={{ flex:1 }}>
                ← Retour
              </Button>
            </div>
          </Card>
          <Card>
            <SectionTitle>Details</SectionTitle>
            {[
              ['Categorie',  selected.category],
              ['Status',     statusColor[selected.status].label],
              ['Utilisateurs', selected.users],
              ['Webhooks',   'Supportes'],
              ['OAuth',      'Supporte'],
              ['API Key',    'Supporte'],
            ].map(([k,v]) => (
              <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid '+colors.border, fontSize:'12px' }}>
                <span style={{ color: colors.textMuted }}>{k}</span>
                <span style={{ color: colors.text, fontWeight:'600' }}>{v}</span>
              </div>
            ))}
          </Card>
        </div>
      )}
    </PageLayout>
  )
}
