'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

const API = 'http://localhost:4080'

export default function MessagesPage() {
  const router = useRouter()
  const [channels, setChannels] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [orgs, setOrgs] = useState<any[]>([])
  const [form, setForm] = useState({ name:'', orgId:'', type:'public' })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const token = typeof window !== 'undefined' ? localStorage.getItem('orbis_token') : ''
  const user  = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('orbis_user')||'{}') : {}

  useEffect(() => {
    if (!token) { router.push('/'); return }
    fetchChannels()
    fetchOrgs()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior:'smooth' })
  }, [messages])

  useEffect(() => {
    if (!selected) return
    fetchMessages(selected.id)
    const interval = setInterval(() => fetchMessages(selected.id), 3000)
    return () => clearInterval(interval)
  }, [selected])

  async function fetchChannels() {
    try {
      const res = await fetch(API + '/api/messaging/channels', { headers:{ Authorization:'Bearer '+token } })
      const data = await res.json()
      setChannels(data.channels || [])
      if (data.channels?.length > 0) setSelected(data.channels[0])
    } catch(e) {}
  }

  async function fetchOrgs() {
    try {
      const res = await fetch(API + '/api/organizations', { headers:{ Authorization:'Bearer '+token } })
      const data = await res.json()
      setOrgs(data.organizations || [])
    } catch(e) {}
  }

  async function fetchMessages(channelId: string) {
    try {
      const res = await fetch(API + '/api/messaging/channels/' + channelId + '/messages', { headers:{ Authorization:'Bearer '+token } })
      const data = await res.json()
      setMessages(data.messages || [])
    } catch(e) {}
  }

  async function sendMessage(e: any) {
    e.preventDefault()
    if (!input.trim() || !selected) return
    try {
      const res = await fetch(API + '/api/messaging/channels/' + selected.id + '/messages', {
        method:'POST',
        headers:{ 'Content-Type':'application/json', Authorization:'Bearer '+token },
        body: JSON.stringify({ content: input })
      })
      const data = await res.json()
      if (res.status >= 400) throw new Error(data.error)
      setMessages(prev => [...prev, data.message])
      setInput('')
    } catch(err: any) { alert(err.message) }
  }

  async function createChannel(e: any) {
    e.preventDefault()
    try {
      const res = await fetch(API + '/api/messaging/channels', {
        method:'POST',
        headers:{ 'Content-Type':'application/json', Authorization:'Bearer '+token },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (res.status >= 400) throw new Error(data.error)
      setChannels(prev => [...prev, data.channel])
      setSelected(data.channel)
      setShowForm(false)
      setForm({ name:'', orgId:'', type:'public' })
    } catch(err: any) { alert(err.message) }
  }

  return (
    <div style={{ minHeight:'100vh', background:'#060e1a', color:'#fff', fontFamily:'system-ui', display:'flex', flexDirection:'column' }}>

      {/* Header */}
      <div style={{ padding:'14px 24px', background:'#0a1628', borderBottom:'1px solid #1e3a5f', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <button onClick={() => router.push('/dashboard')} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid #1e3a5f', borderRadius:'8px', padding:'7px 12px', color:'#4a6fa5', cursor:'pointer', fontSize:'12px' }}>← Dashboard</button>
          <h1 style={{ margin:0, fontSize:'18px', fontWeight:'900' }}>💬 Messages ORBIS</h1>
        </div>
        <button onClick={() => setShowForm(true)} style={{ padding:'8px 16px', background:'#1a6fff', border:'none', borderRadius:'8px', color:'#fff', fontSize:'12px', fontWeight:'700', cursor:'pointer' }}>+ Nouveau canal</button>
      </div>

      <div style={{ display:'flex', flex:1, overflow:'hidden' }}>

        {/* Channels sidebar */}
        <div style={{ width:'260px', background:'#0a1628', borderRight:'1px solid #1e3a5f', display:'flex', flexDirection:'column', flexShrink:0 }}>
          {showForm && (
            <div style={{ padding:'14px', borderBottom:'1px solid #1e3a5f', background:'#0f1f3d' }}>
              <form onSubmit={createChannel} style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                <input value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} required placeholder="Nom du canal" style={{ padding:'8px', background:'#060e1a', border:'1px solid #1e3a5f', borderRadius:'6px', color:'#fff', fontSize:'12px', outline:'none' }}/>
                <select value={form.orgId} onChange={e => setForm(f=>({...f,orgId:e.target.value}))} style={{ padding:'8px', background:'#060e1a', border:'1px solid #1e3a5f', borderRadius:'6px', color:'#fff', fontSize:'12px', outline:'none' }}>
                  <option value="">Organisation...</option>
                  {orgs.map((o:any) => <option key={o.org?.id||o.id} value={o.org?.id||o.id}>{o.org?.name||o.name}</option>)}
                </select>
                <select value={form.type} onChange={e => setForm(f=>({...f,type:e.target.value}))} style={{ padding:'8px', background:'#060e1a', border:'1px solid #1e3a5f', borderRadius:'6px', color:'#fff', fontSize:'12px', outline:'none' }}>
                  <option value="public">Public</option>
                  <option value="private">Prive</option>
                </select>
                <div style={{ display:'flex', gap:'6px' }}>
                  <button type="button" onClick={() => setShowForm(false)} style={{ flex:1, padding:'7px', background:'transparent', border:'1px solid #1e3a5f', borderRadius:'6px', color:'#4a6fa5', cursor:'pointer', fontSize:'11px' }}>Annuler</button>
                  <button type="submit" style={{ flex:1, padding:'7px', background:'#1a6fff', border:'none', borderRadius:'6px', color:'#fff', cursor:'pointer', fontSize:'11px', fontWeight:'700' }}>Creer</button>
                </div>
              </form>
            </div>
          )}
          <div style={{ padding:'12px 8px', overflowY:'auto', flex:1 }}>
            <div style={{ fontSize:'10px', color:'#4a6fa5', fontWeight:'700', textTransform:'uppercase', letterSpacing:'1px', padding:'0 8px', marginBottom:'8px' }}>Canaux</div>
            {channels.length === 0 ? (
              <div style={{ textAlign:'center', color:'#2a4a7f', fontSize:'12px', padding:'20px' }}>Aucun canal — créez-en un !</div>
            ) : channels.map((c: any, i) => (
              <button key={i} onClick={() => setSelected(c)} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px', width:'100%', border:'none', borderRadius:'8px', background: selected?.id===c.id?'rgba(26,111,255,0.2)':'transparent', cursor:'pointer', textAlign:'left', marginBottom:'2px' }}>
                <div style={{ width:'32px', height:'32px', borderRadius:'8px', background:'rgba(26,111,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', flexShrink:0 }}>
                  {c.type==='private'?'🔒':'#'}
                </div>
                <div>
                  <div style={{ fontSize:'13px', fontWeight:'600', color: selected?.id===c.id?'#fff':'#c8d8f0' }}>{c.name}</div>
                  <div style={{ fontSize:'10px', color:'#4a6fa5' }}>{c.type}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Messages area */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
          {selected ? (
            <>
              <div style={{ padding:'12px 20px', background:'#0a1628', borderBottom:'1px solid #1e3a5f', display:'flex', alignItems:'center', gap:'10px' }}>
                <div style={{ width:'32px', height:'32px', borderRadius:'8px', background:'rgba(26,111,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px' }}>#</div>
                <div>
                  <div style={{ fontSize:'14px', fontWeight:'800' }}>{selected.name}</div>
                  <div style={{ fontSize:'11px', color:'#4a6fa5' }}>{selected.type} — {messages.length} messages</div>
                </div>
              </div>
              <div style={{ flex:1, overflowY:'auto', padding:'16px 20px', display:'flex', flexDirection:'column', gap:'12px' }}>
                {messages.length === 0 ? (
                  <div style={{ textAlign:'center', color:'#2a4a7f', padding:'40px', fontSize:'13px' }}>Aucun message — soyez le premier !</div>
                ) : messages.map((msg: any, i) => (
                  <div key={i} style={{ display:'flex', gap:'10px', alignItems:'flex-start' }}>
                    <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'linear-gradient(135deg,#1a6fff,#0a3d99)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:'900', color:'#fff', flexShrink:0 }}>
                      {msg.userId?.slice(0,2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'3px' }}>
                        <span style={{ fontSize:'13px', fontWeight:'700', color:'#5b9fff' }}>
                          {msg.userId === user.id ? 'Vous' : 'Membre'}
                        </span>
                        <span style={{ fontSize:'10px', color:'#2a4a7f' }}>
                          {new Date(msg.createdAt).toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      <div style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'4px 12px 12px 12px', padding:'10px 14px', fontSize:'13px', color:'#e8f0fe', lineHeight:'1.5', maxWidth:'600px' }}>
                        {msg.content}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef}/>
              </div>
              <form onSubmit={sendMessage} style={{ padding:'14px 20px', background:'#0a1628', borderTop:'1px solid #1e3a5f', display:'flex', gap:'10px' }}>
                <input value={input} onChange={e => setInput(e.target.value)} placeholder={'Message dans #' + selected.name + '...'} style={{ flex:1, padding:'12px 16px', background:'#060e1a', border:'1px solid #1e3a5f', borderRadius:'10px', color:'#fff', fontSize:'13px', outline:'none' }}/>
                <button type="submit" disabled={!input.trim()} style={{ width:'44px', height:'44px', borderRadius:'10px', background: input.trim()?'#1a6fff':'#1e3a5f', border:'none', color:'#fff', fontSize:'18px', cursor: input.trim()?'pointer':'not-allowed' }}>➤</button>
              </form>
            </>
          ) : (
            <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'16px' }}>
              <div style={{ fontSize:'48px' }}>💬</div>
              <div style={{ fontSize:'16px', fontWeight:'700', color:'#5b9fff' }}>Selectionnez un canal</div>
              <div style={{ fontSize:'13px', color:'#4a6fa5' }}>ou créez-en un nouveau</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
