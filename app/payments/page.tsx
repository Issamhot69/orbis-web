'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4080'

const STATUS_CONFIG: any = {
  pending:    { label:'En attente',  color:'#f4c842', icon:'⏳' },
  processing: { label:'En cours',   color:'#1a6fff', icon:'🔄' },
  completed:  { label:'Complete',   color:'#00c896', icon:'✅' },
  failed:     { label:'Echoue',     color:'#ff6b6b', icon:'❌' },
  refunded:   { label:'Rembourse',  color:'#a78bfa', icon:'↩️' },
}

export default function PaymentsPage() {
  const router = useRouter()
  const [payments, setPayments] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('payments')
  const [showForm, setShowForm] = useState(false)
  const [orgs, setOrgs] = useState<any[]>([])
  const [form, setForm] = useState({ fromOrgId:'', toOrgId:'', amount:'', currency:'USD', method:'bank_transfer', description:'' })
  const [invoiceForm, setInvoiceForm] = useState({ fromOrgId:'', toOrgId:'', items:'[{"description":"Service ORBIS","quantity":1,"unitPrice":5000}]', notes:'' })
  const token = typeof window !== 'undefined' ? localStorage.getItem('orbis_token') : ''

  useEffect(() => {
    if (!token) { router.push('/'); return }
    fetchPayments()
    fetchInvoices()
    fetchOrgs()
  }, [])

  async function fetchPayments() {
    try {
      const res = await fetch(API + '/api/payments', { headers:{ Authorization:'Bearer '+token } })
      const data = await res.json()
      setPayments(data.payments || [])
    } catch(e) {} finally { setLoading(false) }
  }

  async function fetchInvoices() {
    try {
      const res = await fetch(API + '/api/payments/invoices', { headers:{ Authorization:'Bearer '+token } })
      const data = await res.json()
      setInvoices(data.invoices || [])
    } catch(e) {}
  }

  async function fetchOrgs() {
    try {
      const res = await fetch(API + '/api/organizations', { headers:{ Authorization:'Bearer '+token } })
      const data = await res.json()
      setOrgs(data.organizations || [])
    } catch(e) {}
  }

  function getOrgs() {
    return orgs.map((o: any) => ({ id: o.org?.id||o.id, name: o.org?.name||o.name }))
  }

  async function createPayment(e: any) {
    e.preventDefault()
    try {
      const res = await fetch(API + '/api/payments', {
        method:'POST',
        headers:{ 'Content-Type':'application/json', Authorization:'Bearer '+token },
        body: JSON.stringify({ ...form, amount: Number(form.amount) })
      })
      const data = await res.json()
      if (res.status >= 400) throw new Error(data.error)
      setPayments(prev => [data.payment, ...prev])
      setShowForm(false)
    } catch(err: any) { alert(err.message) }
  }

  async function createInvoice(e: any) {
    e.preventDefault()
    try {
      const items = JSON.parse(invoiceForm.items)
      const res = await fetch(API + '/api/payments/invoices', {
        method:'POST',
        headers:{ 'Content-Type':'application/json', Authorization:'Bearer '+token },
        body: JSON.stringify({ ...invoiceForm, items })
      })
      const data = await res.json()
      if (res.status >= 400) throw new Error(data.error)
      setInvoices(prev => [data.invoice, ...prev])
      setShowForm(false)
    } catch(err: any) { alert(err.message) }
  }

  async function updatePaymentStatus(id: string, status: string) {
    try {
      await fetch(API + '/api/payments/' + id + '/status', {
        method:'PATCH',
        headers:{ 'Content-Type':'application/json', Authorization:'Bearer '+token },
        body: JSON.stringify({ status })
      })
      setPayments(prev => prev.map(p => p.id === id ? {...p, status} : p))
    } catch(e) {}
  }

  const totalPaid    = payments.filter(p => p.status==='completed').reduce((s,p) => s+(Number(p.amount)||0), 0)
  const totalPending = payments.filter(p => p.status==='pending').reduce((s,p) => s+(Number(p.amount)||0), 0)

  return (
    <div style={{ minHeight:'100vh', background:'#060e1a', color:'#fff', fontFamily:'system-ui', padding:'24px' }}>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <button onClick={() => router.push('/dashboard')} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid #1e3a5f', borderRadius:'8px', padding:'8px 14px', color:'#4a6fa5', cursor:'pointer', fontSize:'12px' }}>← Dashboard</button>
          <div>
            <h1 style={{ margin:0, fontSize:'22px', fontWeight:'900' }}>💳 Paiements & Factures</h1>
            <p style={{ margin:0, fontSize:'12px', color:'#4a6fa5' }}>Gestion financiere ORBIS</p>
          </div>
        </div>
        <button onClick={() => setShowForm(true)} style={{ padding:'10px 20px', background:'#1a6fff', border:'none', borderRadius:'10px', color:'#fff', fontSize:'13px', fontWeight:'700', cursor:'pointer' }}>
          + {tab === 'payments' ? 'Nouveau paiement' : 'Nouvelle facture'}
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'14px', marginBottom:'24px' }}>
        {[
          { label:'Total paiements', value:payments.length,                    color:'#5b9fff', icon:'💳' },
          { label:'Montant recu',    value:'$'+totalPaid.toLocaleString(),      color:'#00c896', icon:'✅' },
          { label:'En attente',      value:'$'+totalPending.toLocaleString(),   color:'#f4c842', icon:'⏳' },
          { label:'Factures',        value:invoices.length,                     color:'#a78bfa', icon:'🧾' },
        ].map((s, i) => (
          <div key={i} style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'12px', padding:'16px' }}>
            <div style={{ fontSize:'20px', marginBottom:'8px' }}>{s.icon}</div>
            <div style={{ fontSize:'22px', fontWeight:'900', color:s.color }}>{s.value}</div>
            <div style={{ fontSize:'11px', color:'#4a6fa5', marginTop:'4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:'4px', background:'#0a1628', borderRadius:'10px', padding:'4px', marginBottom:'20px', width:'fit-content' }}>
        {[{id:'payments',label:'💳 Paiements'},{id:'invoices',label:'🧾 Factures'}].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding:'8px 20px', border:'none', borderRadius:'8px', background: tab===t.id?'#1e3a5f':'transparent', color: tab===t.id?'#fff':'#4a6fa5', fontSize:'13px', fontWeight: tab===t.id?'700':'400', cursor:'pointer' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Create Form */}
      {showForm && tab === 'payments' && (
        <div style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'14px', padding:'24px', marginBottom:'24px' }}>
          <h3 style={{ margin:'0 0 16px', color:'#5b9fff' }}>Nouveau paiement</h3>
          <form onSubmit={createPayment} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
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
              <label style={{ fontSize:'12px', color:'#4a6fa5' }}>Montant *</label>
              <input type="number" value={form.amount} onChange={e => setForm(f=>({...f,amount:e.target.value}))} required placeholder="Ex: 5000" style={{ padding:'10px', background:'#060e1a', border:'1px solid #1e3a5f', borderRadius:'8px', color:'#fff', fontSize:'13px', outline:'none' }}/>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
              <label style={{ fontSize:'12px', color:'#4a6fa5' }}>Methode</label>
              <select value={form.method} onChange={e => setForm(f=>({...f,method:e.target.value}))} style={{ padding:'10px', background:'#060e1a', border:'1px solid #1e3a5f', borderRadius:'8px', color:'#fff', fontSize:'13px', outline:'none' }}>
                <option value="bank_transfer">Virement bancaire</option>
                <option value="stripe">Stripe</option>
                <option value="crypto">Crypto</option>
                <option value="escrow">Escrow ORBIS</option>
              </select>
            </div>
            <div style={{ gridColumn:'span 2', display:'flex', flexDirection:'column', gap:'6px' }}>
              <label style={{ fontSize:'12px', color:'#4a6fa5' }}>Description</label>
              <input value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} placeholder="Description du paiement" style={{ padding:'10px', background:'#060e1a', border:'1px solid #1e3a5f', borderRadius:'8px', color:'#fff', fontSize:'13px', outline:'none' }}/>
            </div>
            <div style={{ gridColumn:'span 2', display:'flex', gap:'10px', justifyContent:'flex-end' }}>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding:'10px 20px', background:'transparent', border:'1px solid #1e3a5f', borderRadius:'8px', color:'#4a6fa5', cursor:'pointer', fontSize:'13px' }}>Annuler</button>
              <button type="submit" style={{ padding:'10px 20px', background:'#1a6fff', border:'none', borderRadius:'8px', color:'#fff', cursor:'pointer', fontSize:'13px', fontWeight:'700' }}>Creer</button>
            </div>
          </form>
        </div>
      )}

      {/* Payments List */}
      {tab === 'payments' && (
        loading ? <div style={{ textAlign:'center', color:'#4a6fa5', padding:'60px' }}>Chargement...</div> :
        payments.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px', background:'#0a1628', borderRadius:'14px', border:'1px solid #1e3a5f' }}>
            <div style={{ fontSize:'48px', marginBottom:'16px' }}>💳</div>
            <h2 style={{ color:'#5b9fff', margin:'0 0 8px' }}>Aucun paiement</h2>
            <p style={{ color:'#4a6fa5', fontSize:'13px' }}>Creez votre premier paiement ORBIS</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {payments.map((p: any, i) => {
              const cfg = STATUS_CONFIG[p.status] || STATUS_CONFIG.pending
              return (
                <div key={i} style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'12px', padding:'16px', display:'flex', alignItems:'center', gap:'16px' }}>
                  <div style={{ width:'44px', height:'44px', borderRadius:'12px', background:'rgba(26,111,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', flexShrink:0 }}>{cfg.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:'14px', fontWeight:'700', marginBottom:'2px' }}>{p.description || 'Paiement ORBIS'}</div>
                    <div style={{ fontSize:'11px', color:'#4a6fa5' }}>{p.method} • {new Date(p.createdAt).toLocaleDateString('fr-FR')}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:'18px', fontWeight:'900', color:'#00c896' }}>${Number(p.amount)?.toLocaleString()}</div>
                    <div style={{ fontSize:'10px', color:'#4a6fa5' }}>{p.currency}</div>
                  </div>
                  <select onChange={e => updatePaymentStatus(p.id, e.target.value)} value={p.status} style={{ padding:'6px 10px', background:'#060e1a', border:'1px solid '+cfg.color, borderRadius:'8px', color:cfg.color, fontSize:'11px', cursor:'pointer', fontWeight:'700' }}>
                    {Object.entries(STATUS_CONFIG).map(([k,v]: any) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>
              )
            })}
          </div>
        )
      )}

      {/* Invoices */}
      {tab === 'invoices' && (
        invoices.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px', background:'#0a1628', borderRadius:'14px', border:'1px solid #1e3a5f' }}>
            <div style={{ fontSize:'48px', marginBottom:'16px' }}>🧾</div>
            <h2 style={{ color:'#5b9fff', margin:'0 0 8px' }}>Aucune facture</h2>
            <p style={{ color:'#4a6fa5', fontSize:'13px' }}>Creez votre premiere facture ORBIS</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {invoices.map((inv: any, i) => (
              <div key={i} style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'12px', padding:'16px', display:'flex', alignItems:'center', gap:'16px' }}>
                <div style={{ width:'44px', height:'44px', borderRadius:'12px', background:'rgba(167,139,250,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px' }}>🧾</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:'14px', fontWeight:'700', marginBottom:'2px' }}>Facture #{inv.id?.slice(0,8)}</div>
                  <div style={{ fontSize:'11px', color:'#4a6fa5' }}>{inv.items?.length} article(s) • {new Date(inv.createdAt).toLocaleDateString('fr-FR')}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:'18px', fontWeight:'900', color:'#a78bfa' }}>${Number(inv.total)?.toLocaleString()}</div>
                  <div style={{ fontSize:'10px', color:'#4a6fa5' }}>{inv.status}</div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}
