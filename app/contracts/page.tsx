'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4080'

const STATUS_CONFIG: any = {
  draft:     { label:'Brouillon', color:'#4a6fa5', bg:'rgba(74,111,165,0.15)',  icon:'📝' },
  sent:      { label:'Envoye',    color:'#f4c842', bg:'rgba(244,200,66,0.15)',   icon:'📤' },
  signed:    { label:'Signe',     color:'#00c896', bg:'rgba(0,200,150,0.15)',    icon:'✅' },
  active:    { label:'Actif',     color:'#1a6fff', bg:'rgba(26,111,255,0.15)',   icon:'🟢' },
  completed: { label:'Complete',  color:'#a78bfa', bg:'rgba(167,139,250,0.15)', icon:'🏆' },
  cancelled: { label:'Annule',    color:'#ff6b6b', bg:'rgba(255,107,107,0.15)', icon:'❌' },
  disputed:  { label:'Litige',    color:'#ff6b6b', bg:'rgba(255,107,107,0.15)', icon:'⚠️' },
}

export default function ContractsPage() {
  const router = useRouter()
  const [contracts, setContracts] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [orgs, setOrgs] = useState<any[]>([])
  const [form, setForm] = useState({ title:'', fromOrgId:'', toOrgId:'', amount:'', currency:'USD', description:'' })
  const token = typeof window !== 'undefined' ? localStorage.getItem('orbis_token') : ''
  const user  = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('orbis_user') || '{}') : {}

  useEffect(() => {
    if (!token) { router.push('/'); return }
    fetchContracts()
    fetchOrgs()
  }, [])

  async function fetchContracts() {
    try {
      const res  = await fetch(API + '/api/contracts', { headers:{ Authorization:'Bearer '+token } })
      const data = await res.json()
      const list = (data.contracts || []).filter((c: any) => c && c.id && c.status)
      setContracts(list)
    } catch(e) {} finally { setLoading(false) }
  }

  async function fetchOrgs() {
    try {
      const res  = await fetch(API + '/api/organizations', { headers:{ Authorization:'Bearer '+token } })
      const data = await res.json()
      setOrgs(data.organizations || [])
    } catch(e) {}
  }

  async function createContract(e: any) {
    e.preventDefault()
    try {
      const res  = await fetch(API + '/api/contracts', {
        method:'POST',
        headers:{ 'Content-Type':'application/json', Authorization:'Bearer '+token },
        body: JSON.stringify({ ...form, amount: Number(form.amount) })
      })
      const data = await res.json()
      if (res.status >= 400) throw new Error(data.error)
      if (data.contract && data.contract.id) {
        setContracts(prev => [data.contract, ...prev])
      }
      setShowForm(false)
      setForm({ title:'', fromOrgId:'', toOrgId:'', amount:'', currency:'USD', description:'' })
    } catch(err: any) { alert(err.message) }
  }

  async function sendContract(contractId: string) {
    try {
      const res  = await fetch(API + '/api/contracts/' + contractId + '/send', {
        method:'PATCH', headers:{ Authorization:'Bearer '+token }
      })
      const data = await res.json()
      if (data.contract) {
        setContracts(prev => prev.map(c => c.id === contractId ? data.contract : c))
        setSelected(data.contract)
      }
    } catch(e) {}
  }

  async function signContract(contractId: string) {
    try {
      const orgId = orgs[0]?.org?.id || orgs[0]?.id
      const res   = await fetch(API + '/api/contracts/' + contractId + '/sign', {
        method:'POST',
        headers:{ 'Content-Type':'application/json', Authorization:'Bearer '+token },
        body: JSON.stringify({ orgId, signerName: (user.firstName||'') + ' ' + (user.lastName||'') })
      })
      const data = await res.json()
      if (data.contract) {
        setContracts(prev => prev.map(c => c.id === contractId ? data.contract : c))
        setSelected(data.contract)
      }
    } catch(e) {}
  }

  const validContracts = contracts.filter(c => c && c.status)
  const totalValue     = validContracts.reduce((s, c) => s + (Number(c.amount) || 0), 0)
  const signedValue    = validContracts.filter(c => c.status === 'signed' || c.status === 'active').reduce((s, c) => s + (Number(c.amount) || 0), 0)
  const pendingCount   = validContracts.filter(c => c.status === 'draft' || c.status === 'sent').length

  function getOrgs() {
    return orgs.map((o: any) => {
      const id   = o.org ? o.org.id   : o.id
      const name = o.org ? o.org.name : o.name
      return { id, name }
    })
  }

  return (
    <div style={{ minHeight:'100vh', background:'#060e1a', color:'#fff', fontFamily:'system-ui', padding:'24px' }}>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <button onClick={() => { setSelected(null); router.push('/dashboard') }} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid #1e3a5f', borderRadius:'8px', padding:'8px 14px', color:'#4a6fa5', cursor:'pointer', fontSize:'12px' }}>← Dashboard</button>
          <div>
            <h1 style={{ margin:0, fontSize:'22px', fontWeight:'900' }}>📝 {selected ? selected.title : 'Contrats'}</h1>
            <p style={{ margin:0, fontSize:'12px', color:'#4a6fa5' }}>{selected ? 'Detail du contrat' : 'Gestion des contrats ORBIS'}</p>
          </div>
        </div>
        <div style={{ display:'flex', gap:'10px' }}>
          {selected && <button onClick={() => setSelected(null)} style={{ padding:'10px 16px', background:'transparent', border:'1px solid #1e3a5f', borderRadius:'10px', color:'#4a6fa5', fontSize:'13px', cursor:'pointer' }}>← Contrats</button>}
          {!selected && <button onClick={() => setShowForm(!showForm)} style={{ padding:'10px 20px', background:'#1a6fff', border:'none', borderRadius:'10px', color:'#fff', fontSize:'13px', fontWeight:'700', cursor:'pointer' }}>+ Nouveau contrat</button>}
        </div>
      </div>

      {!selected ? (
        <>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'14px', marginBottom:'24px' }}>
            {[
              { label:'Total contrats',  value: validContracts.length,               color:'#5b9fff', icon:'📝' },
              { label:'Valeur totale',   value:'$'+totalValue.toLocaleString(),       color:'#f4c842', icon:'💰' },
              { label:'Valeur signee',   value:'$'+signedValue.toLocaleString(),      color:'#00c896', icon:'✅' },
              { label:'En attente',      value: pendingCount,                         color:'#a78bfa', icon:'⏳' },
            ].map((s, i) => (
              <div key={i} style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'12px', padding:'16px' }}>
                <div style={{ fontSize:'20px', marginBottom:'8px' }}>{s.icon}</div>
                <div style={{ fontSize:'22px', fontWeight:'900', color:s.color }}>{s.value}</div>
                <div style={{ fontSize:'11px', color:'#4a6fa5', marginTop:'4px' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {showForm && (
            <div style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'14px', padding:'24px', marginBottom:'24px' }}>
              <h3 style={{ margin:'0 0 16px', color:'#5b9fff' }}>Nouveau contrat</h3>
              <form onSubmit={createContract} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
                <div style={{ gridColumn:'span 2', display:'flex', flexDirection:'column', gap:'6px' }}>
                  <label style={{ fontSize:'12px', color:'#4a6fa5' }}>Titre *</label>
                  <input value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))} required placeholder="Ex: Contrat Partnership Dubai" style={{ padding:'10px', background:'#060e1a', border:'1px solid #1e3a5f', borderRadius:'8px', color:'#fff', fontSize:'13px', outline:'none' }}/>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                  <label style={{ fontSize:'12px', color:'#4a6fa5' }}>De</label>
                  <select value={form.fromOrgId} onChange={e => setForm(f=>({...f,fromOrgId:e.target.value}))} style={{ padding:'10px', background:'#060e1a', border:'1px solid #1e3a5f', borderRadius:'8px', color:'#fff', fontSize:'13px', outline:'none' }}>
                    <option value="">Selectionner...</option>
                    {getOrgs().map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </select>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                  <label style={{ fontSize:'12px', color:'#4a6fa5' }}>A</label>
                  <select value={form.toOrgId} onChange={e => setForm(f=>({...f,toOrgId:e.target.value}))} style={{ padding:'10px', background:'#060e1a', border:'1px solid #1e3a5f', borderRadius:'8px', color:'#fff', fontSize:'13px', outline:'none' }}>
                    <option value="">Selectionner...</option>
                    {getOrgs().map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </select>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                  <label style={{ fontSize:'12px', color:'#4a6fa5' }}>Montant (USD) *</label>
                  <input type="number" value={form.amount} onChange={e => setForm(f=>({...f,amount:e.target.value}))} required placeholder="Ex: 50000" style={{ padding:'10px', background:'#060e1a', border:'1px solid #1e3a5f', borderRadius:'8px', color:'#fff', fontSize:'13px', outline:'none' }}/>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                  <label style={{ fontSize:'12px', color:'#4a6fa5' }}>Description</label>
                  <input value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} placeholder="Description du contrat" style={{ padding:'10px', background:'#060e1a', border:'1px solid #1e3a5f', borderRadius:'8px', color:'#fff', fontSize:'13px', outline:'none' }}/>
                </div>
                <div style={{ gridColumn:'span 2', display:'flex', gap:'10px', justifyContent:'flex-end' }}>
                  <button type="button" onClick={() => setShowForm(false)} style={{ padding:'10px 20px', background:'transparent', border:'1px solid #1e3a5f', borderRadius:'8px', color:'#4a6fa5', cursor:'pointer', fontSize:'13px' }}>Annuler</button>
                  <button type="submit" style={{ padding:'10px 20px', background:'#1a6fff', border:'none', borderRadius:'8px', color:'#fff', cursor:'pointer', fontSize:'13px', fontWeight:'700' }}>Creer</button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <div style={{ textAlign:'center', color:'#4a6fa5', padding:'60px' }}>Chargement...</div>
          ) : validContracts.length === 0 ? (
            <div style={{ textAlign:'center', padding:'60px', background:'#0a1628', borderRadius:'14px', border:'1px solid #1e3a5f' }}>
              <div style={{ fontSize:'48px', marginBottom:'16px' }}>📝</div>
              <h2 style={{ color:'#5b9fff', margin:'0 0 8px' }}>Aucun contrat</h2>
              <p style={{ color:'#4a6fa5', fontSize:'13px' }}>Creez votre premier contrat ORBIS</p>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'16px' }}>
              {validContracts.map((c: any, i) => {
                const cfg = STATUS_CONFIG[c.status] || STATUS_CONFIG.draft
                return (
                  <div key={i} onClick={() => setSelected(c)} style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'14px', padding:'20px', cursor:'pointer' }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' }}>
                      <span style={{ fontSize:'20px' }}>{cfg.icon}</span>
                      <span style={{ padding:'3px 10px', background:cfg.bg, border:'1px solid '+cfg.color, borderRadius:'20px', fontSize:'10px', color:cfg.color, fontWeight:'700' }}>{cfg.label}</span>
                    </div>
                    <h3 style={{ margin:'0 0 6px', fontSize:'15px', fontWeight:'800' }}>{c.title}</h3>
                    <div style={{ fontSize:'22px', fontWeight:'900', color:'#00c896', marginBottom:'8px' }}>${Number(c.amount)?.toLocaleString()}</div>
                    <p style={{ margin:'0 0 12px', fontSize:'12px', color:'#4a6fa5' }}>{c.description || 'Pas de description'}</p>
                    <div style={{ borderTop:'1px solid #1e3a5f', paddingTop:'10px', fontSize:'11px', color:'#2a4a7f' }}>
                      {new Date(c.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:'20px' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
            <div style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'14px', padding:'24px' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px' }}>
                <span style={{ padding:'6px 14px', background:STATUS_CONFIG[selected.status]?.bg, border:'1px solid '+STATUS_CONFIG[selected.status]?.color, borderRadius:'20px', fontSize:'12px', color:STATUS_CONFIG[selected.status]?.color, fontWeight:'700' }}>
                  {STATUS_CONFIG[selected.status]?.icon} {STATUS_CONFIG[selected.status]?.label}
                </span>
                <div style={{ fontSize:'28px', fontWeight:'900', color:'#00c896' }}>${Number(selected.amount)?.toLocaleString()} {selected.currency}</div>
              </div>
              {selected.description && <p style={{ color:'#c8d8f0', fontSize:'14px', lineHeight:'1.7', background:'#060e1a', padding:'16px', borderRadius:'10px', border:'1px solid #1e3a5f' }}>{selected.description}</p>}
            </div>
            <div style={{ display:'flex', gap:'10px' }}>
              {selected.status === 'draft' && (
                <button onClick={() => sendContract(selected.id)} style={{ flex:1, padding:'12px', background:'rgba(244,200,66,0.15)', border:'1px solid #f4c842', borderRadius:'10px', color:'#f4c842', fontSize:'13px', fontWeight:'700', cursor:'pointer' }}>📤 Envoyer</button>
              )}
              {true && (
                <button onClick={() => signContract(selected.id)} style={{ flex:1, padding:'12px', background:'rgba(0,200,150,0.15)', border:'1px solid #00c896', borderRadius:'10px', color:'#00c896', fontSize:'13px', fontWeight:'700', cursor:'pointer' }}>✍️ Signer</button>
              )}
              <button style={{ flex:1, padding:'12px', background:'rgba(255,107,107,0.1)', border:'1px solid #ff6b6b', borderRadius:'10px', color:'#ff6b6b', fontSize:'13px', fontWeight:'700', cursor:'pointer' }}>⚠️ Litige</button>
            </div>
          </div>
          <div style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'14px', padding:'20px' }}>
            <div style={{ fontSize:'13px', fontWeight:'800', color:'#5b9fff', marginBottom:'16px' }}>Details</div>
            {[
              ['ID',         selected.id?.slice(0,8)+'...'],
              ['Montant',    '$'+Number(selected.amount)?.toLocaleString()+' '+selected.currency],
              ['Status',     STATUS_CONFIG[selected.status]?.label],
              ['Cree le',    new Date(selected.createdAt).toLocaleDateString('fr-FR')],
            ].map(([k,v]) => (
              <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #0f1f3d', fontSize:'12px' }}>
                <span style={{ color:'#4a6fa5' }}>{k}</span>
                <span style={{ color:'#fff', fontWeight:'600' }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop:'16px', padding:'12px', background:'rgba(0,200,150,0.08)', border:'1px solid rgba(0,200,150,0.2)', borderRadius:'8px', fontSize:'11px', color:'#00c896', textAlign:'center' }}>
              🔒 Securise par ORBIS Trust
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
