'use client'
import { NotificationBell } from '../components/notifications'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const LANGS: Record<string, any> = {
  fr: { flag:'🇫🇷', name:'Français',  hello:'Bonjour',   platform:'Une plateforme. Chaque entreprise. Partout.', modules:'Modules Actifs', stack:'Stack Technique', active:'Actif', logout:'Deconnexion', live:'En ligne', nav:{ home:'Tableau de bord', orgs:'Organisations', messaging:'Messages', meetings:'Reunions', projects:'Projets', memory:'Memoire', trust:'Trust Passport', marketplace:'Marketplace', matching:'Matching', contracts:'Contrats', payments:'Paiements', opportunity:'Opportunites', ai:'Assistant IA' }},
  en: { flag:'🇬🇧', name:'English',   hello:'Hello',     platform:'One platform. Every business. Everywhere.', modules:'Active Modules', stack:'Tech Stack', active:'Active', logout:'Logout', live:'Live', nav:{ home:'Dashboard', orgs:'Organizations', messaging:'Messages', meetings:'Meetings', projects:'Projects', memory:'Memory', trust:'Trust Passport', marketplace:'Marketplace', matching:'Matching', contracts:'Contracts', payments:'Payments', opportunity:'Opportunities', ai:'AI Assistant' }},
  ru: { flag:'🇷🇺', name:'Русский',   hello:'Привет',    platform:'Одна платформа. Каждый бизнес. Везде.', modules:'Активные модули', stack:'Технологии', active:'Активен', logout:'Выйти', live:'В сети', nav:{ home:'Панель', orgs:'Организации', messaging:'Сообщения', meetings:'Встречи', projects:'Проекты', memory:'Память', trust:'Паспорт доверия', marketplace:'Маркетплейс', matching:'Подбор', contracts:'Контракты', payments:'Платежи', opportunity:'Возможности', ai:'ИИ Ассистент' }},
  zh: { flag:'🇨🇳', name:'中文',       hello:'你好',       platform:'一个平台。每个企业。无处不在。', modules:'活跃模块', stack:'技术栈', active:'活跃', logout:'退出', live:'在线', nav:{ home:'仪表板', orgs:'组织', messaging:'消息', meetings:'会议', projects:'项目', memory:'记忆', trust:'信任护照', marketplace:'市场', matching:'匹配', contracts:'合同', payments:'支付', opportunity:'机会', ai:'AI助手' }},
  ja: { flag:'🇯🇵', name:'日本語',     hello:'こんにちは', platform:'一つのプラットフォーム。あらゆるビジネス。', modules:'モジュール', stack:'技術スタック', active:'アクティブ', logout:'ログアウト', live:'ライブ', nav:{ home:'ダッシュボード', orgs:'組織', messaging:'メッセージ', meetings:'会議', projects:'プロジェクト', memory:'メモリ', trust:'トラスト', marketplace:'マーケット', matching:'マッチング', contracts:'契約', payments:'支払い', opportunity:'機会', ai:'AIアシスタント' }},
  es: { flag:'🇪🇸', name:'Español',   hello:'Hola',      platform:'Una plataforma. Cada negocio. En todas partes.', modules:'Módulos Activos', stack:'Stack Técnico', active:'Activo', logout:'Salir', live:'En vivo', nav:{ home:'Panel', orgs:'Organizaciones', messaging:'Mensajes', meetings:'Reuniones', projects:'Proyectos', memory:'Memoria', trust:'Pasaporte', marketplace:'Mercado', matching:'Matching', contracts:'Contratos', payments:'Pagos', opportunity:'Oportunidades', ai:'Asistente IA' }},
  de: { flag:'🇩🇪', name:'Deutsch',   hello:'Hallo',     platform:'Eine Plattform. Jedes Unternehmen. Überall.', modules:'Aktive Module', stack:'Tech-Stack', active:'Aktiv', logout:'Abmelden', live:'Live', nav:{ home:'Dashboard', orgs:'Organisationen', messaging:'Nachrichten', meetings:'Meetings', projects:'Projekte', memory:'Gedächtnis', trust:'Vertrauenspass', marketplace:'Marktplatz', matching:'Matching', contracts:'Verträge', payments:'Zahlungen', opportunity:'Chancen', ai:'KI-Assistent' }},
  sv: { flag:'🇸🇪', name:'Svenska',   hello:'Hej',       platform:'En plattform. Varje företag. Överallt.', modules:'Aktiva moduler', stack:'Teknikstack', active:'Aktiv', logout:'Logga ut', live:'Live', nav:{ home:'Dashboard', orgs:'Organisationer', messaging:'Meddelanden', meetings:'Möten', projects:'Projekt', memory:'Minne', trust:'Förtroendepass', marketplace:'Marknadsplats', matching:'Matchning', contracts:'Kontrakt', payments:'Betalningar', opportunity:'Möjligheter', ai:'AI-assistent' }},
  no: { flag:'🇳🇴', name:'Norsk',     hello:'Hei',       platform:'En plattform. Hver bedrift. Overalt.', modules:'Aktive moduler', stack:'Teknologistack', active:'Aktiv', logout:'Logg ut', live:'Live', nav:{ home:'Dashboard', orgs:'Organisasjoner', messaging:'Meldinger', meetings:'Møter', projects:'Prosjekter', memory:'Minne', trust:'Tillitspass', marketplace:'Markedsplass', matching:'Matching', contracts:'Kontrakter', payments:'Betalinger', opportunity:'Muligheter', ai:'AI-assistent' }},
  pt: { flag:'🇧🇷', name:'Português', hello:'Olá',       platform:'Uma plataforma. Cada negócio. Em todo lugar.', modules:'Módulos Ativos', stack:'Stack Técnico', active:'Ativo', logout:'Sair', live:'Ao vivo', nav:{ home:'Painel', orgs:'Organizações', messaging:'Mensagens', meetings:'Reuniões', projects:'Projetos', memory:'Memória', trust:'Passaporte', marketplace:'Mercado', matching:'Matching', contracts:'Contratos', payments:'Pagamentos', opportunity:'Oportunidades', ai:'Assistente IA' }},
  ar: { flag:'🇸🇦', name:'العربية',   hello:'مرحبا',     platform:'منصة واحدة. كل الأعمال. في كل مكان.', modules:'الوحدات النشطة', stack:'المكدس التقني', active:'نشط', logout:'خروج', live:'مباشر', nav:{ home:'لوحة التحكم', orgs:'المنظمات', messaging:'الرسائل', meetings:'الاجتماعات', projects:'المشاريع', memory:'الذاكرة', trust:'جواز الثقة', marketplace:'السوق', matching:'المطابقة', contracts:'العقود', payments:'المدفوعات', opportunity:'الفرص', ai:'مساعد الذكاء' }},
  tr: { flag:'🇹🇷', name:'Türkçe',    hello:'Merhaba',   platform:'Bir platform. Her işletme. Her yerde.', modules:'Aktif Modüller', stack:'Teknoloji', active:'Aktif', logout:'Çıkış', live:'Canlı', nav:{ home:'Panel', orgs:'Organizasyonlar', messaging:'Mesajlar', meetings:'Toplantılar', projects:'Projeler', memory:'Bellek', trust:'Güven Pasaportu', marketplace:'Pazar', matching:'Eşleştirme', contracts:'Sözleşmeler', payments:'Ödemeler', opportunity:'Fırsatlar', ai:'AI Asistan' }},
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('home')
  const [showConference, setShowConference] = useState(false)
  const [lang, setLang] = useState('fr')
  const [showLangs, setShowLangs] = useState(false)
  const t = LANGS[lang]

  useEffect(() => {
    const token = localStorage.getItem('orbis_token')
    const u = localStorage.getItem('orbis_user')
    if (!token || !u) { router.push('/'); return }
    setUser(JSON.parse(u))
    const saved = localStorage.getItem('orbis_lang')
    if (saved && LANGS[saved]) setLang(saved)
  }, [])

  function setLanguage(code: string) {
    setLang(code); localStorage.setItem('orbis_lang', code); setShowLangs(false)
  }

  function logout() { localStorage.clear(); router.push('/') }

  const navItems = [
    { id:'home',        icon:'◎' },
    { id:'orgs',        icon:'🏢' },
    { id:'messaging',   icon:'💬' },
    { id:'meetings',    icon:'📅' },
    { id:'projects',    icon:'📁' },
    { id:'memory',      icon:'🧠' },
    { id:'trust',       icon:'🛂' },
    { id:'marketplace', icon:'🛒' },
    { id:'matching',    icon:'🤝' },
    { id:'contracts',   icon:'📝' },
    { id:'payments',    icon:'💳' },
    { id:'opportunity', icon:'💡' },
    { id:'ai',          icon:'🤖' },
  ]

  const cards = [
    { icon:'🏢', key:'orgs',        value:'1'  },
    { icon:'📁', key:'projects',    value:'1'  },
    { icon:'💬', key:'messaging',   value:'1'  },
    { icon:'💡', key:'opportunity', value:'1'  },
    { icon:'🛒', key:'marketplace', value:'1'  },
    { icon:'📝', key:'contracts',   value:'1'  },
    { icon:'🛂', key:'trust',       value:'15' },
    { icon:'🤖', key:'ai',          value:'v2' },
  ]

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#0f1b2d', color:'#ffffff', fontFamily:'system-ui' }}>

      {/* Sidebar */}
      <div style={{ width:'235px', background:'#0a0f1e', borderRight:'1px solid #1e3a5f', display:'flex', flexDirection:'column' }}>

        {/* Logo */}
        <div style={{ padding:'24px 20px', borderBottom:'1px solid #1e3a5f' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            <div style={{ width:'44px', height:'44px', borderRadius:'12px', background:'linear-gradient(135deg,#B22234,#7a0f1e)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', fontWeight:'900', color:'#fff', boxShadow:'0 4px 16px rgba(26,111,255,0.4)' }}>◎</div>
            <div>
              <div style={{ fontSize:'22px', fontWeight:'900', color:'#ffffff', letterSpacing:'-1px' }}>ORBIS</div>
              <div style={{ fontSize:'10px', color:'#B22234', letterSpacing:'3px', fontWeight:'700' }}>v2.0.0</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <div style={{ padding:'10px 0', flex:1, overflowY:'auto' }}>
          <div style={{ padding:'4px 20px 8px', fontSize:'9px', color:'#2a4a7f', fontWeight:'700', textTransform:'uppercase', letterSpacing:'1px' }}>Business OS</div>
          {[
            {id:'home',icon:'◎',label:'Dashboard',route:''},
            {id:'orgs',icon:'🏢',label:'Organisations',route:'/organizations'},
            {id:'messaging',icon:'💬',label:'Messages',route:'/messages'},
            {id:'meetings',icon:'📅',label:'Reunions',route:'/conference'},
            {id:'projects',icon:'📁',label:'Projets',route:'/projects'},
            {id:'memory',icon:'🧠',label:'Memoire',route:'/memory'},
            {id:'trust',icon:'🛂',label:'Trust Passport',route:'/organizations'},
            {id:'ai',icon:'🤖',label:'AI Assistant',route:'/ai'},
          ].map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); if(item.route) router.push(item.route) }} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 20px', border:'none', width:'100%', background: activeTab===item.id?'linear-gradient(90deg,rgba(178,34,52,0.2),transparent)':'transparent', color: activeTab===item.id?'#fff':'#4a6fa5', fontSize:'12px', cursor:'pointer', textAlign:'left' as const, borderLeft: activeTab===item.id?'3px solid #B22234':'3px solid transparent', fontWeight: activeTab===item.id?'700':'400' }}>
              <span>{item.icon}</span><span>{item.label}</span>
            </button>
          ))}
          <div style={{ padding:'10px 20px 6px', fontSize:'9px', color:'#2a4a7f', fontWeight:'700', textTransform:'uppercase', letterSpacing:'1px', borderTop:'1px solid #1e3a5f', marginTop:'6px' }}>Marketplaces</div>
          {[
            {id:'marketplace',icon:'🛒',label:'Services B2B',route:'/marketplace'},
            {id:'wholesale',icon:'🌍',label:'Wholesale Gros',route:'/wholesale'},
            {id:'devmarket',icon:'🛠️',label:'Dev Market',route:'/devmarket'},
            {id:'investors',icon:'💰',label:'Investors Hub',route:'/investors'},
            {id:'contracts',icon:'📝',label:'Contrats',route:'/contracts'},
            {id:'payments',icon:'💳',label:'Paiements',route:'/payments'},
            {id:'opportunity',icon:'💡',label:'Opportunites',route:'/opportunities'},
            {id:'matching',icon:'🤝',label:'Matching',route:'/marketplace'},
          ].map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); router.push(item.route) }} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 20px', border:'none', width:'100%', background: activeTab===item.id?'linear-gradient(90deg,rgba(0,200,150,0.15),transparent)':'transparent', color: activeTab===item.id?'#00c896':'#4a6fa5', fontSize:'12px', cursor:'pointer', textAlign:'left' as const, borderLeft: activeTab===item.id?'3px solid #00c896':'3px solid transparent', fontWeight: activeTab===item.id?'700':'400' }}>
              <span>{item.icon}</span><span>{item.label}</span>
            </button>
          ))}
          <div style={{ padding:'10px 20px 6px', fontSize:'9px', color:'#2a4a7f', fontWeight:'700', textTransform:'uppercase', letterSpacing:'1px', borderTop:'1px solid #1e3a5f', marginTop:'6px' }}>Outils IA 2026</div>
          {[
            {id:'tracking',icon:'🛰️',label:'Satellite Tracking',route:'/tracking'},
            {id:'predict',icon:'🔮',label:'Deal Predictions',route:'/predict'},
            {id:'credit',icon:'📊',label:'Credit Score',route:'/credit'},
            {id:'voice',icon:'🎙️',label:'Voice Clone AI',route:'/voice'},
            {id:'documents',icon:'📄',label:'Doc Scanner',route:'/documents'},
            {id:'card',icon:'🪪',label:'AR Business Card',route:'/card'},
            {id:'conference',icon:'🎤',label:'Conference Room',route:'/conference'},
            {id:'universe',icon:'🌐',label:'Universe Graph',route:'/universe'},
          ].map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); router.push(item.route) }} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 20px', border:'none', width:'100%', background: activeTab===item.id?'linear-gradient(90deg,rgba(167,139,250,0.15),transparent)':'transparent', color: activeTab===item.id?'#a78bfa':'#4a6fa5', fontSize:'12px', cursor:'pointer', textAlign:'left' as const, borderLeft: activeTab===item.id?'3px solid #a78bfa':'3px solid transparent', fontWeight: activeTab===item.id?'700':'400' }}>
              <span>{item.icon}</span><span>{item.label}</span>
            </button>
          ))}
        </div>
        {/* User */}
        <div style={{ padding:'16px 20px', borderTop:'1px solid #1e3a5f' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'14px' }}>
            <div style={{ width:'38px', height:'38px', borderRadius:'50%', background:'linear-gradient(135deg,#B22234,#7a0f1e)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', fontWeight:'800', color:'#fff' }}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div>
              <div style={{ fontSize:'13px', color:'#ffffff', fontWeight:'700' }}>{user?.firstName} {user?.lastName}</div>
              <div style={{ fontSize:'10px', color:'#B22234', fontWeight:'600' }}>Admin ORBIS</div>
            </div>
          </div>
          <button onClick={logout} style={{ fontSize:'12px', color:'#ff6b6b', background:'rgba(255,107,107,0.1)', border:'1px solid rgba(255,107,107,0.3)', cursor:'pointer', padding:'8px 12px', borderRadius:'8px', width:'100%', fontWeight:'600' }}>
            {t.logout}
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex:1, overflowY:'auto' }}>

        {/* Topbar */}
        <div style={{ padding:'18px 40px', borderBottom:'1px solid #1e3a5f', background:'#0a0f1e', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <h1 style={{ fontSize:'22px', fontWeight:'900', margin:0, color:'#ffffff', letterSpacing:'-0.5px' }}>
              {activeTab === 'home' ? t.hello + ' ' + (user?.firstName || '') + ' 👋' : (t.nav as any)[activeTab]}
            </h1>
            <p style={{ color:'#8899aa', fontSize:'13px', margin:'3px 0 0' }}>{t.platform}</p>
          </div>
          <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
            <div style={{ padding:'8px 16px', background:'rgba(178,34,52,0.15)', border:'1px solid rgba(26,111,255,0.4)', borderRadius:'20px', fontSize:'12px', color:'#FFFFFF', fontWeight:'700' }}>
              🟢 API {t.live} :4080
            </div>

            {/* Language selector */}
            <NotificationBell /><div style={{ position:'relative' }}>
              <button onClick={() => setShowLangs(!showLangs)} style={{ padding:'8px 16px', background:'rgba(255,255,255,0.05)', border:'1px solid #1e3a5f', borderRadius:'20px', fontSize:'13px', color:'#ffffff', fontWeight:'700', cursor:'pointer', display:'flex', alignItems:'center', gap:'8px' }}>
                {LANGS[lang].flag} {LANGS[lang].name} <span style={{ fontSize:'10px', color:'#8899aa' }}>▼</span>
              </button>
              {showLangs && (
                <div style={{ position:'absolute', top:'46px', right:0, background:'#0a0f1e', border:'1px solid #1e3a5f', borderRadius:'14px', padding:'8px', zIndex:100, minWidth:'190px', boxShadow:'0 12px 40px rgba(0,0,0,0.5)' }}>
                  {Object.entries(LANGS).map(([code, l]) => (
                    <button key={code} onClick={() => setLanguage(code)} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'9px 12px', width:'100%', border:'none', background: lang===code ? 'rgba(178,34,52,0.2)' : 'transparent', borderRadius:'8px', cursor:'pointer', fontSize:'13px', color: lang===code ? '#ffffff' : '#8899aa', fontWeight: lang===code ? '700' : '400' }}>
                      <span style={{ fontSize:'16px' }}>{l.flag}</span>
                      <span>{l.name}</span>
                      {lang===code && <span style={{ marginLeft:'auto', color:'#B22234' }}>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ padding:'32px 40px' }}>

          {activeTab === 'home' && (
            <>
              {/* Cards */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'16px', marginBottom:'28px' }}>
                {cards.map((card, i) => (
                  <div key={card.key} onClick={() => {
                  setActiveTab(card.key)
                  const routes: any = {
                    orgs:'/organizations', messaging:'/messages', meetings:'/conference',
                    projects:'/projects', memory:'/memory', trust:'/organizations',
                    marketplace:'/marketplace', matching:'/marketplace', contracts:'/contracts',
                    payments:'/payments', opportunity:'/opportunities', ai:'/ai',
                  }
                  if(routes[card.key]) router.push(routes[card.key])
                }} style={{ background: i%2===0 ? 'rgba(26,111,255,0.12)' : 'rgba(255,255,255,0.04)', border:'1px solid ' + (i%2===0 ? 'rgba(178,34,52,0.3)' : '#1a2d4a'), borderRadius:'14px', padding:'22px', cursor:'pointer', position:'relative', overflow:'hidden', transition:'all 0.2s' }}>
                                        <div style={{ fontSize:'22px', marginBottom:'12px' }}>{card.icon}</div>
                    <div style={{ fontSize:'32px', fontWeight:'900', color: i%2===0 ? '#FFFFFF' : '#ffffff', letterSpacing:'-1px' }}>{card.value}</div>
                    <div style={{ fontSize:'11px', color:'#8899aa', marginTop:'6px', textTransform:'uppercase', letterSpacing:'1px', fontWeight:'600' }}>{(t.nav as any)[card.key]}</div>
                  </div>
                ))}
              </div>

              {/* Bottom */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' }}>

                <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid #1e3a5f', borderRadius:'14px', padding:'24px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'20px' }}>
                    <div style={{ width:'4px', height:'20px', background:'#B22234', borderRadius:'2px' }}></div>
                    <h3 style={{ margin:0, fontSize:'13px', fontWeight:'800', color:'#FFFFFF', textTransform:'uppercase', letterSpacing:'1px' }}>{t.modules}</h3>
                  </div>
                  {navItems.slice(1).map(item => (
                    <div key={item.id} onClick={() => { setActiveTab(item.id); const navRoutes: any = {
                orgs:'/organizations', messaging:'/messages', meetings:'/conference',
                projects:'/projects', memory:'/memory', trust:'/organizations',
                marketplace:'/marketplace', wholesale:'/wholesale', devmarket:'/devmarket',
                investors:'/investors', matching:'/marketplace', contracts:'/contracts',
                payments:'/payments', opportunity:'/opportunities', ai:'/ai',
                tracking:'/tracking', predict:'/predict', credit:'/credit',
                voice:'/voice', documents:'/documents', card:'/card',
                conference:'/conference', universe:'/universe',
              }
              if(navRoutes[item.id]) router.push(navRoutes[item.id]) }} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'9px 0', borderBottom:'1px solid rgba(30,58,95,0.5)', cursor:'pointer' }}>
                      <span style={{ fontSize:'13px', color:'#c8d8f0' }}>{item.icon} {(t.nav as any)[item.id]}</span>
                      <span style={{ fontSize:'10px', color:'#FFFFFF', background:'rgba(178,34,52,0.15)', border:'1px solid rgba(26,111,255,0.3)', padding:'2px 10px', borderRadius:'20px', fontWeight:'700' }}>✓ {t.active}</span>
                    </div>
                  ))}
                </div>

                <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid #1e3a5f', borderRadius:'14px', padding:'24px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'20px' }}>
                    <div style={{ width:'4px', height:'20px', background:'#B22234', borderRadius:'2px' }}></div>
                    <h3 style={{ margin:0, fontSize:'13px', fontWeight:'800', color:'#FFFFFF', textTransform:'uppercase', letterSpacing:'1px' }}>{t.stack}</h3>
                  </div>
                  {[
                    ['Backend',  'Node.js + TypeScript', '#FFFFFF'],
                    ['Database', 'PostgreSQL 16',        '#FFFFFF'],
                    ['Auth',     'JWT + bcrypt',         '#ffffff'],
                    ['IA',       'Claude (Anthropic)',   '#a78bfa'],
                    ['Frontend', 'Next.js 15',           '#ffffff'],
                    ['Cache',    'Redis',                '#2a4a7f'],
                    ['Storage',  'MinIO',                '#2a4a7f'],
                    ['API',      'localhost:4080',       '#FFFFFF'],
                    ['Web',      'localhost:3090',       '#FFFFFF'],
                  ].map(([k,v,c]) => (
                    <div key={k} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 0', borderBottom:'1px solid rgba(30,58,95,0.5)' }}>
                      <span style={{ fontSize:'12px', color:'#8899aa', fontWeight:'600' }}>{k}</span>
                      <span style={{ fontSize:'12px', color: c as string, fontWeight:'700' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab !== 'home' && (
            <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid #1e3a5f', borderRadius:'14px', padding:'60px', textAlign:'center' }}>
              <div style={{ fontSize:'56px', marginBottom:'20px' }}>{navItems.find(n => n.id === activeTab)?.icon}</div>
              <h2 style={{ fontSize:'24px', fontWeight:'900', margin:'0 0 8px', color:'#ffffff' }}>{(t.nav as any)[activeTab]}</h2>
              <p style={{ color:'#8899aa', fontSize:'14px', margin:'0 0 32px' }}>Module actif sur l API ORBIS.</p>
              <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'12px 24px', background:'rgba(178,34,52,0.15)', border:'1px solid rgba(26,111,255,0.4)', borderRadius:'10px', color:'#FFFFFF', fontSize:'13px', fontFamily:'monospace', fontWeight:'700' }}>
                🟢 http://localhost:4080/api/{activeTab}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
