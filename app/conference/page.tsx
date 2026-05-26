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

const MESSAGES: any[] = [
  {who:'John Doe 🇫🇷', fr:'Notre vision est de connecter 1 milliard dentreprises mondiales.', en:'Our vision is to connect 1 billion businesses worldwide.', ar:'رؤيتنا هي ربط مليار شركة عالمية.', zh:'我们的愿景是连接全球10亿家企业。', ja:'私たちのビジョンは世界中の10億の企業を繋ぐことです。', ru:'Наша цель — соединить миллиард компаний по всему миру.', es:'Nuestra visión es conectar mil millones de empresas mundiales.', de:'Unsere Vision ist es, eine Milliarde Unternehmen weltweit zu verbinden.', sv:'Vår vision är att koppla samman en miljard företag världen över.', no:'Vår visjon er å koble sammen en milliard bedrifter globalt.', pt:'Nossa visão é conectar 1 bilhão de empresas no mundo.', tr:'Vizyonumuz dünya genelinde 1 milyar işletmeyi birbirine bağlamaktır.'},
  {who:'ORBIS AI Consultant 🤖', fr:'Analyse en cours — Je detecte une opportunite de marche de 50 milliards USD dans le secteur B2B MENA.', en:'Analysis running — I detect a 50 billion USD market opportunity in B2B MENA sector.', ar:'جاري التحليل — أكتشف فرصة سوق بقيمة 50 مليار دولار في قطاع B2B MENA.', zh:'分析中 — 我在B2B MENA领域发现了500亿美元的市场机会。', ja:'分析中 — B2B MENAセクターで500億ドルの市場機会を検出しました。', ru:'Анализ выполняется — обнаружена рыночная возможность в 50 млрд долл. в секторе B2B MENA.', es:'Análisis en curso — Detecto una oportunidad de mercado de 50 mil millones USD en el sector B2B MENA.', de:'Analyse läuft — Ich erkenne eine Marktchance von 50 Milliarden USD im B2B MENA-Sektor.', sv:'Analys pågår — Jag upptäcker en marknadsmöjlighet på 50 miljarder USD i B2B MENA-sektorn.', no:'Analyse pågår — Jeg oppdager en markedsmulighet på 50 milliarder USD i B2B MENA-sektoren.', pt:'Análise em andamento — Detecto uma oportunidade de mercado de 50 bilhões USD no setor B2B MENA.', tr:'Analiz devam ediyor — B2B MENA sektöründe 50 milyar USD pazar fırsatı tespit ettim.'},
  {who:'Mohammed Al-Rashid 🇸🇦', fr:'Je suis pret a investir 10 millions USD dans ORBIS si on signe ce mois.', en:'I am ready to invest 10 million USD in ORBIS if we sign this month.', ar:'أنا مستعد للاستثمار 10 ملايين دولار في ORBIS إذا وقعنا هذا الشهر.', zh:'如果本月签约，我准备投资1000万美元到ORBIS。', ja:'今月署名すれば、ORBISに1000万ドルを投資する準備があります。', ru:'Я готов инвестировать 10 миллионов долларов в ORBIS, если подпишем в этом месяце.', es:'Estoy listo para invertir 10 millones USD en ORBIS si firmamos este mes.', de:'Ich bin bereit, 10 Millionen USD in ORBIS zu investieren, wenn wir diesen Monat unterzeichnen.', sv:'Jag är redo att investera 10 miljoner USD i ORBIS om vi skriver under denna månad.', no:'Jeg er klar til å investere 10 millioner USD i ORBIS hvis vi signerer denne måneden.', pt:'Estou pronto para investir 10 milhões USD na ORBIS se assinarmos este mês.', tr:'Bu ay imzalarsak ORBIS e 10 milyon USD yatırım yapmaya hazırım.'},
  {who:'Li Wei 🇨🇳', fr:'La Chine represente 400 millions de PME potentielles pour ORBIS.', en:'China represents 400 million potential SMEs for ORBIS.', ar:'تمثل الصين 400 مليون شركة صغيرة محتملة لـ ORBIS.', zh:'中国有4亿潜在中小企业可以加入ORBIS。', ja:'中国にはORBISの潜在的な中小企業が4億社あります。', ru:'Китай представляет 400 миллионов потенциальных МСП для ORBIS.', es:'China representa 400 millones de PYMEs potenciales para ORBIS.', de:'China repräsentiert 400 Millionen potenzielle KMUs für ORBIS.', sv:'Kina representerar 400 miljoner potentiella SMF för ORBIS.', no:'Kina representerer 400 millioner potensielle SMBer for ORBIS.', pt:'A China representa 400 milhões de PMEs potenciais para ORBIS.', tr:'Çin, ORBIS için 400 milyon potansiyel KOBİ temsil ediyor.'},
]

const PARTICIPANTS = [
  {initials:'JD', name:'John Doe', role:'CEO — Paris, France', flag:'🇫🇷', color:'#1a6fff'},
  {initials:'YT', name:'Yuki Tanaka', role:'CTO — Tokyo, Japan', flag:'🇯🇵', color:'#00c896'},
  {initials:'SA', name:'Sarah Anderson', role:'Investor — New York', flag:'🇺🇸', color:'#f4c842'},
  {initials:'LW', name:'Li Wei', role:'Directeur — Shanghai', flag:'🇨🇳', color:'#a78bfa'},
]

const AI_CONSULTANTS = [
  {initials:'AI', name:'ORBIS AI Analyst', role:'Analyse marche temps reel', color:'#00c896', badge:'IA'},
  {initials:'AI', name:'ORBIS Legal AI', role:'Contrats & Compliance', color:'#1a6fff', badge:'IA'},
  {initials:'AI', name:'ORBIS Finance AI', role:'Valorisation & ROI', color:'#f4c842', badge:'IA'},
]

const INVESTORS = [
  {initials:'SV', name:'Sarah Venture', role:'VC — Silicon Valley', flag:'🇺🇸', amount:'$50M', color:'#00c896'},
  {initials:'AK', name:'Ahmed Al-Khalifa', role:'Fund — Abu Dhabi', flag:'🇦🇪', amount:'$100M', color:'#f4c842'},
  {initials:'RB', name:'Robert Blackwood', role:'PE — London', flag:'🇬🇧', amount:'$200M', color:'#1a6fff'},
]

export default function ConferencePage() {
  const router = useRouter()
  const [selectedLang, setSelectedLang] = useState('fr')
  const [micOn, setMicOn] = useState(true)
  const [videoOn, setVideoOn] = useState(true)
  const [translationOn, setTranslationOn] = useState(true)
  const [transcript, setTranscript] = useState<any[]>([{ type:'system', text:'Conference ORBIS demarree — AI Translation active' }])
  const [time, setTime] = useState(0)
  const [speakingIdx, setSpeakingIdx] = useState(0)
  const [activeTab, setActiveTab] = useState('participants')
  const [uploads, setUploads] = useState<any[]>([])
  const [pitchMode, setPitchMode] = useState(false)
  const transcriptRef = useRef<HTMLDivElement>(null)
  const msgIdxRef = useRef(0)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const token = localStorage.getItem('orbis_token')
    if (!token) { router.push('/'); return }
    const timer = setInterval(() => setTime(t => t + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!translationOn) return
    const interval = setInterval(() => {
      const m = MESSAGES[msgIdxRef.current % MESSAGES.length]
      setSpeakingIdx(msgIdxRef.current % PARTICIPANTS.length)
      setTranscript(prev => [...prev, { type:'message', who:m.who, msg:(m as any)[selectedLang] || m.fr, isAI: m.who.includes('AI') }])
      msgIdxRef.current++
    }, 5000)
    return () => clearInterval(interval)
  }, [translationOn, selectedLang])

  useEffect(() => {
    if (transcriptRef.current) transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight
  }, [transcript])

  function addSystem(text: string) {
    setTranscript(prev => [...prev, { type:'system', text }])
  }

  function formatTime(s: number) {
    const m = Math.floor(s / 60).toString().padStart(2,'0')
    return '00:' + m + ':' + (s % 60).toString().padStart(2,'0')
  }

  function handleUpload(e: any) {
    const files = Array.from(e.target.files || [])
    files.forEach((f: any) => {
      const type = f.type.startsWith('video') ? 'video' : f.type.startsWith('image') ? 'image' : 'document'
      setUploads(prev => [...prev, { name:f.name, type, size:(f.size/1024).toFixed(0)+'KB', time: new Date().toLocaleTimeString() }])
      addSystem('Fichier partage : ' + f.name)
    })
  }

  const tabStyle = (t: string) => ({
    padding:'8px 14px', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'12px', fontWeight:'700' as const,
    background: activeTab === t ? 'rgba(26,111,255,0.3)' : 'transparent',
    color: activeTab === t ? '#5b9fff' : '#4a6fa5',
  })

  return (
    <div style={{ minHeight:'100vh', background:'#060e1a', fontFamily:'system-ui', color:'#fff', padding:'16px' }}>

      {/* Header */}
      <div style={{ background:'#0a1628', borderRadius:'14px', padding:'12px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'14px', border:'1px solid #1e3a5f' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <button onClick={() => router.push('/dashboard')} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid #1e3a5f', borderRadius:'8px', padding:'6px 12px', color:'#4a6fa5', cursor:'pointer', fontSize:'12px' }}>← Dashboard</button>
          <div style={{ width:'34px', height:'34px', borderRadius:'10px', background:'#1a6fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', fontWeight:'900' }}>◎</div>
          <div>
            <div style={{ fontSize:'14px', fontWeight:'800' }}>ORBIS Conference Room</div>
            <div style={{ fontSize:'11px', color:'#1a6fff' }}>Speech-to-Speech AI — 12 langues</div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <button onClick={() => { setPitchMode(!pitchMode); addSystem(pitchMode ? 'Mode Pitch desactive' : 'Mode Pitch Investisseur active') }} style={{ padding:'6px 14px', background: pitchMode ? 'rgba(244,200,66,0.2)' : 'rgba(255,255,255,0.05)', border: pitchMode ? '1px solid #f4c842' : '1px solid #1e3a5f', borderRadius:'20px', color: pitchMode ? '#f4c842' : '#4a6fa5', fontSize:'11px', fontWeight:'700', cursor:'pointer' }}>
            {pitchMode ? '🎯 Pitch Mode ON' : '🎯 Pitch Mode'}
          </button>
          <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
            <div style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#00c896' }}></div>
            <span style={{ fontSize:'12px', color:'#00c896', fontWeight:'700' }}>{PARTICIPANTS.length + AI_CONSULTANTS.length} participants</span>
          </div>
          <div style={{ padding:'5px 12px', background:'rgba(255,60,60,0.15)', border:'1px solid rgba(255,60,60,0.4)', borderRadius:'20px', fontSize:'11px', color:'#ff6b6b', fontWeight:'700' }}>
            REC {formatTime(time)}
          </div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 340px', gap:'14px' }}>

        {/* Col 1 : Video Grid */}
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', marginBottom:'12px' }}>
            {PARTICIPANTS.map((p, i) => (
              <div key={i} style={{ background:'#0d1a2e', borderRadius:'10px', padding:'12px', border: i === speakingIdx ? '2px solid '+p.color : '1px solid #1e3a5f', position:'relative' }}>
                <div style={{ position:'absolute', top:'8px', right:'8px', fontSize:'13px' }}>{p.flag}</div>
                {i === speakingIdx && <div style={{ position:'absolute', top:'8px', left:'8px', width:'6px', height:'6px', borderRadius:'50%', background:p.color }}></div>}
                <div style={{ display:'flex', justifyContent:'center', margin:'14px 0 8px' }}>
                  <div style={{ width:'48px', height:'48px', borderRadius:'50%', background:p.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', fontWeight:'900', color:'#000', border: i===speakingIdx ? '2px solid '+p.color : 'none' }}>{p.initials}</div>
                </div>
                <div style={{ textAlign:'center', fontSize:'12px', fontWeight:'700' }}>{p.name}</div>
                <div style={{ textAlign:'center', fontSize:'10px', color:'#4a6fa5', marginBottom:'8px' }}>{p.role}</div>
                <div style={{ background:'#060e1a', borderRadius:'6px', padding:'6px', border:'1px solid #1e3a5f', display:'flex', justifyContent:'center', gap:'2px', minHeight:'20px', alignItems:'center' }}>
                  {i === speakingIdx ? [1,2,3,4,5].map(b => <div key={b} style={{ width:'2px', background:p.color, borderRadius:'1px', height:b%2===0?'12px':'6px' }}></div>) : <div style={{ fontSize:'10px', color:'#2a4a7f' }}>...</div>}
                </div>
              </div>
            ))}
          </div>

          {/* Upload Zone */}
          <div style={{ background:'#0a1628', borderRadius:'10px', border:'1px dashed #1e3a5f', padding:'14px', marginBottom:'12px' }}>
            <div style={{ fontSize:'11px', color:'#4a6fa5', marginBottom:'10px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'1px' }}>Partager des fichiers</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px', marginBottom:'10px' }}>
              {[
                {icon:'📹', label:'Video', accept:'video/*'},
                {icon:'🖼️', label:'Photo', accept:'image/*'},
                {icon:'📄', label:'Document', accept:'.pdf,.doc,.docx,.ppt,.pptx'},
              ].map(btn => (
                <button key={btn.label} onClick={() => fileRef.current && fileRef.current.click()} style={{ padding:'10px', background:'rgba(26,111,255,0.1)', border:'1px solid #1e3a5f', borderRadius:'8px', color:'#5b9fff', cursor:'pointer', fontSize:'20px', display:'flex', flexDirection:'column', alignItems:'center', gap:'4px' }}>
                  <span>{btn.icon}</span>
                  <span style={{ fontSize:'10px', fontWeight:'700' }}>{btn.label}</span>
                </button>
              ))}
            </div>
            <input ref={fileRef} type="file" multiple accept="video/*,image/*,.pdf,.doc,.docx,.ppt,.pptx" onChange={handleUpload} style={{ display:'none' }}/>
            {uploads.length > 0 && (
              <div style={{ borderTop:'1px solid #1e3a5f', paddingTop:'8px' }}>
                {uploads.map((u, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'5px 0', fontSize:'11px' }}>
                    <span>{u.type==='video'?'📹':u.type==='image'?'🖼️':'📄'}</span>
                    <span style={{ color:'#c8d8f0', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{u.name}</span>
                    <span style={{ color:'#4a6fa5' }}>{u.size}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Controls */}
          <div style={{ background:'#0a1628', borderRadius:'10px', padding:'12px', border:'1px solid #1e3a5f', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'8px' }}>
            <div style={{ display:'flex', gap:'8px' }}>
              <button onClick={() => { setMicOn(!micOn); addSystem(micOn?'Micro coupe':'Micro active') }} style={{ width:'40px', height:'40px', borderRadius:'50%', background:micOn?'rgba(26,111,255,0.2)':'rgba(255,60,60,0.2)', border:micOn?'1px solid #1a6fff':'1px solid #ff6b6b', color:micOn?'#5b9fff':'#ff6b6b', fontSize:'16px', cursor:'pointer' }}>{micOn?'🎤':'🔇'}</button>
              <button onClick={() => { setVideoOn(!videoOn); addSystem(videoOn?'Camera coupee':'Camera activee') }} style={{ width:'40px', height:'40px', borderRadius:'50%', background:videoOn?'rgba(26,111,255,0.2)':'rgba(255,60,60,0.2)', border:videoOn?'1px solid #1a6fff':'1px solid #ff6b6b', color:videoOn?'#5b9fff':'#ff6b6b', fontSize:'16px', cursor:'pointer' }}>{videoOn?'📹':'📷'}</button>
              <button onClick={() => { setTranslationOn(!translationOn); addSystem(translationOn?'Traduction desactivee':'Traduction activee') }} style={{ padding:'0 12px', height:'40px', borderRadius:'20px', background:translationOn?'rgba(0,200,150,0.2)':'rgba(255,60,60,0.2)', border:translationOn?'1px solid #00c896':'1px solid #ff6b6b', color:translationOn?'#00c896':'#ff6b6b', fontSize:'11px', fontWeight:'700', cursor:'pointer' }}>
                {translationOn?'🌍 AI ON':'🌍 AI OFF'}
              </button>
            </div>
            <button onClick={() => router.push('/dashboard')} style={{ padding:'0 14px', height:'40px', borderRadius:'20px', background:'rgba(255,60,60,0.15)', border:'1px solid rgba(255,60,60,0.4)', color:'#ff6b6b', fontSize:'11px', fontWeight:'700', cursor:'pointer' }}>Quitter</button>
          </div>
        </div>

        {/* Col 2 : AI + Investors */}
        <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>

          {/* Tabs */}
          <div style={{ background:'#0a1628', borderRadius:'10px', border:'1px solid #1e3a5f', padding:'8px' }}>
            <div style={{ display:'flex', gap:'4px', marginBottom:'12px' }}>
              {['participants','ai','investors','langs'].map(t => (
                <button key={t} onClick={() => setActiveTab(t)} style={tabStyle(t)}>
                  {t==='participants'?'👥 Salle':t==='ai'?'🤖 AI':t==='investors'?'💰 Invest':'🌍 Langues'}
                </button>
              ))}
            </div>

            {activeTab === 'ai' && (
              <div>
                <div style={{ fontSize:'11px', color:'#4a6fa5', marginBottom:'10px', fontWeight:'700' }}>CONSULTANTS IA EN SALLE</div>
                {AI_CONSULTANTS.map((a, i) => (
                  <div key={i} style={{ background:'#060e1a', borderRadius:'8px', padding:'10px', marginBottom:'8px', border:'1px solid #1e3a5f', display:'flex', alignItems:'center', gap:'10px' }}>
                    <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:a.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px', fontWeight:'900', color:'#000', flexShrink:0 }}>AI</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:'12px', fontWeight:'700', color:'#fff' }}>{a.name}</div>
                      <div style={{ fontSize:'10px', color:'#4a6fa5' }}>{a.role}</div>
                    </div>
                    <button onClick={() => addSystem(a.name + ' consulte...')} style={{ padding:'4px 10px', background:'rgba(26,111,255,0.15)', border:'1px solid #1a6fff', borderRadius:'6px', color:'#5b9fff', fontSize:'10px', fontWeight:'700', cursor:'pointer' }}>Ask</button>
                  </div>
                ))}
                <button onClick={() => addSystem('Nouveau consultant IA ajoute')} style={{ width:'100%', padding:'8px', background:'rgba(26,111,255,0.08)', border:'1px dashed #1e3a5f', borderRadius:'8px', color:'#4a6fa5', fontSize:'11px', cursor:'pointer' }}>+ Ajouter consultant IA</button>
              </div>
            )}

            {activeTab === 'investors' && (
              <div>
                <div style={{ fontSize:'11px', color:'#4a6fa5', marginBottom:'10px', fontWeight:'700' }}>INVESTISSEURS CONNECTES</div>
                {INVESTORS.map((inv, i) => (
                  <div key={i} style={{ background:'#060e1a', borderRadius:'8px', padding:'10px', marginBottom:'8px', border:'1px solid #1e3a5f' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px' }}>
                      <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:inv.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:'900', color:'#000' }}>{inv.initials}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:'12px', fontWeight:'700' }}>{inv.flag} {inv.name}</div>
                        <div style={{ fontSize:'10px', color:'#4a6fa5' }}>{inv.role}</div>
                      </div>
                      <div style={{ fontSize:'13px', fontWeight:'900', color:'#f4c842' }}>{inv.amount}</div>
                    </div>
                    <div style={{ display:'flex', gap:'6px' }}>
                      <button onClick={() => addSystem('Pitch envoye a ' + inv.name)} style={{ flex:1, padding:'5px', background:'rgba(244,200,66,0.15)', border:'1px solid #f4c842', borderRadius:'6px', color:'#f4c842', fontSize:'10px', fontWeight:'700', cursor:'pointer' }}>Pitch</button>
                      <button onClick={() => addSystem('Message prive envoye a ' + inv.name)} style={{ flex:1, padding:'5px', background:'rgba(26,111,255,0.15)', border:'1px solid #1a6fff', borderRadius:'6px', color:'#5b9fff', fontSize:'10px', fontWeight:'700', cursor:'pointer' }}>Message</button>
                    </div>
                  </div>
                ))}
                <button onClick={() => addSystem('Invitation investisseur envoyee')} style={{ width:'100%', padding:'8px', background:'rgba(244,200,66,0.08)', border:'1px dashed #1e3a5f', borderRadius:'8px', color:'#4a6fa5', fontSize:'11px', cursor:'pointer' }}>+ Inviter investisseur</button>
              </div>
            )}

            {activeTab === 'participants' && (
              <div>
                <div style={{ fontSize:'11px', color:'#4a6fa5', marginBottom:'10px', fontWeight:'700' }}>PARTICIPANTS ACTIFS</div>
                {PARTICIPANTS.map((p, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'8px', background:'#060e1a', borderRadius:'8px', marginBottom:'6px', border: i===speakingIdx?'1px solid '+p.color:'1px solid #1e3a5f' }}>
                    <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:p.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:'900', color:'#000' }}>{p.initials}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:'12px', fontWeight:'700' }}>{p.flag} {p.name}</div>
                      <div style={{ fontSize:'10px', color:'#4a6fa5' }}>{p.role}</div>
                    </div>
                    {i===speakingIdx && <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:p.color }}></div>}
                  </div>
                ))}
                <button onClick={() => addSystem('Lien invitation genere')} style={{ width:'100%', padding:'8px', background:'rgba(0,200,150,0.08)', border:'1px dashed #1e3a5f', borderRadius:'8px', color:'#4a6fa5', fontSize:'11px', cursor:'pointer' }}>+ Inviter participant</button>
              </div>
            )}

            {activeTab === 'langs' && (
              <div>
                <div style={{ fontSize:'11px', color:'#4a6fa5', marginBottom:'10px', fontWeight:'700' }}>MA LANGUE</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                  {LANGS.map(l => (
                    <button key={l.code} onClick={() => { setSelectedLang(l.code); addSystem('Langue: '+l.flag+' '+l.name) }} style={{ padding:'5px 10px', borderRadius:'20px', fontSize:'11px', cursor:'pointer', display:'flex', alignItems:'center', gap:'4px', background:selectedLang===l.code?'rgba(26,111,255,0.3)':'rgba(255,255,255,0.05)', border:selectedLang===l.code?'1px solid #1a6fff':'1px solid #1e3a5f', color:selectedLang===l.code?'#5b9fff':'#4a6fa5', fontWeight:selectedLang===l.code?'700':'400' }}>
                      <span>{l.flag}</span><span>{l.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pitch Mode Panel */}
          {pitchMode && (
            <div style={{ background:'rgba(244,200,66,0.08)', borderRadius:'10px', border:'1px solid #f4c842', padding:'14px' }}>
              <div style={{ fontSize:'12px', fontWeight:'800', color:'#f4c842', marginBottom:'10px' }}>🎯 MODE PITCH INVESTISSEUR</div>
              {[
                {label:'Valorisation', value:'$2.5M pre-seed'},
                {label:'Recherche', value:'$500K'},
                {label:'Traction', value:'12 modules live'},
                {label:'Marche', value:'$500B B2B SaaS'},
                {label:'Equipe', value:'4 fondateurs'},
              ].map(item => (
                <div key={item.label} style={{ display:'flex', justifyContent:'space-between', padding:'5px 0', borderBottom:'1px solid rgba(244,200,66,0.15)', fontSize:'12px' }}>
                  <span style={{ color:'#b8860b' }}>{item.label}</span>
                  <span style={{ color:'#f4c842', fontWeight:'700' }}>{item.value}</span>
                </div>
              ))}
              <button onClick={() => addSystem('Pitch deck partage avec tous les investisseurs')} style={{ width:'100%', marginTop:'10px', padding:'8px', background:'rgba(244,200,66,0.2)', border:'1px solid #f4c842', borderRadius:'8px', color:'#f4c842', fontSize:'12px', fontWeight:'700', cursor:'pointer' }}>
                Partager Pitch Deck
              </button>
            </div>
          )}
        </div>

        {/* Col 3 : Transcript */}
        <div style={{ background:'#0a1628', borderRadius:'12px', border:'1px solid #1e3a5f', display:'flex', flexDirection:'column' }}>
          <div style={{ padding:'12px 14px', borderBottom:'1px solid #1e3a5f' }}>
            <div style={{ fontSize:'13px', fontWeight:'700', color:'#5b9fff' }}>Transcription live</div>
            <div style={{ fontSize:'10px', color:'#4a6fa5', marginTop:'2px' }}>{LANGS.find(l=>l.code===selectedLang)?.flag} {LANGS.find(l=>l.code===selectedLang)?.name}</div>
          </div>
          <div ref={transcriptRef} style={{ flex:1, padding:'10px', overflowY:'auto', maxHeight:'560px' }}>
            {transcript.map((t, i) => (
              <div key={i} style={{ marginBottom:'8px', fontSize:'11px' }}>
                {t.type==='system' ? (
                  <div style={{ color:'#2a4a7f', fontStyle:'italic' }}>— {t.text}</div>
                ) : (
                  <div>
                    <div style={{ fontWeight:'700', marginBottom:'2px', color: t.isAI ? '#00c896' : '#5b9fff' }}>{t.who}</div>
                    <div style={{ color:'#c8d8f0', lineHeight:'1.5', background:'#060e1a', padding:'7px', borderRadius:'6px', border:'1px solid #1e3a5f' }}>{t.msg}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{ padding:'10px', borderTop:'1px solid #1e3a5f' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'6px', background:'#060e1a', borderRadius:'6px', padding:'7px 10px', border:'1px solid #1e3a5f', marginBottom:'8px' }}>
              <div style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#00c896' }}></div>
              <span style={{ fontSize:'10px', color:'#00c896' }}>AI Translation — 0.3s latence</span>
            </div>
            <button onClick={() => addSystem('Resume IA genere et envoye')} style={{ width:'100%', padding:'7px', background:'rgba(26,111,255,0.15)', border:'1px solid #1a6fff', borderRadius:'6px', color:'#5b9fff', fontSize:'11px', fontWeight:'700', cursor:'pointer' }}>
              Generer Resume IA
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
