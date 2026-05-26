'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

const API = 'http://localhost:4080'

const SUGGESTIONS = [
  { icon:'💡', text:'Analyse mes opportunites business et donne-moi les 3 plus urgentes' },
  { icon:'🌍', text:'Quels marches devrais-je cibler en 2026 pour ORBIS ?' },
  { icon:'🤝', text:'Comment negocier un contrat B2B de 1 million USD ?' },
  { icon:'📊', text:'Analyse la concurrence LinkedIn vs ORBIS et nos avantages' },
  { icon:'🚀', text:'Donne-moi une strategie go-to-market pour le marche MENA' },
  { icon:'🧠', text:'Comment construire une memoire dentreprise qui dure 100 ans ?' },
  { icon:'💰', text:'Comment valoriser une startup B2B SaaS en phase pre-seed ?' },
  { icon:'🛰️', text:'Comment integrer le tracking satellite dans une supply chain mondiale ?' },
]

const ORBIS_MODES = [
  { id:'general',     icon:'🤖', label:'General',      desc:'Assistant business general' },
  { id:'analyst',     icon:'📊', label:'Analyste',     desc:'Analyse marche et donnees' },
  { id:'negotiator',  icon:'🤝', label:'Negociateur',  desc:'Strategie de negociation' },
  { id:'legal',       icon:'⚖️', label:'Legal',        desc:'Contrats et compliance' },
  { id:'investor',    icon:'💰', label:'Investisseur', desc:'Valorisation et pitch' },
  { id:'innovator',   icon:'🚀', label:'Innovateur',   desc:'Technologies futures 2040' },
]

export default function AIPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState('general')
  const [conversationId, setConversationId] = useState<string|null>(null)
  const [hasCredits, setHasCredits] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const token = typeof window !== 'undefined' ? localStorage.getItem('orbis_token') : ''
  const user  = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('orbis_user')||'{}') : {}

  useEffect(() => {
    if (!token) { router.push('/'); return }
    setMessages([{
      role:'assistant',
      content:'Bonjour ' + (user.firstName||'') + ' ! Je suis ORBIS AI — votre assistant business intelligent.\n\nJe peux vous aider a :\n• Analyser vos opportunites business\n• Negocier des contrats B2B\n• Identifier des marches mondiaux\n• Optimiser votre strategie\n• Explorer les technologies 2026-2040\n\nChoisissez un mode ou posez directement votre question.',
      time: new Date().toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'})
    }])
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior:'smooth' })
  }, [messages])

  async function sendMessage(text?: string) {
    const msg = text || input.trim()
    if (!msg || loading) return
    setInput('')
    setLoading(true)

    const userMsg = { role:'user', content:msg, time: new Date().toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'}) }
    setMessages(prev => [...prev, userMsg])

    try {
      const currentMode = ORBIS_MODES.find(m => m.id === mode)
      const res = await fetch(API + '/api/ai/chat', {
        method:'POST',
        headers:{ 'Content-Type':'application/json', Authorization:'Bearer '+token },
        body: JSON.stringify({
          message: msg,
          conversationId,
          context: { mode, modeLabel: currentMode?.label, platform:'ORBIS v2.0', user: user.firstName }
        })
      })
      const data = await res.json()

      if (data.error) {
        if (data.error.includes('credit') || data.error.includes('billing')) {
          setHasCredits(false)
          setMessages(prev => [...prev, {
            role:'assistant',
            content:'Credits Anthropic insuffisants. Rechargez sur console.anthropic.com pour activer ORBIS AI.',
            time: new Date().toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'}),
            isError: true
          }])
        } else {
          throw new Error(data.error)
        }
        return
      }

      if (data.conversation?.id) setConversationId(data.conversation.id)

      setMessages(prev => [...prev, {
        role:'assistant',
        content: data.message?.content || 'Reponse recue.',
        time: new Date().toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'}),
        tokens: data.usage
      }])
    } catch(err: any) {
      setMessages(prev => [...prev, {
        role:'assistant',
        content:'Erreur: ' + err.message,
        time: new Date().toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'}),
        isError: true
      }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  function handleKey(e: any) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  function clearChat() {
    setConversationId(null)
    setMessages([{
      role:'assistant',
      content:'Nouvelle conversation demarree. Comment puis-je vous aider ?',
      time: new Date().toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'})
    }])
  }

  return (
    <div style={{ minHeight:'100vh', background:'#060e1a', color:'#fff', fontFamily:'system-ui', display:'flex', flexDirection:'column' }}>

      {/* Header */}
      <div style={{ padding:'14px 24px', background:'#0a1628', borderBottom:'1px solid #1e3a5f', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <button onClick={() => router.push('/dashboard')} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid #1e3a5f', borderRadius:'8px', padding:'7px 12px', color:'#4a6fa5', cursor:'pointer', fontSize:'12px' }}>← Dashboard</button>
          <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'linear-gradient(135deg,#1a6fff,#6d28d9)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px' }}>🤖</div>
          <div>
            <div style={{ fontSize:'15px', fontWeight:'900' }}>ORBIS AI Assistant</div>
            <div style={{ fontSize:'11px', color:'#4a6fa5' }}>Propulse par Claude (Anthropic) — Mode: {ORBIS_MODES.find(m=>m.id===mode)?.label}</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
          <div style={{ padding:'5px 12px', background: hasCredits?'rgba(0,200,150,0.1)':'rgba(255,107,107,0.1)', border:'1px solid '+(hasCredits?'#00c896':'#ff6b6b'), borderRadius:'20px', fontSize:'11px', color: hasCredits?'#00c896':'#ff6b6b', fontWeight:'700' }}>
            {hasCredits ? '🟢 AI Active' : '🔴 Credits requis'}
          </div>
          <button onClick={clearChat} style={{ padding:'6px 12px', background:'rgba(255,255,255,0.05)', border:'1px solid #1e3a5f', borderRadius:'8px', color:'#4a6fa5', cursor:'pointer', fontSize:'11px' }}>
            Nouvelle conversation
          </button>
        </div>
      </div>

      <div style={{ display:'flex', flex:1, overflow:'hidden' }}>

        {/* Sidebar */}
        <div style={{ width:'220px', background:'#0a1628', borderRight:'1px solid #1e3a5f', padding:'16px', flexShrink:0, overflowY:'auto' }}>
          <div style={{ fontSize:'11px', color:'#4a6fa5', fontWeight:'700', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'10px' }}>Mode IA</div>
          {ORBIS_MODES.map(m => (
            <button key={m.id} onClick={() => setMode(m.id)} style={{ display:'flex', alignItems:'flex-start', gap:'8px', padding:'10px', width:'100%', border:'none', borderRadius:'8px', background: mode===m.id?'rgba(26,111,255,0.2)':'transparent', marginBottom:'4px', cursor:'pointer', textAlign:'left', borderLeft: mode===m.id?'2px solid #1a6fff':'2px solid transparent' }}>
              <span style={{ fontSize:'16px' }}>{m.icon}</span>
              <div>
                <div style={{ fontSize:'12px', fontWeight:'700', color: mode===m.id?'#fff':'#6a8aaa' }}>{m.label}</div>
                <div style={{ fontSize:'10px', color:'#4a6fa5', marginTop:'1px' }}>{m.desc}</div>
              </div>
            </button>
          ))}

          <div style={{ borderTop:'1px solid #1e3a5f', marginTop:'16px', paddingTop:'16px' }}>
            <div style={{ fontSize:'11px', color:'#4a6fa5', fontWeight:'700', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'10px' }}>Stats</div>
            {[
              ['Messages', messages.filter(m=>m.role==='user').length],
              ['Conversation', conversationId ? 'Active' : 'Nouvelle'],
            ].map(([k,v]) => (
              <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid #0f1f3d', fontSize:'11px' }}>
                <span style={{ color:'#4a6fa5' }}>{k}</span>
                <span style={{ color:'#5b9fff', fontWeight:'700' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>

          {/* Messages */}
          <div style={{ flex:1, overflowY:'auto', padding:'20px 24px' }}>

            {/* Suggestions — shown only at start */}
            {messages.length <= 1 && (
              <div style={{ marginBottom:'24px' }}>
                <div style={{ fontSize:'12px', color:'#4a6fa5', marginBottom:'12px', fontWeight:'700' }}>Questions suggérées :</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
                  {SUGGESTIONS.map((s, i) => (
                    <button key={i} onClick={() => sendMessage(s.text)} style={{ padding:'10px 12px', background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'10px', color:'#c8d8f0', fontSize:'12px', cursor:'pointer', textAlign:'left', display:'flex', alignItems:'flex-start', gap:'8px', lineHeight:'1.4' }}>
                      <span style={{ fontSize:'16px', flexShrink:0 }}>{s.icon}</span>
                      <span>{s.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} style={{ display:'flex', gap:'12px', marginBottom:'20px', flexDirection: msg.role==='user'?'row-reverse':'row' }}>
                <div style={{ width:'34px', height:'34px', borderRadius:'50%', background: msg.role==='user'?'linear-gradient(135deg,#1a6fff,#0a3d99)':'linear-gradient(135deg,#6d28d9,#1a6fff)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', fontWeight:'900', color:'#fff', flexShrink:0 }}>
                  {msg.role==='user' ? (user.firstName?.[0]||'U') : '🤖'}
                </div>
                <div style={{ maxWidth:'75%' }}>
                  <div style={{ background: msg.role==='user'?'#1a3a6f': msg.isError?'rgba(255,107,107,0.1)':'#0a1628', border:'1px solid '+(msg.role==='user'?'#1e4a8f':msg.isError?'#ff6b6b':'#1e3a5f'), borderRadius: msg.role==='user'?'14px 4px 14px 14px':'4px 14px 14px 14px', padding:'12px 16px' }}>
                    <div style={{ fontSize:'13px', color: msg.isError?'#ff6b6b':'#e8f0fe', lineHeight:'1.7', whiteSpace:'pre-wrap' }}>{msg.content}</div>
                  </div>
                  <div style={{ fontSize:'10px', color:'#2a4a7f', marginTop:'4px', textAlign: msg.role==='user'?'right':'left', display:'flex', gap:'8px', justifyContent: msg.role==='user'?'flex-end':'flex-start', alignItems:'center' }}>
                    <span>{msg.time}</span>
                    {msg.tokens && <span>· {msg.tokens.output_tokens} tokens</span>}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display:'flex', gap:'12px', marginBottom:'20px' }}>
                <div style={{ width:'34px', height:'34px', borderRadius:'50%', background:'linear-gradient(135deg,#6d28d9,#1a6fff)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px' }}>🤖</div>
                <div style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'4px 14px 14px 14px', padding:'14px 18px' }}>
                  <div style={{ display:'flex', gap:'4px', alignItems:'center' }}>
                    {[0,1,2].map(i => (
                      <div key={i} style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#1a6fff', animation:'pulse 1s ease-in-out infinite', animationDelay: i*0.2+'s' }}></div>
                    ))}
                    <span style={{ fontSize:'12px', color:'#4a6fa5', marginLeft:'6px' }}>ORBIS AI reflechit...</span>
                  </div>
                </div>
              </div>
            )}

            {!hasCredits && (
              <div style={{ background:'rgba(244,200,66,0.1)', border:'1px solid #f4c842', borderRadius:'12px', padding:'16px', marginBottom:'16px', textAlign:'center' }}>
                <div style={{ fontSize:'16px', marginBottom:'8px' }}>⚡</div>
                <div style={{ fontSize:'13px', fontWeight:'700', color:'#f4c842', marginBottom:'4px' }}>Credits Anthropic requis</div>
                <div style={{ fontSize:'12px', color:'#4a6fa5', marginBottom:'12px' }}>Rechargez votre compte pour activer ORBIS AI</div>
                <a href="https://console.anthropic.com/settings/billing" target="_blank" style={{ padding:'8px 20px', background:'#f4c842', border:'none', borderRadius:'8px', color:'#000', fontSize:'12px', fontWeight:'700', cursor:'pointer', textDecoration:'none' }}>
                  Recharger les credits →
                </a>
              </div>
            )}

            <div ref={messagesEndRef}/>
          </div>

          {/* Input */}
          <div style={{ padding:'16px 24px', background:'#0a1628', borderTop:'1px solid #1e3a5f', flexShrink:0 }}>
            <div style={{ display:'flex', gap:'10px', alignItems:'flex-end' }}>
              <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey} placeholder={'Posez votre question a ORBIS AI — Mode ' + ORBIS_MODES.find(m=>m.id===mode)?.label + '...'} rows={2} style={{ flex:1, padding:'12px 16px', background:'#060e1a', border:'1px solid #1e3a5f', borderRadius:'12px', color:'#fff', fontSize:'13px', outline:'none', resize:'none', lineHeight:'1.5', fontFamily:'system-ui' }}/>
              <button onClick={() => sendMessage()} disabled={loading || !input.trim()} style={{ width:'46px', height:'46px', borderRadius:'12px', background: input.trim()&&!loading?'#1a6fff':'#1e3a5f', border:'none', color:'#fff', fontSize:'18px', cursor: input.trim()&&!loading?'pointer':'not-allowed', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                {loading ? '⏳' : '➤'}
              </button>
            </div>
            <div style={{ fontSize:'10px', color:'#2a4a7f', marginTop:'6px', textAlign:'center' }}>
              Shift+Enter pour nouvelle ligne • Enter pour envoyer • ORBIS AI — Claude Sonnet
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
