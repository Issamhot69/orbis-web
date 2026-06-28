'use client'
import { useState } from 'react'
import { PageLayout, Card, Button, Badge, SectionTitle, colors } from '../components/orbis-ui'

const SDK_EXAMPLES = [
  {
    title: 'Installation',
    icon: '📦',
    code: `# NPM
npm install orbis-sdk

# Yarn
yarn add orbis-sdk

# CDN
<script src="https://cdn.orbis.app/sdk/v1.js"></script>`
  },
  {
    title: 'Initialisation',
    icon: '🚀',
    code: `import OrbisSDK from 'orbis-sdk'

const orbis = new OrbisSDK({
  apiUrl: 'https://orbis-production-6ad0.up.railway.app'
})

// Login
const { token, user } = await orbis.login(
  'admin@orbis.com',
  'secret123'
)
console.log('Logged in as:', user.firstName)`
  },
  {
    title: 'Marketplace',
    icon: '🛒',
    code: `// Search listings
const { listings } = await orbis.getListings({
  search: 'AI development',
  type: 'service'
})

// Create a listing
await orbis.createListing({
  title: 'AI Integration Service',
  description: 'We integrate AI into your business',
  type: 'service',
  price: 5000,
  currency: 'USD',
  priceType: 'fixed'
})`
  },
  {
    title: 'Organizations',
    icon: '🏢',
    code: `// Get all organizations
const { organizations } = await orbis.getOrganizations()

// Create organization
const { organization } = await orbis.createOrganization({
  name: 'My Company',
  industry: 'Technology',
  website: 'https://mycompany.com',
  description: 'We build the future'
})`
  },
  {
    title: 'AI Assistant',
    icon: '🤖',
    code: `// Ask the AI
const response = await orbis.askAI(
  'Analyze my latest deals and suggest improvements',
  'context: B2B SaaS company'
)
console.log(response.message)

// Add to memory
await orbis.addMemory(
  'Key insight: clients prefer monthly contracts',
  'sales'
)`
  },
  {
    title: 'Webhooks',
    icon: '📡',
    code: `// Listen to ORBIS events via webhooks
// Configure your endpoint in /integrations

// Your server will receive:
{
  "event": "deal.created",
  "data": {
    "id": "uuid",
    "title": "New Deal",
    "amount": 50000,
    "currency": "USD"
  },
  "timestamp": "2026-06-28T..."
}`
  },
]

const ENDPOINTS = [
  { method:'GET',   path:'/health',                    desc:'API health check',           auth:false },
  { method:'POST',  path:'/api/auth/register',          desc:'Register new user',          auth:false },
  { method:'POST',  path:'/api/auth/login',             desc:'Login and get JWT token',    auth:false },
  { method:'GET',   path:'/api/auth/me',                desc:'Get current user profile',   auth:true },
  { method:'PATCH', path:'/api/auth/me',                desc:'Update user profile',        auth:true },
  { method:'POST',  path:'/api/auth/forgot-password',   desc:'Request password reset',     auth:false },
  { method:'GET',   path:'/api/organizations',          desc:'List organizations',         auth:true },
  { method:'POST',  path:'/api/organizations',          desc:'Create organization',        auth:true },
  { method:'GET',   path:'/api/projects',               desc:'List projects',              auth:true },
  { method:'POST',  path:'/api/projects',               desc:'Create project',             auth:true },
  { method:'GET',   path:'/api/marketplace/listings',   desc:'Search listings',            auth:true },
  { method:'POST',  path:'/api/marketplace/listings',   desc:'Create listing',             auth:true },
  { method:'GET',   path:'/api/messaging',              desc:'List channels',              auth:true },
  { method:'GET',   path:'/api/contracts',              desc:'List contracts',             auth:true },
  { method:'GET',   path:'/api/payments',               desc:'List payments',              auth:true },
  { method:'GET',   path:'/api/trust',                  desc:'Get trust score',            auth:true },
  { method:'POST',  path:'/api/ai',                     desc:'Ask AI assistant',           auth:true },
  { method:'GET',   path:'/api/memory',                 desc:'List memory entries',        auth:true },
  { method:'POST',  path:'/api/memory',                 desc:'Add memory entry',           auth:true },
  { method:'GET',   path:'/api/opportunity',            desc:'List opportunities',         auth:true },
  { method:'GET',   path:'/api/stripe/plans',           desc:'Get subscription plans',     auth:false },
  { method:'POST',  path:'/api/stripe/checkout',        desc:'Create checkout session',    auth:true },
]

const methodColor: any = {
  GET:   '#00c896',
  POST:  '#1a6fff',
  PATCH: '#f4c842',
  DELETE:'#ff6b6b',
  PUT:   '#a78bfa',
}

export default function SDKPage() {
  const [activeExample, setActiveExample] = useState(0)
  const [copied, setCopied]               = useState(false)

  function copyCode() {
    navigator.clipboard.writeText(SDK_EXAMPLES[activeExample].code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <PageLayout title="🔌 ORBIS SDK" subtitle="Integrez ORBIS dans vos applications en quelques lignes">

      {/* Header stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'14px', marginBottom:'28px' }}>
        {[
          { icon:'📦', label:'SDK disponible',    value:'JavaScript / TypeScript', color: colors.info },
          { icon:'🔗', label:'Endpoints',          value: ENDPOINTS.length + ' routes',  color: colors.success },
          { icon:'📖', label:'Documentation',      value:'Swagger UI',             color: colors.warning },
          { icon:'⚡', label:'Latence moyenne',    value:'< 100ms',                color: colors.primary },
        ].map((s,i) => (
          <Card key={i}>
            <div style={{ fontSize:'20px', marginBottom:'8px' }}>{s.icon}</div>
            <div style={{ fontSize:'15px', fontWeight:'900', color:s.color }}>{s.value}</div>
            <div style={{ fontSize:'11px', color: colors.textMuted, marginTop:'4px' }}>{s.label}</div>
          </Card>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'24px' }}>

        {/* Code examples */}
        <Card>
          <SectionTitle>Exemples de code</SectionTitle>
          <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:'16px' }}>
            {SDK_EXAMPLES.map((ex, i) => (
              <button key={i} onClick={() => setActiveExample(i)} style={{ padding:'6px 12px', borderRadius:'8px', border:'1px solid '+(activeExample===i?colors.primary:colors.border), background: activeExample===i?'rgba(178,34,52,0.15)':'transparent', color: activeExample===i?colors.primary:colors.textMuted, fontSize:'11px', cursor:'pointer', fontWeight: activeExample===i?'700':'400' }}>
                {SDK_EXAMPLES[i].icon} {SDK_EXAMPLES[i].title}
              </button>
            ))}
          </div>
          <div style={{ position:'relative' }}>
            <pre style={{ background: colors.bg, border:'1px solid '+colors.border, borderRadius:'10px', padding:'16px', fontSize:'12px', color:'#00c896', overflow:'auto', margin:0, lineHeight:'1.6' }}>
              {SDK_EXAMPLES[activeExample].code}
            </pre>
            <button onClick={copyCode} style={{ position:'absolute', top:'10px', right:'10px', padding:'4px 12px', background: copied?colors.success:colors.primary, border:'none', borderRadius:'6px', color:'#fff', fontSize:'11px', fontWeight:'700', cursor:'pointer' }}>
              {copied ? 'Copie !' : 'Copier'}
            </button>
          </div>
        </Card>

        {/* Quick start */}
        <Card>
          <SectionTitle color={colors.success}>Quick Start — 3 etapes</SectionTitle>
          {[
            { step:'1', title:'Installer le SDK', code:'npm install orbis-sdk', desc:'Compatible Node.js, React, Vue, Angular' },
            { step:'2', title:'Initialiser et se connecter', code:'const orbis = new OrbisSDK(); await orbis.login(email, password)', desc:'JWT token stocke automatiquement' },
            { step:'3', title:'Utiliser les modules', code:'await orbis.getListings({ search: AI }); await orbis.createOrganization({...})', desc:'Acces a tous les modules ORBIS' },
          ].map((s,i) => (
            <div key={i} style={{ display:'flex', gap:'12px', padding:'14px', background: colors.bg, border:'1px solid '+colors.border, borderRadius:'10px', marginBottom:'10px' }}>
              <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'#B22234', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', fontWeight:'900', color:'#fff', flexShrink:0 }}>{s.step}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:'13px', fontWeight:'700', marginBottom:'4px' }}>{s.title}</div>
                <pre style={{ background:'rgba(0,0,0,0.3)', borderRadius:'6px', padding:'6px 10px', fontSize:'11px', color:'#00c896', margin:'0 0 4px', overflow:'auto' }}>{s.code}</pre>
                <div style={{ fontSize:'11px', color: colors.textMuted }}>{s.desc}</div>
              </div>
            </div>
          ))}
          <div style={{ display:'flex', gap:'10px', marginTop:'16px' }}>
            <Button onClick={() => window.open('http://localhost:4080/api/docs','_blank')} style={{ flex:1 }}>
              📖 Documentation Swagger
            </Button>
            <Button variant="ghost" onClick={() => window.open('https://github.com/Issamhot69/orbis','_blank')} style={{ flex:1 }}>
              GitHub
            </Button>
          </div>
        </Card>
      </div>

      {/* API Reference */}
      <Card>
        <SectionTitle>Reference API — {ENDPOINTS.length} endpoints</SectionTitle>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12px' }}>
            <thead>
              <tr style={{ borderBottom:'1px solid '+colors.border }}>
                {['Method','Endpoint','Description','Auth'].map(h => (
                  <th key={h} style={{ padding:'8px 12px', textAlign:'left', color: colors.textMuted, fontWeight:'700', fontSize:'11px', textTransform:'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ENDPOINTS.map((ep, i) => (
                <tr key={i} style={{ borderBottom:'1px solid rgba(30,58,95,0.5)' }}>
                  <td style={{ padding:'8px 12px' }}>
                    <span style={{ padding:'2px 8px', background: methodColor[ep.method]+'22', border:'1px solid '+methodColor[ep.method]+'44', borderRadius:'4px', color: methodColor[ep.method], fontSize:'10px', fontWeight:'700', fontFamily:'monospace' }}>{ep.method}</span>
                  </td>
                  <td style={{ padding:'8px 12px' }}>
                    <code style={{ fontSize:'11px', color: colors.info }}>{ep.path}</code>
                  </td>
                  <td style={{ padding:'8px 12px', color: colors.textMuted }}>{ep.desc}</td>
                  <td style={{ padding:'8px 12px' }}>
                    <Badge color={ep.auth ? 'warning' : 'success'}>{ep.auth ? 'JWT' : 'Public'}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </PageLayout>
  )
}
