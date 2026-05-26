'use client'
import { useEffect, useState } from 'react'
import { PageLayout, Card, Button, Badge, StatsGrid, SectionTitle, colors } from '../components/orbis-ui'

const API = 'http://localhost:4080'

export default function AdminPage() {
  const [stats, setStats]     = useState<any>(null)
  const [users, setUsers]     = useState<any[]>([])
  const [security, setSecurity] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab]         = useState('dashboard')
  const [banIP, setBanIP]     = useState('')
  const token = typeof window !== 'undefined' ? localStorage.getItem('orbis_token') : ''

  useEffect(() => {
    if (!token) return
    fetchStats()
    fetchUsers()
  }, [])

  async function fetchStats() {
    try {
      const res  = await fetch(API + '/api/admin/stats', { headers:{ Authorization:'Bearer '+token } })
      const data = await res.json()
      setStats(data.stats)
      setSecurity(data.security)
    } catch(e) {} finally { setLoading(false) }
  }

  async function fetchUsers() {
    try {
      const res  = await fetch(API + '/api/admin/users', { headers:{ Authorization:'Bearer '+token } })
      const data = await res.json()
      setUsers(data.users || [])
    } catch(e) {}
  }

  async function handleBan(ip: string) {
    try {
      await fetch(API + '/api/admin/security/ban', {
        method:'POST',
        headers:{ 'Content-Type':'application/json', Authorization:'Bearer '+token },
        body: JSON.stringify({ ip })
      })
      fetchStats()
      setBanIP('')
      alert('IP bannie: '+ip)
    } catch(e) {}
  }

  async function handleUnban(ip: string) {
    try {
      await fetch(API + '/api/admin/security/unban', {
        method:'POST',
        headers:{ 'Content-Type':'application/json', Authorization:'Bearer '+token },
        body: JSON.stringify({ ip })
      })
      fetchStats()
    } catch(e) {}
  }

  return (
    <PageLayout title="🛡️ ORBIS Admin Panel" subtitle="Gestion plateforme et securite IA">
      
      {/* Tabs */}
      <div style={{ display:'flex', gap:'4px', background: colors.bgCard, borderRadius:'10px', padding:'4px', marginBottom:'24px', width:'fit-content' }}>
        {[
          {id:'dashboard', label:'📊 Dashboard'},
          {id:'users',     label:'👥 Utilisateurs'},
          {id:'security',  label:'🛡️ Securite IA'},
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding:'8px 16px', border:'none', borderRadius:'7px', background: tab===t.id?colors.primary:'transparent', color: tab===t.id?'#fff':colors.textMuted, fontSize:'12px', fontWeight:'700', cursor:'pointer' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {tab === 'dashboard' && (
        <>
          {loading ? (
            <div style={{ textAlign:'center', color: colors.textMuted, padding:'40px' }}>Chargement...</div>
          ) : stats && (
            <>
              <StatsGrid stats={[
                { icon:'👥', label:'Utilisateurs',   value: stats.users,         color: colors.info },
                { icon:'🏢', label:'Organisations',  value: stats.organizations, color: colors.success },
                { icon:'📁', label:'Projets',        value: stats.projects,      color: colors.warning },
                { icon:'🛒', label:'Listings',       value: stats.listings,      color: colors.primary },
              ]}/>
              <StatsGrid stats={[
                { icon:'📝', label:'Contrats',       value: stats.contracts,     color: colors.info },
                { icon:'💡', label:'Opportunites',   value: stats.opportunities, color: colors.success },
                { icon:'💳', label:'Paiements',      value: stats.payments,      color: colors.warning },
                { icon:'🛡️', label:'IPs bloquees',   value: security?.blacklistedIPs || 0, color: colors.danger },
              ]}/>

              <Card>
                <SectionTitle>Sante de la plateforme</SectionTitle>
                {[
                  { label:'API Backend',      status:'online',  value:'http://localhost:4080' },
                  { label:'Base de donnees',  status:'online',  value:'PostgreSQL 16' },
                  { label:'WebSocket',        status:'online',  value:'Socket.io' },
                  { label:'AI Assistant',     status:'online',  value:'Claude (Anthropic)' },
                  { label:'Stripe',           status:'demo',    value:'Mode demo' },
                  { label:'Security AI',      status:'online',  value:'Rate limiter + Fraud detection' },
                ].map((s,i) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid '+colors.border, fontSize:'13px' }}>
                    <span style={{ color: colors.textMuted }}>{s.label}</span>
                    <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                      <span style={{ color: colors.text }}>{s.value}</span>
                      <Badge color={s.status==='online'?'success':s.status==='demo'?'warning':'danger'}>
                        {s.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </Card>
            </>
          )}
        </>
      )}

      {/* Users Tab */}
      {tab === 'users' && (
        <Card>
          <SectionTitle>Utilisateurs ({users.length})</SectionTitle>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12px' }}>
              <thead>
                <tr style={{ borderBottom:'1px solid '+colors.border }}>
                  {['Email','Nom','Verifie','Actif','Derniere connexion','Inscrit'].map(h => (
                    <th key={h} style={{ padding:'8px 12px', textAlign:'left', color: colors.textMuted, fontWeight:'700', fontSize:'11px', textTransform:'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u,i) => (
                  <tr key={i} style={{ borderBottom:'1px solid '+colors.border }}>
                    <td style={{ padding:'10px 12px', color: colors.info }}>{u.email}</td>
                    <td style={{ padding:'10px 12px', color: colors.text }}>{u.firstName} {u.lastName}</td>
                    <td style={{ padding:'10px 12px' }}><Badge color={u.isVerified?'success':'warning'}>{u.isVerified?'Oui':'Non'}</Badge></td>
                    <td style={{ padding:'10px 12px' }}><Badge color={u.isActive?'success':'danger'}>{u.isActive?'Actif':'Inactif'}</Badge></td>
                    <td style={{ padding:'10px 12px', color: colors.textMuted }}>{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString('fr-FR') : 'Jamais'}</td>
                    <td style={{ padding:'10px 12px', color: colors.textMuted }}>{new Date(u.createdAt).toLocaleDateString('fr-FR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Security Tab */}
      {tab === 'security' && (
        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
          <StatsGrid stats={[
            { icon:'🚫', label:'IPs bloquees',    value: security?.blacklistedIPs || 0,  color: colors.danger },
            { icon:'⚠️', label:'IPs suspectes',   value: security?.suspiciousIPs || 0,   color: colors.warning },
            { icon:'📊', label:'Requetes actives', value: security?.activeRequests || 0,  color: colors.info },
            { icon:'🛡️', label:'Statut securite',  value: 'Actif',                        color: colors.success },
          ]}/>

          <Card>
            <SectionTitle color={colors.danger}>Bloquer une IP</SectionTitle>
            <div style={{ display:'flex', gap:'10px' }}>
              <input value={banIP} onChange={e => setBanIP(e.target.value)} placeholder="Ex: 192.168.1.1" style={{ flex:1, padding:'10px', background: colors.bg, border:'1px solid '+colors.border, borderRadius:'8px', color: colors.text, fontSize:'13px', outline:'none' }}/>
              <Button variant="danger" onClick={() => banIP && handleBan(banIP)}>🚫 Bloquer</Button>
            </div>
          </Card>

          <Card>
            <SectionTitle color={colors.danger}>IPs bloquees</SectionTitle>
            {security?.blacklist?.length === 0 ? (
              <div style={{ textAlign:'center', padding:'20px', color: colors.textMuted, fontSize:'13px' }}>
                Aucune IP bloquee — plateforme propre
              </div>
            ) : (
              security?.blacklist?.map((ip: string, i: number) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid '+colors.border }}>
                  <span style={{ color: colors.danger, fontFamily:'monospace', fontSize:'13px' }}>{ip}</span>
                  <Button size="sm" variant="success" onClick={() => handleUnban(ip)}>✅ Debloquer</Button>
                </div>
              ))
            )}
          </Card>

          <Card>
            <SectionTitle color={colors.warning}>Protection active</SectionTitle>
            {[
              { icon:'🛡️', label:'Rate Limiting',      desc:'200 req/min max par IP — auto-ban apres 5 violations', active:true },
              { icon:'🔍', label:'Fraud Detection',     desc:'Detection SQL injection, XSS, montants suspects', active:true },
              { icon:'🤖', label:'Bot Detection',       desc:'Blocage User-Agents suspects et comportements anormaux', active:true },
              { icon:'💳', label:'Payment Security',    desc:'Verification montants et patterns frauduleux', active:true },
              { icon:'🔐', label:'Auth Brute Force',    desc:'Blocage apres 5 tentatives echouees', active:true },
              { icon:'🌍', label:'Geo Blocking',        desc:'Blocage par pays (configurable)', active:false },
            ].map((p,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'10px 0', borderBottom:'1px solid '+colors.border }}>
                <span style={{ fontSize:'20px' }}>{p.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:'13px', fontWeight:'700', color: colors.text }}>{p.label}</div>
                  <div style={{ fontSize:'11px', color: colors.textMuted }}>{p.desc}</div>
                </div>
                <Badge color={p.active?'success':'default'}>{p.active?'Actif':'Inactif'}</Badge>
              </div>
            ))}
          </Card>
        </div>
      )}
    </PageLayout>
  )
}
