'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4080'

const TYPES = [
  { id:'decision',  label:'Decision',  icon:'🎯', color:'#1a6fff' },
  { id:'lesson',    label:'Lecon',     icon:'📚', color:'#00c896' },
  { id:'process',   label:'Processus', icon:'⚙️', color:'#a78bfa' },
  { id:'contact',   label:'Contact',   icon:'👤', color:'#f4c842' },
  { id:'deal',      label:'Deal',      icon:'🤝', color:'#ff6b6b' },
  { id:'note',      label:'Note',      icon:'📝', color:'#4a6fa5' },
]

export default function MemoryPage() {
  const router = useRouter()
  const [memories, setMemories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('')
  const [orgs, setOrgs] = useState<any[]>([])
  const [form, setForm] = useState({ title:'', content:'', orgId:'', type:'note', tags:'', source:'manual' })
  const token = typeof window !== 'undefined' ? localStorage.getItem('orbis_token') : ''

  useEffect(() => {
    if (!token) { router.push('/'); return }
    fetchMemories()
    fetchOrgs()
  }, [])

  async function fetchMemories(q='', type='') {
    try {
      let url = API + '/api/memory?'
      if (q)    url += 'search=' + q + '&'
      if (type) url += 'type=' + type
      const res  = await fetch(url, { headers:{ Authorization:'Bearer '+token } })
      const data = await res.json()
      setMemories(data.memories || [])
    } catch(e) {} finally { setLoading(false) }
  }

  async function fetchOrgs() {
    try {
      const res  = await fetch(API + '/api/organizations', { headers:{ Authorization:'Bearer '+token } })
      const data = await res.json()
      setOrgs(data.organizations || [])
    } catch(e) {}
  }

  async function createMemory(e: any) {
    e.preventDefault()
    try {
      const body = {
        ...form,
        tags: form.tags.split(',').map((t:string) => t.trim()).filter(Boolean),
        orgId: form.orgId || (orgs[0]?.org?.id || orgs[0]?.id)
      }
      const res  = await fetch(API + '/api/memory', {
        method:'POST',
        headers:{ 'Content-Type':'application/json', Authorization:'Bearer '+token },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (res.status >= 400) throw new Error(data.error)
      setMemories(prev => [data.memory, ...prev])
      setShowForm(false)
      setForm({ title:'', content:'', orgId:'', type:'note', tags:'', source:'manual' })
    } catch(err: any) { alert(err.message) }
  }

  async function deleteMemory(id: string) {
    try {
      await fetch(API + '/api/memory/' + id, { method:'DELETE', headers:{ Authorization:'Bearer '+token } })
      setMemories(prev => prev.filter(m => m.id !== id))
    } catch(e) {}
  }

  function handleSearch(q: string) {
    setSearch(q)
    fetchMemories(q, filterType)
  }

  function handleFilter(type: string) {
    const t = type === filterType ? '' : type
    setFilterType(t)
    fetchMemories(search, t)
  }

  function getOrgs() {
    return orgs.map((o: any) => ({
      id:   o.org ? o.org.id   : o.id,
      name: o.org ? o.org.name : o.name
    }))
  }

  return (
    <div style={{ minHeight:'100vh', background:'#060e1a', color:'#fff', fontFamily:'system-ui', padding:'24px' }}>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <button onClick={() => router.push('/dashboard')} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid #1e3a5f', borderRadius:'8px', padding:'8px 14px', color:'#4a6fa5', cursor:'pointer', fontSize:'12px' }}>← Dashboard</button>
          <div>
            <h1 style={{ margin:0, fontSize:'22px', fontWeight:'900' }}>🧠 Business Memory</h1>
            <p style={{ margin:0, fontSize:'12px', color:'#4a6fa5' }}>Memoire intelligente de votre entreprise</p>
          </div>
        </div>
        <button onClick={() => setShowForm(true)} style={{ padding:'10px 20px', background:'#1a6fff', border:'none', borderRadius:'10px', color:'#fff', fontSize:'13px', fontWeight:'700', cursor:'pointer' }}>+ Nouvelle memoire</button>
      </div>

      {/* Search */}
      <div style={{ display:'flex', gap:'10px', marginBottom:'16px' }}>
        <input value={search} onChange={e => handleSearch(e.target.value)} placeholder="Rechercher dans la memoire..." style={{ flex:1, padding:'12px 16px', background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'10px', color:'#fff', fontSize:'13px', outline:'none' }}/>
      </div>

      {/* Type filters */}
      <div style={{ display:'flex', gap:'8px', marginBottom:'24px', flexWrap:'wrap' }}>
        {TYPES.map(t => (
          <button key={t.id} onClick={() => handleFilter(t.id)} style={{ padding:'7px 14px', borderRadius:'20px', border:'1px solid '+(filterType===t.id?t.color:'#1e3a5f'), background: filterType===t.id?'rgba(26,111,255,0.15)':'transparent', color: filterType===t.id?t.color:'#4a6fa5', fontSize:'12px', cursor:'pointer', fontWeight: filterType===t.id?'700':'400', display:'flex', alignItems:'center', gap:'5px' }}>
            <span>{t.icon}</span><span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:'10px', marginBottom:'24px' }}>
        {TYPES.map(t => (
          <div key={t.id} style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'10px', padding:'12px', textAlign:'center' }}>
            <div style={{ fontSize:'18px', marginBottom:'4px' }}>{t.icon}</div>
            <div style={{ fontSize:'20px', fontWeight:'900', color:t.color }}>{memories.filter(m => m.type === t.id).length}</div>
            <div style={{ fontSize:'10px', color:'#4a6fa5', marginTop:'2px' }}>{t.label}</div>
          </div>
        ))}
      </div>

      {/* Create Form */}
      {showForm && (
        <div style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'14px', padding:'24px', marginBottom:'24px' }}>
          <h3 style={{ margin:'0 0 16px', color:'#5b9fff' }}>Nouvelle memoire</h3>
          <form onSubmit={createMemory} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
            <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
              <label style={{ fontSize:'12px', color:'#4a6fa5' }}>Titre *</label>
              <input value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))} required placeholder="Ex: Decision architecture backend" style={{ padding:'10px', background:'#060e1a', border:'1px solid #1e3a5f', borderRadius:'8px', color:'#fff', fontSize:'13px', outline:'none' }}/>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
              <label style={{ fontSize:'12px', color:'#4a6fa5' }}>Type</label>
              <select value={form.type} onChange={e => setForm(f=>({...f,type:e.target.value}))} style={{ padding:'10px', background:'#060e1a', border:'1px solid #1e3a5f', borderRadius:'8px', color:'#fff', fontSize:'13px', outline:'none' }}>
                {TYPES.map(t => <option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}
              </select>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
              <label style={{ fontSize:'12px', color:'#4a6fa5' }}>Source</label>
              <select value={form.source} onChange={e => setForm(f=>({...f,source:e.target.value}))} style={{ padding:'10px', background:'#060e1a', border:'1px solid #1e3a5f', borderRadius:'8px', color:'#fff', fontSize:'13px', outline:'none' }}>
                <option value="manual">Manuel</option>
                <option value="meeting">Reunion</option>
                <option value="project">Projet</option>
                <option value="ai">IA</option>
              </select>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
              <label style={{ fontSize:'12px', color:'#4a6fa5' }}>Tags (separes par virgule)</label>
              <input value={form.tags} onChange={e => setForm(f=>({...f,tags:e.target.value}))} placeholder="Ex: tech, backend, decision" style={{ padding:'10px', background:'#060e1a', border:'1px solid #1e3a5f', borderRadius:'8px', color:'#fff', fontSize:'13px', outline:'none' }}/>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
              <label style={{ fontSize:'12px', color:'#4a6fa5' }}>Organisation</label>
              <select value={form.orgId} onChange={e => setForm(f=>({...f,orgId:e.target.value}))} style={{ padding:'10px', background:'#060e1a', border:'1px solid #1e3a5f', borderRadius:'8px', color:'#fff', fontSize:'13px', outline:'none' }}>
                <option value="">Selectionner...</option>
                {getOrgs().map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            </div>
            <div style={{ gridColumn:'span 2', display:'flex', flexDirection:'column', gap:'6px' }}>
              <label style={{ fontSize:'12px', color:'#4a6fa5' }}>Contenu *</label>
              <textarea value={form.content} onChange={e => setForm(f=>({...f,content:e.target.value}))} required placeholder="Decrivez cette memoire en detail..." rows={4} style={{ padding:'10px', background:'#060e1a', border:'1px solid #1e3a5f', borderRadius:'8px', color:'#fff', fontSize:'13px', outline:'none', resize:'vertical', fontFamily:'system-ui' }}/>
            </div>
            <div style={{ gridColumn:'span 2', display:'flex', gap:'10px', justifyContent:'flex-end' }}>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding:'10px 20px', background:'transparent', border:'1px solid #1e3a5f', borderRadius:'8px', color:'#4a6fa5', cursor:'pointer', fontSize:'13px' }}>Annuler</button>
              <button type="submit" style={{ padding:'10px 20px', background:'#1a6fff', border:'none', borderRadius:'8px', color:'#fff', cursor:'pointer', fontSize:'13px', fontWeight:'700' }}>Sauvegarder</button>
            </div>
          </form>
        </div>
      )}

      {/* Memories Grid */}
      {loading ? (
        <div style={{ textAlign:'center', color:'#4a6fa5', padding:'60px' }}>Chargement...</div>
      ) : memories.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px', background:'#0a1628', borderRadius:'14px', border:'1px solid #1e3a5f' }}>
          <div style={{ fontSize:'48px', marginBottom:'16px' }}>🧠</div>
          <h2 style={{ color:'#5b9fff', margin:'0 0 8px' }}>Memoire vide</h2>
          <p style={{ color:'#4a6fa5', fontSize:'13px' }}>Commencez a enregistrer la memoire de votre entreprise</p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'16px' }}>
          {memories.map((m: any, i) => {
            const type = TYPES.find(t => t.id === m.type) || TYPES[5]
            return (
              <div key={i} style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'14px', padding:'20px', position:'relative' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                    <span style={{ fontSize:'20px' }}>{type.icon}</span>
                    <span style={{ padding:'3px 10px', background:'rgba(26,111,255,0.1)', border:'1px solid '+type.color+'44', borderRadius:'20px', fontSize:'10px', color:type.color, fontWeight:'700' }}>{type.label}</span>
                  </div>
                  <button onClick={() => deleteMemory(m.id)} style={{ background:'none', border:'none', color:'#2a4a7f', cursor:'pointer', fontSize:'14px', padding:'4px' }}>🗑️</button>
                </div>
                <h3 style={{ margin:'0 0 8px', fontSize:'14px', fontWeight:'800', color:'#fff' }}>{m.title}</h3>
                <p style={{ margin:'0 0 12px', fontSize:'12px', color:'#6a8aaa', lineHeight:'1.6' }}>{m.content?.slice(0,120)}...</p>
                {m.tags?.length > 0 && (
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'4px', marginBottom:'12px' }}>
                    {m.tags.map((tag: string, j: number) => (
                      <span key={j} style={{ padding:'2px 8px', background:'rgba(255,255,255,0.05)', border:'1px solid #1e3a5f', borderRadius:'10px', fontSize:'10px', color:'#4a6fa5' }}>#{tag}</span>
                    ))}
                  </div>
                )}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', borderTop:'1px solid #1e3a5f', paddingTop:'10px', fontSize:'11px', color:'#2a4a7f' }}>
                  <span>{m.source || 'manuel'}</span>
                  <span>{new Date(m.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
