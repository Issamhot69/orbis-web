'use client'
import { useEffect, useState } from 'react'
import { OrbisActionBar } from '../components/orbis-suite'
import { PageLayout, Card, Button, Badge, StatsGrid, SectionTitle, colors } from '../components/orbis-ui'

const INVESTORS = [
  { name:'Sarah Venture Capital', country:'🇺🇸 USA', type:'VC', focus:['AI','SaaS','B2B'], minTicket:500000, maxTicket:5000000, portfolio:34, trust:97, bio:'Top 10 VC Silicon Valley. Focus early-stage B2B SaaS et AI. Portfolio: 34 startups dont 3 unicorns.', color:'#1a6fff' },
  { name:'Gulf Investment Fund', country:'🇦🇪 UAE', type:'PE', focus:['Fintech','Real Estate','Energy'], minTicket:2000000, maxTicket:50000000, portfolio:18, trust:94, bio:'Fonds souverain Abu Dhabi. Focus MENA et marchés émergents. Ticket min 2M USD.', color:'#f4c842' },
  { name:'Tokyo Growth Partners', country:'🇯🇵 Japon', type:'VC', focus:['DeepTech','Robotics','AI'], minTicket:1000000, maxTicket:10000000, portfolio:27, trust:96, bio:'Leader investissement tech Asie-Pacifique. Spécialiste DeepTech et robotique industrielle.', color:'#00c896' },
  { name:'London Capital Group', country:'🇬🇧 UK', type:'Angel', focus:['Marketplace','Commerce','Logistics'], minTicket:100000, maxTicket:2000000, portfolio:52, trust:91, bio:'Réseau 200 business angels. Focus marketplace et commerce digital. Accompagnement stratégique.', color:'#a78bfa' },
  { name:'Berlin Tech Ventures', country:'🇩🇪 Allemagne', type:'VC', focus:['B2B','SaaS','Sustainability'], minTicket:500000, maxTicket:8000000, portfolio:41, trust:93, bio:'Leader VC Europe continentale. Focus B2B SaaS et greentech. 15 ans expérience.', color:'#00c896' },
  { name:'Singapore Fintech Hub', country:'🇸🇬 Singapour', type:'CVC', focus:['Fintech','Payments','Blockchain'], minTicket:1000000, maxTicket:20000000, portfolio:23, trust:95, bio:'Corporate VC banque DBS. Focus fintech et paiements Asie. Accès réseau bancaire mondial.', color:'#1a6fff' },
]

const STARTUPS = [
  { name:'ORBIS Corp', country:'🇲🇦 Maroc', stage:'Pre-Seed', sector:'B2B SaaS', seeking:500000, valuation:2500000, traction:'12 modules live, 3 clients beta', trust:95, desc:'Plateforme B2B mondiale — Business OS + Marketplace IA. Vision: remplacer LinkedIn + Alibaba.', color:'#B22234' },
  { name:'AgriTech Morocco', country:'🇲🇦 Maroc', stage:'Seed', sector:'AgriTech', seeking:2000000, valuation:8000000, traction:'500 agriculteurs, $2M GMV', trust:88, desc:'Plateforme digitale connectant agriculteurs africains aux acheteurs mondiaux. IA pour prédiction récoltes.', color:'#00c896' },
  { name:'MedAI Labs', country:'🇫🇷 France', stage:'Series A', sector:'HealthTech', seeking:10000000, valuation:45000000, traction:'50 hôpitaux, €3M ARR', trust:92, desc:'IA diagnostique médicale. 98% précision détection cancer. Certifié CE, FDA pending.', color:'#a78bfa' },
  { name:'GreenEnergy MENA', country:'🇦🇪 UAE', stage:'Seed', sector:'CleanTech', seeking:5000000, valuation:20000000, traction:'3 projets solaires, 50MW installés', trust:90, desc:'Développeur projets solaires MENA. Pipeline 500MW. PPA signés avec 3 gouvernements.', color:'#f4c842' },
  { name:'LogiChain AI', country:'🇩🇪 Allemagne', stage:'Series B', sector:'Logistics', seeking:25000000, valuation:120000000, traction:'200 clients, €15M ARR', trust:96, desc:'IA optimisation supply chain. Réduit coûts logistiques 35%. Clients: BMW, Siemens, DHL.', color:'#1a6fff' },
]

export default function InvestorsPage() {
  const [tab, setTab]             = useState<'find-investors'|'find-startups'|'my-pitch'>('find-investors')
  const [showSuite, setShowSuite] = useState(false)
  const [suiteUser, setSuiteUser] = useState<any>(null)
  const [suiteContext, setSuiteContext] = useState('')
  const [selected, setSelected]   = useState<any>(null)
  const [selectedType, setSelectedType] = useState<'investor'|'startup'>('investor')
  const [filterType, setFilterType] = useState('')
  const [filterSector, setFilterSector] = useState('')
  const [showPitch, setShowPitch] = useState(false)

  const investorTypes = ['VC','PE','Angel','CVC']
  const sectors = ['AI','SaaS','B2B','Fintech','AgriTech','HealthTech','CleanTech','Logistics','Marketplace']

  return (
    <PageLayout
      title="💰 Investors Hub"
      subtitle="Connectez investisseurs et startups — deals mondiaux"
      action={<Button onClick={() => setShowPitch(true)}>+ Pitcher mon projet</Button>}
    >
      <StatsGrid stats={[
        { icon:'💰', label:'Investisseurs actifs', value: INVESTORS.length,                                    color: colors.warning },
        { icon:'🚀', label:'Startups cherchent',   value: STARTUPS.length,                                    color: colors.info },
        { icon:'💵', label:'Capital disponible',   value: '$500M+',                                           color: colors.success },
        { icon:'🌍', label:'Pays représentés',     value: new Set([...INVESTORS,...STARTUPS].map(x=>x.country)).size, color: colors.primary },
      ]}/>

      {/* Tabs */}
      <div style={{ display:'flex', gap:'4px', background: colors.bgCard, borderRadius:'12px', padding:'4px', marginBottom:'24px', width:'fit-content' }}>
        {([
          {id:'find-investors', label:'🔍 Trouver des investisseurs'},
          {id:'find-startups',  label:'🚀 Trouver des startups'},
          {id:'my-pitch',       label:'📊 Mon Pitch Deck'},
        ] as const).map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setSelected(null) }} style={{ padding:'10px 20px', border:'none', borderRadius:'8px', background: tab===t.id?colors.primary:'transparent', color: tab===t.id?'#fff':colors.textMuted, fontSize:'13px', fontWeight:'700', cursor:'pointer' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Find Investors */}
      {tab === 'find-investors' && !selected && (
        <>
          <div style={{ display:'flex', gap:'8px', marginBottom:'20px', flexWrap:'wrap' }}>
            {investorTypes.map(type => (
              <button key={type} onClick={() => setFilterType(filterType===type?'':type)} style={{ padding:'6px 14px', borderRadius:'20px', border:'1px solid '+(filterType===type?colors.warning:colors.border), background: filterType===type?'rgba(244,200,66,0.15)':'transparent', color: filterType===type?colors.warning:colors.textMuted, fontSize:'12px', cursor:'pointer', fontWeight: filterType===type?'700':'400' }}>
                {type}
              </button>
            ))}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'16px' }}>
            {INVESTORS.filter(inv => !filterType || inv.type === filterType).map((inv, i) => (
              <Card key={i} onClick={() => { setSelected(inv); setSelectedType('investor') }} style={{ cursor:'pointer' }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:'14px', marginBottom:'14px' }}>
                  <div style={{ width:'52px', height:'52px', borderRadius:'14px', background:inv.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', fontWeight:'900', color:'#fff', flexShrink:0 }}>
                    {inv.name[0]}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' }}>
                      <h3 style={{ margin:0, fontSize:'15px', fontWeight:'800' }}>{inv.name}</h3>
                      <Badge color="warning">{inv.type}</Badge>
                    </div>
                    <div style={{ fontSize:'12px', color: colors.textMuted }}>{inv.country} • Trust {inv.trust}/100</div>
                  </div>
                </div>
                <p style={{ margin:'0 0 12px', fontSize:'12px', color:'#6a8aaa', lineHeight:'1.5' }}>{inv.bio.slice(0,100)}...</p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'6px', marginBottom:'12px' }}>
                  {inv.focus.map((f,j) => <Badge key={j} color="default">{f}</Badge>)}
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', borderTop:'1px solid '+colors.border, paddingTop:'10px' }}>
                  <div style={{ fontSize:'12px' }}>
                    <span style={{ color: colors.textMuted }}>Ticket: </span>
                    <span style={{ color: colors.success, fontWeight:'700' }}>${(inv.minTicket/1000)}K — ${(inv.maxTicket/1000000)}M</span>
                  </div>
                  <div style={{ fontSize:'12px', color: colors.textMuted }}>{inv.portfolio} investissements</div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Find Startups */}
      {tab === 'find-startups' && !selected && (
        <>
          <div style={{ display:'flex', gap:'8px', marginBottom:'20px', flexWrap:'wrap' }}>
            {['Pre-Seed','Seed','Series A','Series B'].map(stage => (
              <button key={stage} onClick={() => setFilterSector(filterSector===stage?'':stage)} style={{ padding:'6px 14px', borderRadius:'20px', border:'1px solid '+(filterSector===stage?colors.info:colors.border), background: filterSector===stage?'rgba(91,159,255,0.15)':'transparent', color: filterSector===stage?colors.info:colors.textMuted, fontSize:'12px', cursor:'pointer', fontWeight: filterSector===stage?'700':'400' }}>
                {stage}
              </button>
            ))}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'16px' }}>
            {STARTUPS.filter(s => !filterSector || s.stage === filterSector).map((startup, i) => (
              <Card key={i} onClick={() => { setSelected(startup); setSelectedType('startup') }} style={{ cursor:'pointer' }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:'14px', marginBottom:'14px' }}>
                  <div style={{ width:'52px', height:'52px', borderRadius:'14px', background:startup.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', fontWeight:'900', color:'#fff', flexShrink:0 }}>
                    {startup.name[0]}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' }}>
                      <h3 style={{ margin:0, fontSize:'15px', fontWeight:'800' }}>{startup.name}</h3>
                      <Badge color="info">{startup.stage}</Badge>
                    </div>
                    <div style={{ fontSize:'12px', color: colors.textMuted }}>{startup.country} • {startup.sector}</div>
                  </div>
                </div>
                <p style={{ margin:'0 0 12px', fontSize:'12px', color:'#6a8aaa', lineHeight:'1.5' }}>{startup.desc.slice(0,100)}...</p>
                <div style={{ background: colors.bg, borderRadius:'8px', padding:'10px', marginBottom:'12px' }}>
                  <div style={{ fontSize:'11px', color: colors.textMuted, marginBottom:'4px' }}>Traction</div>
                  <div style={{ fontSize:'12px', color: colors.success, fontWeight:'600' }}>{startup.traction}</div>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', borderTop:'1px solid '+colors.border, paddingTop:'10px' }}>
                  <div style={{ fontSize:'12px' }}>
                    <span style={{ color: colors.textMuted }}>Cherche: </span>
                    <span style={{ color: colors.warning, fontWeight:'700' }}>${(startup.seeking/1000)}K</span>
                  </div>
                  <div style={{ fontSize:'12px' }}>
                    <span style={{ color: colors.textMuted }}>Valorisation: </span>
                    <span style={{ color: colors.info, fontWeight:'700' }}>${(startup.valuation/1000000)}M</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Detail View */}
      {selected && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:'20px' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
            <Card>
              <div style={{ display:'flex', gap:'16px', marginBottom:'20px' }}>
                <div style={{ width:'64px', height:'64px', borderRadius:'16px', background:selected.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px', fontWeight:'900', color:'#fff', flexShrink:0 }}>
                  {selected.name[0]}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px' }}>
                    <h2 style={{ margin:0, fontSize:'20px', fontWeight:'900' }}>{selected.name}</h2>
                    <Badge color={selectedType==='investor'?'warning':'info'}>{selected.type||selected.stage}</Badge>
                  </div>
                  <div style={{ fontSize:'13px', color: colors.textMuted, marginBottom:'8px' }}>{selected.country} • Trust Score {selected.trust}/100</div>
                  <p style={{ margin:0, fontSize:'13px', color:'#6a8aaa', lineHeight:'1.6' }}>{selected.bio||selected.desc}</p>
                </div>
              </div>

              {selectedType === 'investor' && (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px' }}>
                  {[
                    { icon:'💰', label:'Ticket min', value:'$'+(selected.minTicket/1000)+'K' },
                    { icon:'💵', label:'Ticket max', value:'$'+(selected.maxTicket/1000000)+'M' },
                    { icon:'📊', label:'Portfolio', value:selected.portfolio+' startups' },
                  ].map((s,i) => (
                    <div key={i} style={{ background: colors.bg, border:'1px solid '+colors.border, borderRadius:'10px', padding:'14px', textAlign:'center' }}>
                      <div style={{ fontSize:'20px', marginBottom:'6px' }}>{s.icon}</div>
                      <div style={{ fontSize:'16px', fontWeight:'900', color: colors.warning }}>{s.value}</div>
                      <div style={{ fontSize:'10px', color: colors.textMuted, marginTop:'2px' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {selectedType === 'startup' && (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px' }}>
                  {[
                    { icon:'🎯', label:'Recherche', value:'$'+(selected.seeking/1000)+'K' },
                    { icon:'📈', label:'Valorisation', value:'$'+(selected.valuation/1000000)+'M' },
                    { icon:'🏆', label:'Traction', value:selected.traction?.split(',')[0] },
                  ].map((s,i) => (
                    <div key={i} style={{ background: colors.bg, border:'1px solid '+colors.border, borderRadius:'10px', padding:'14px', textAlign:'center' }}>
                      <div style={{ fontSize:'20px', marginBottom:'6px' }}>{s.icon}</div>
                      <div style={{ fontSize:'14px', fontWeight:'900', color: colors.info }}>{s.value}</div>
                      <div style={{ fontSize:'10px', color: colors.textMuted, marginTop:'2px' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <div style={{ display:'flex', gap:'10px' }}>
              <Button style={{ flex:1 }}>💬 Envoyer un message</Button>
              <Button variant="success" style={{ flex:1 }}>🤝 Proposer un deal</Button>
              <Button variant="ghost" style={{ flex:1 }}>📅 Planifier réunion</Button>
            </div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            <Card>
              <SectionTitle>Trust Passport</SectionTitle>
              <div style={{ marginBottom:'12px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                  <span style={{ fontSize:'12px', color: colors.textMuted }}>Score global</span>
                  <span style={{ fontSize:'12px', fontWeight:'700', color: colors.success }}>{selected.trust}/100</span>
                </div>
                <div style={{ height:'8px', background: colors.border, borderRadius:'4px', overflow:'hidden' }}>
                  <div style={{ width:selected.trust+'%', height:'100%', background: colors.success, borderRadius:'4px' }}></div>
                </div>
              </div>
              {['Identité vérifiée','Entreprise vérifiée','Historique deals','Réputation réseau'].map((item,i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', fontSize:'12px', borderBottom:'1px solid '+colors.border }}>
                  <span style={{ color: colors.textMuted }}>{item}</span>
                  <span style={{ color: colors.success }}>✓</span>
                </div>
              ))}
            </Card>

            <Card>
              <SectionTitle>Focus</SectionTitle>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                {(selected.focus||[selected.sector]).map((f: string, i: number) => (
                  <Badge key={i} color="default">{f}</Badge>
                ))}
              </div>
            </Card>

            <Button variant="secondary" onClick={() => setSelected(null)} style={{ width:'100%' }}>
              ← Retour
            </Button>
          </div>
        </div>
      )}

      {/* My Pitch Deck */}
      {tab === 'my-pitch' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' }}>
          <Card>
            <SectionTitle>Mon Pitch Deck ORBIS</SectionTitle>
            {[
              { label:'Nom du projet',    value:'ORBIS Corp' },
              { label:'Secteur',          value:'B2B SaaS / Marketplace' },
              { label:'Stage',            value:'Pre-Seed' },
              { label:'Montant cherché',  value:'$500,000 USD' },
              { label:'Valorisation',     value:'$2,500,000 USD' },
              { label:'Traction',         value:'12 modules, 3 clients beta' },
              { label:'Vision',           value:'Remplacer LinkedIn + Alibaba' },
            ].map((item: any) => {const k = item.label; const v = item.value; return (
              <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid '+colors.border, fontSize:'13px' }}>
                <span style={{ color: colors.textMuted }}>{k}</span>
                <span style={{ color: colors.text, fontWeight:'700' }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop:'16px', display:'flex', gap:'10px' }}>
              <Button style={{ flex:1 }}>📤 Partager aux investisseurs</Button>
              <Button variant="ghost" style={{ flex:1 }}>✏️ Modifier</Button>
            </div>
          </Card>
          <Card>
            <SectionTitle color={colors.success}>Investisseurs matchés</SectionTitle>
            {INVESTORS.slice(0,4).map((inv,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 0', borderBottom:'1px solid '+colors.border }}>
                <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:inv.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', fontWeight:'900', color:'#fff' }}>{inv.name[0]}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:'13px', fontWeight:'700' }}>{inv.name}</div>
                  <div style={{ fontSize:'10px', color: colors.textMuted }}>{inv.type} • {inv.country}</div>
                </div>
                <Button size="sm">Pitcher</Button>
              </div>
            ))}
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
