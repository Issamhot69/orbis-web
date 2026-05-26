'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

const LANGS = [
  {code:'fr', flag:'🇫🇷', name:'Français'},
  {code:'en', flag:'🇬🇧', name:'English'},
  
  {code:'ru', flag:'🇷🇺', name:'Русский'},
  {code:'zh', flag:'🇨🇳', name:'中文'},
  {code:'ja', flag:'🇯🇵', name:'日本語'},
  {code:'es', flag:'🇪🇸', name:'Español'},
  {code:'de', flag:'🇩🇪', name:'Deutsch'},
  {code:'sv', flag:'🇸🇪', name:'Svenska'},
  {code:'no', flag:'🇳🇴', name:'Norsk'},
  {code:'pt', flag:'🇧🇷', name:'Português'},
  {code:'tr', flag:'🇹🇷', name:'Türkçe'},
]

const VOICE_MESSAGES = [
  { from:'John Doe', flag:'🇫🇷', lang:'fr', text:'Bonjour, je suis intéressé par votre offre de partenariat ORBIS.', duration:'0:08', time:'09:15' },
  { from:'Yuki Tanaka', flag:'🇯🇵', lang:'ja', text:'こんにちは、ORBIS のパートナーシップのご提案に興味があります。', duration:'0:06', time:'09:22' },
  
]

export default function VoicePage() {
  const router = useRouter()
  const [recording, setRecording] = useState(false)
  const [recorded, setRecorded] = useState(false)
  const [playing, setPlaying] = useState<string|null>(null)
  const [translating, setTranslating] = useState(false)
  const [translated, setTranslated] = useState(false)
  const [targetLang, setTargetLang] = useState('en')
  const [myLang, setMyLang] = useState('fr')
  const [messages, setMessages] = useState(VOICE_MESSAGES)
  const [recordingTime, setRecordingTime] = useState(0)
  const [waveform, setWaveform] = useState<number[]>([])
  const timerRef = useRef<any>(null)
  const waveRef = useRef<any>(null)
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('orbis_user')||'{}') : {}

  useEffect(() => {
    const token = localStorage.getItem('orbis_token')
    if (!token) { router.push('/'); return }
  }, [])

  function startRecording() {
    setRecording(true)
    setRecorded(false)
    setTranslated(false)
    setRecordingTime(0)
    timerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000)
    waveRef.current = setInterval(() => {
      setWaveform(prev => [...prev.slice(-30), Math.random() * 40 + 10])
    }, 100)
  }

  function stopRecording() {
    setRecording(false)
    setRecorded(true)
    clearInterval(timerRef.current)
    clearInterval(waveRef.current)
  }

  async function translateVoice() {
    setTranslating(true)
    await new Promise(r => setTimeout(r, 2000))
    setTranslating(false)
    setTranslated(true)
    const lang = LANGS.find(l => l.code === targetLang)
    const newMsg = {
      from: user.firstName + ' ' + user.lastName || 'Vous',
      flag: LANGS.find(l => l.code === myLang)?.flag || '🌍',
      lang: myLang,
      text: lang?.code === 'en' ? 'Hello, I am very interested in the ORBIS partnership proposal you sent.' :
            lang?.code === 'ar' ? 'مرحبا، أنا مهتم جداً بعرض الشراكة الذي أرسلته عبر ORBIS.' :
            lang?.code === 'zh' ? '您好，我对您通过ORBIS发送的合作提案非常感兴趣。' :
            lang?.code === 'ja' ? 'こんにちは、ORBISを通じて送っていただいたパートナーシップ提案に大変興味があります。' :
            lang?.code === 'ru' ? 'Здравствуйте, меня очень интересует предложение о партнерстве, которое вы отправили через ORBIS.' :
            lang?.code === 'es' ? 'Hola, estoy muy interesado en la propuesta de asociación que envió a través de ORBIS.' :
            lang?.code === 'de' ? 'Hallo, ich bin sehr interessiert an dem Partnerschaftsvorschlag, den Sie über ORBIS gesendet haben.' :
            'Bonjour, je suis très intéressé par la proposition de partenariat que vous avez envoyée via ORBIS.',
      duration: '0:' + String(recordingTime).padStart(2,'0'),
      time: new Date().toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'})
    }
    setMessages(prev => [newMsg, ...prev])
  }

  function formatTime(s: number) {
    return Math.floor(s/60) + ':' + String(s%60).padStart(2,'0')
  }

  return (
    <div style={{ minHeight:'100vh', background:'#060e1a', color:'#fff', fontFamily:'system-ui', padding:'24px' }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <button onClick={() => router.push('/dashboard')} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid #1e3a5f', borderRadius:'8px', padding:'8px 14px', color:'#4a6fa5', cursor:'pointer', fontSize:'12px' }}>← Dashboard</button>
          <div>
            <h1 style={{ margin:0, fontSize:'22px', fontWeight:'900' }}>🎙️ Voice Clone AI</h1>
            <p style={{ margin:0, fontSize:'12px', color:'#4a6fa5' }}>Ta voix. Toutes les langues. En temps réel.</p>
          </div>
        </div>
        <div style={{ display:'flex', gap:'8px' }}>
          <div style={{ padding:'6px 14px', background:'rgba(178,34,52,0.15)', border:'1px solid #B22234', borderRadius:'20px', fontSize:'12px', color:'#B22234', fontWeight:'700' }}>
            🔴 Voice AI — Live
          </div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' }}>

        {/* Left — Recorder */}
        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>

          {/* Voice Settings */}
          <div style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'14px', padding:'20px' }}>
            <div style={{ fontSize:'13px', fontWeight:'800', color:'#5b9fff', marginBottom:'16px' }}>Paramètres vocaux</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'16px' }}>
              <div>
                <label style={{ fontSize:'11px', color:'#4a6fa5', display:'block', marginBottom:'6px' }}>Ma langue</label>
                <select value={myLang} onChange={e => setMyLang(e.target.value)} style={{ width:'100%', padding:'8px', background:'#060e1a', border:'1px solid #1e3a5f', borderRadius:'8px', color:'#fff', fontSize:'12px', outline:'none' }}>
                  {LANGS.map(l => <option key={l.code} value={l.code}>{l.flag} {l.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize:'11px', color:'#4a6fa5', display:'block', marginBottom:'6px' }}>Traduire vers</label>
                <select value={targetLang} onChange={e => setTargetLang(e.target.value)} style={{ width:'100%', padding:'8px', background:'#060e1a', border:'1px solid #1e3a5f', borderRadius:'8px', color:'#fff', fontSize:'12px', outline:'none' }}>
                  {LANGS.map(l => <option key={l.code} value={l.code}>{l.flag} {l.name}</option>)}
                </select>
              </div>
            </div>
            <div style={{ background:'#060e1a', borderRadius:'10px', padding:'12px', border:'1px solid #1e3a5f', display:'flex', alignItems:'center', gap:'10px' }}>
              <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:'linear-gradient(135deg,#B22234,#7a0f1e)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', fontWeight:'800', color:'#fff' }}>
                {user.firstName?.[0]||'U'}{user.lastName?.[0]||''}
              </div>
              <div>
                <div style={{ fontSize:'12px', fontWeight:'700' }}>{user.firstName} {user.lastName}</div>
                <div style={{ fontSize:'10px', color:'#4a6fa5' }}>Clone vocal activé — {LANGS.find(l=>l.code===myLang)?.flag} {LANGS.find(l=>l.code===myLang)?.name}</div>
              </div>
              <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'4px' }}>
                <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#00c896' }}></div>
                <span style={{ fontSize:'10px', color:'#00c896' }}>Prêt</span>
              </div>
            </div>
          </div>

          {/* Recorder */}
          <div style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'14px', padding:'24px', textAlign:'center' }}>
            <div style={{ fontSize:'13px', fontWeight:'800', color:'#5b9fff', marginBottom:'20px' }}>Enregistrer un message vocal</div>

            {/* Waveform */}
            <div style={{ height:'60px', background:'#060e1a', borderRadius:'8px', border:'1px solid #1e3a5f', marginBottom:'20px', display:'flex', alignItems:'center', justifyContent:'center', gap:'2px', padding:'0 10px', overflow:'hidden' }}>
              {recording ? (
                waveform.map((h, i) => (
                  <div key={i} style={{ width:'3px', height:h+'px', background:'#B22234', borderRadius:'2px', transition:'height 0.1s' }}></div>
                ))
              ) : recorded ? (
                [8,14,20,16,24,18,12,22,16,10,18,24,20,14,8,16,22,18,12,20,16,10,14,18,22,16,12,8,16,20].map((h,i) => (
                  <div key={i} style={{ width:'3px', height:h+'px', background:'#5b9fff', borderRadius:'2px' }}></div>
                ))
              ) : (
                <span style={{ fontSize:'12px', color:'#2a4a7f' }}>Appuyez pour enregistrer</span>
              )}
            </div>

            {recording && (
              <div style={{ fontSize:'24px', fontWeight:'900', color:'#B22234', marginBottom:'12px' }}>
                {formatTime(recordingTime)}
              </div>
            )}

            {/* Record button */}
            <button
              onClick={() => recording ? stopRecording() : startRecording()}
              style={{ width:'72px', height:'72px', borderRadius:'50%', border:'none', background: recording ? '#B22234' : 'rgba(178,34,52,0.2)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:'28px', boxShadow: recording ? '0 0 0 8px rgba(178,34,52,0.2)' : 'none', transition:'all 0.2s' }}>
              {recording ? '⏹' : '🎙️'}
            </button>

            <div style={{ fontSize:'12px', color:'#4a6fa5', marginBottom:'16px' }}>
              {recording ? 'Enregistrement en cours...' : recorded ? 'Message enregistré ✓' : 'Appuyer pour parler'}
            </div>

            {recorded && !translated && (
              <button onClick={translateVoice} disabled={translating} style={{ width:'100%', padding:'12px', background: translating ? '#1e3a5f' : '#B22234', border:'none', borderRadius:'10px', color:'#fff', fontSize:'13px', fontWeight:'700', cursor: translating ? 'not-allowed' : 'pointer' }}>
                {translating ? '⏳ Clonage vocal en cours...' : `🎙️ Cloner ma voix en ${LANGS.find(l=>l.code===targetLang)?.name}`}
              </button>
            )}

            {translated && (
              <div style={{ background:'rgba(0,200,150,0.1)', border:'1px solid #00c896', borderRadius:'10px', padding:'12px', fontSize:'12px', color:'#00c896' }}>
                ✅ Message cloné et envoyé en {LANGS.find(l=>l.code===targetLang)?.flag} {LANGS.find(l=>l.code===targetLang)?.name}
              </div>
            )}
          </div>

          {/* Features */}
          <div style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'14px', padding:'20px' }}>
            <div style={{ fontSize:'13px', fontWeight:'800', color:'#5b9fff', marginBottom:'14px' }}>Capacités Voice Clone AI</div>
            {[
              ['🎙️', 'Clone vocal parfait', 'Ta voix dans toutes les langues'],
              ['🌍', '12 langues supportées', 'Traduction instantanée < 0.5s'],
              ['🔒', 'Voix sécurisée', 'Chiffrement end-to-end'],
              ['🤖', 'Emotion preservée', 'Ton et intonation conservés'],
              ['📱', 'Multi-device', 'Mobile, desktop, conférence'],
            ].map(([icon, title, desc], i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'8px 0', borderBottom:'1px solid #0f1f3d' }}>
                <span style={{ fontSize:'18px' }}>{icon}</span>
                <div>
                  <div style={{ fontSize:'12px', fontWeight:'700', color:'#fff' }}>{title}</div>
                  <div style={{ fontSize:'10px', color:'#4a6fa5' }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Voice Messages */}
        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
          <div style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'14px', padding:'20px', flex:1 }}>
            <div style={{ fontSize:'13px', fontWeight:'800', color:'#5b9fff', marginBottom:'16px' }}>Messages vocaux clonés</div>
            {messages.map((msg, i) => (
              <div key={i} style={{ background:'#060e1a', border:'1px solid #1e3a5f', borderRadius:'12px', padding:'14px', marginBottom:'10px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px' }}>
                  <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:'linear-gradient(135deg,#B22234,#3C3B6E)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', fontWeight:'800', color:'#fff' }}>
                    {msg.flag}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:'13px', fontWeight:'700' }}>{msg.from}</div>
                    <div style={{ fontSize:'10px', color:'#4a6fa5' }}>Clone vocal • {msg.time}</div>
                  </div>
                  <div style={{ fontSize:'11px', color:'#4a6fa5' }}>{msg.duration}</div>
                </div>

                {/* Fake audio player */}
                <div style={{ background:'#0a1628', borderRadius:'8px', padding:'10px', display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
                  <button onClick={() => setPlaying(playing === msg.from+i ? null : msg.from+i)} style={{ width:'32px', height:'32px', borderRadius:'50%', background:'#B22234', border:'none', color:'#fff', cursor:'pointer', fontSize:'14px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    {playing === msg.from+i ? '⏸' : '▶'}
                  </button>
                  <div style={{ flex:1 }}>
                    <div style={{ height:'4px', background:'#1e3a5f', borderRadius:'2px', position:'relative' }}>
                      <div style={{ width: playing === msg.from+i ? '45%' : '0%', height:'100%', background:'#B22234', borderRadius:'2px', transition:'width 0.5s' }}></div>
                    </div>
                  </div>
                  <span style={{ fontSize:'10px', color:'#4a6fa5' }}>{msg.duration}</span>
                </div>

                <div style={{ fontSize:'11px', color:'#6a8aaa', fontStyle:'italic', lineHeight:'1.5' }}>
                  "{msg.text}"
                </div>

                <div style={{ display:'flex', gap:'6px', marginTop:'8px' }}>
                  <span style={{ padding:'2px 8px', background:'rgba(178,34,52,0.1)', border:'1px solid #B22234', borderRadius:'10px', fontSize:'10px', color:'#B22234' }}>🎙️ Voix clonée</span>
                  <span style={{ padding:'2px 8px', background:'rgba(60,59,110,0.1)', border:'1px solid #3C3B6E', borderRadius:'10px', fontSize:'10px', color:'#8888cc' }}>🌍 Traduit</span>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'14px', padding:'20px' }}>
            <div style={{ fontSize:'13px', fontWeight:'800', color:'#5b9fff', marginBottom:'14px' }}>Statistiques vocales</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
              {[
                { icon:'🎙️', label:'Messages clonés', value:'127' },
                { icon:'🌍', label:'Langues utilisées', value:'8' },
                { icon:'⚡', label:'Latence moyenne', value:'0.3s' },
                { icon:'✅', label:'Taux de précision', value:'98.7%' },
              ].map((s, i) => (
                <div key={i} style={{ background:'#060e1a', border:'1px solid #1e3a5f', borderRadius:'10px', padding:'12px', textAlign:'center' }}>
                  <div style={{ fontSize:'18px', marginBottom:'4px' }}>{s.icon}</div>
                  <div style={{ fontSize:'18px', fontWeight:'900', color:'#B22234' }}>{s.value}</div>
                  <div style={{ fontSize:'10px', color:'#4a6fa5', marginTop:'2px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
