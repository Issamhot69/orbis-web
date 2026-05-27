'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ReferralPage() {
  const router = useRouter()
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('orbis_user') || '{}') : {}
  const [copied, setCopied] = useState(false)
  const [referrals, setReferrals] = useState([
    { name:'John Smith', email:'j***@gmail.com', status:'converted', reward:'1 mois Pro', date:'24/05/2026' },
    { name:'Maria Garcia', email:'m***@yahoo.com', status:'pending', reward:'En attente', date:'25/05/2026' },
    { name:'Klaus Weber', email:'k***@gmx.de', status:'converted', reward:'1 mois Pro', date:'26/05/2026' },
  ])

  const referralCode = 'ORBIS-' + (user.firstName || 'USER').toUpperCase().slice(0,4) + '-2026'
  const referralLink = 'https://orbis-smoky-gamma.vercel.app/?ref=' + referralCode
  const totalRewards = referrals.filter(r => r.status === 'converted').length
  const pendingRewards = referrals.filter(r => r.status === 'pending').length

  function copyLink() {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const REWARDS = [
    { referrals:1,  reward:'1 mois Pro gratuit',    icon:'🎁', value:'$49',   unlocked: totalRewards >= 1 },
    { referrals:3,  reward:'3 mois Pro gratuits',   icon:'🏆', value:'$147',  unlocked: totalRewards >= 3 },
    { referrals:5,  reward:'6 mois Pro gratuits',   icon:'💎', value:'$294',  unlocked: totalRewards >= 5 },
    { referrals:10, reward:'1 an Enterprise',        icon:'👑', value:'$2388', unlocked: totalRewards >= 10 },
    { referrals:25, reward:'Cash $500 + Partner',   icon:'🚀', value:'$500',  unlocked: totalRewards >= 25 },
    { referrals:50, reward:'Equity ORBIS 0.1%',     icon:'🌍', value:'$20K+', unlocked: totalRewards >= 50 },
  ]

  const SHARE_MESSAGES = [
    { platform:'LinkedIn', icon:'💼', color:'#0077b5', text:'Je viens de decouvrir ORBIS — la plateforme B2B qui remplace LinkedIn + Alibaba + Fiverr. Speech-to-Speech IA, Trust Passport, 4 Marketplaces. Essayez gratuitement: ' + referralLink },
    { platform:'Twitter/X', icon:'🐦', color:'#1da1f2', text:'ORBIS est incroyable - Business OS + 4 Marketplaces + IA en une seule plateforme. Speech-to-Speech temps reel dans 12 langues! Rejoignez avec mon lien: ' + referralLink + ' #B2B #AI #Business' },
    { platform:'WhatsApp', icon:'💬', color:'#25d366', text:'Salut! Tu dois essayer ORBIS - une super plateforme B2B avec IA. Completement gratuit pour commencer: ' + referralLink },
    { platform:'Email', icon:'📧', color:'#B22234', text:'Decouvre ORBIS - essaie gratuitement: ' + referralLink },
  ]

  return (
    <div style={{ minHeight:'100vh', background:'#060e1a', color:'#fff', fontFamily:'system-ui', padding:'24px' }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'32px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <button onClick={() => router.push('/dashboard')} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid #1e3a5f', borderRadius:'8px', padding:'8px 14px', color:'#4a6fa5', cursor:'pointer', fontSize:'12px' }}>
            <- Dashboard
          </button>
          <div>
            <h1 style={{ margin:0, fontSize:'24px', fontWeight:'900' }}>🤝 Programme Referral ORBIS</h1>
            <p style={{ margin:0, fontSize:'13px', color:'#4a6fa5' }}>Invitez des amis — gagnez des recompenses exclusives</p>
          </div>
        </div>
        <div style={{ padding:'6px 14px', background:'rgba(178,34,52,0.15)', border:'1px solid #B22234', borderRadius:'20px', fontSize:'12px', color:'#B22234', fontWeight:'700' }}>
          🎁 {totalRewards} recompenses gagnees
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'14px', marginBottom:'28px' }}>
        {[
          { icon:'👥', label:'Total invites', value: referrals.length, color:'#5b9fff' },
          { icon:'✅', label:'Convertis', value: totalRewards, color:'#00c896' },
          { icon:'⏳', label:'En attente', value: pendingRewards, color:'#f4c842' },
          { icon:'🎁', label:'Valeur gagnee', value:'$' + (totalRewards * 49), color:'#B22234' },
        ].map((s,i) => (
          <div key={i} style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'12px', padding:'16px' }}>
            <div style={{ fontSize:'20px', marginBottom:'8px' }}>{s.icon}</div>
            <div style={{ fontSize:'24px', fontWeight:'900', color:s.color }}>{s.value}</div>
            <div style={{ fontSize:'11px', color:'#4a6fa5', marginTop:'4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' }}>

        {/* Left */}
        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>

          {/* Referral Link */}
          <div style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'14px', padding:'24px' }}>
            <div style={{ fontSize:'13px', fontWeight:'800', color:'#5b9fff', marginBottom:'16px' }}>Votre lien de parrainage</div>
            <div style={{ background:'#060e1a', border:'1px solid #1e3a5f', borderRadius:'10px', padding:'14px', marginBottom:'12px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'10px' }}>
              <span style={{ fontSize:'12px', color:'#00c896', fontFamily:'monospace', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{referralLink}</span>
              <button onClick={copyLink} style={{ padding:'6px 16px', background: copied?'#00c896':'#B22234', border:'none', borderRadius:'6px', color:'#fff', fontSize:'12px', fontWeight:'700', cursor:'pointer', flexShrink:0 }}>
                {copied ? 'Copie !' : 'Copier'}
              </button>
            </div>
            <div style={{ background:'rgba(178,34,52,0.1)', border:'1px solid #B22234', borderRadius:'8px', padding:'10px', textAlign:'center', fontSize:'13px', color:'#B22234', fontWeight:'700' }}>
              Code: {referralCode}
            </div>
          </div>

          {/* Share buttons */}
          <div style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'14px', padding:'24px' }}>
            <div style={{ fontSize:'13px', fontWeight:'800', color:'#5b9fff', marginBottom:'16px' }}>Partager sur</div>
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              {SHARE_MESSAGES.map((s,i) => (
                <button key={i} onClick={() => { navigator.clipboard.writeText(s.text); alert('Message copie pour ' + s.platform + '!') }} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'12px 16px', background:'rgba(255,255,255,0.03)', border:'1px solid #1e3a5f', borderRadius:'10px', cursor:'pointer', textAlign:'left' }}>
                  <span style={{ fontSize:'20px' }}>{s.icon}</span>
                  <div>
                    <div style={{ fontSize:'13px', fontWeight:'700', color:'#fff' }}>{s.platform}</div>
                    <div style={{ fontSize:'11px', color:'#4a6fa5' }}>Copier le message</div>
                  </div>
                  <div style={{ marginLeft:'auto', padding:'3px 10px', background:'rgba(255,255,255,0.05)', borderRadius:'10px', fontSize:'10px', color:'#4a6fa5' }}>Copier</div>
                </button>
              ))}
            </div>
          </div>

          {/* Referrals list */}
          <div style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'14px', padding:'24px' }}>
            <div style={{ fontSize:'13px', fontWeight:'800', color:'#5b9fff', marginBottom:'16px' }}>Mes parrainages</div>
            {referrals.map((r,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'10px 0', borderBottom:'1px solid #0f1f3d' }}>
                <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:'linear-gradient(135deg,#B22234,#3C3B6E)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', fontWeight:'900', color:'#fff' }}>
                  {r.name[0]}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:'13px', fontWeight:'700' }}>{r.name}</div>
                  <div style={{ fontSize:'11px', color:'#4a6fa5' }}>{r.email} • {r.date}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:'11px', fontWeight:'700', color: r.status==='converted'?'#00c896':'#f4c842' }}>
                    {r.status==='converted' ? '✅ Converti' : '⏳ En attente'}
                  </div>
                  <div style={{ fontSize:'10px', color:'#4a6fa5' }}>{r.reward}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Rewards */}
        <div style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'14px', padding:'24px' }}>
          <div style={{ fontSize:'13px', fontWeight:'800', color:'#5b9fff', marginBottom:'20px' }}>Recompenses disponibles</div>

          {/* Progress */}
          <div style={{ background:'#060e1a', borderRadius:'10px', padding:'16px', marginBottom:'20px', border:'1px solid #1e3a5f' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px', fontSize:'12px' }}>
              <span style={{ color:'#4a6fa5' }}>Progression vers prochaine recompense</span>
              <span style={{ color:'#00c896', fontWeight:'700' }}>{totalRewards}/3</span>
            </div>
            <div style={{ height:'8px', background:'#1e3a5f', borderRadius:'4px', overflow:'hidden' }}>
              <div style={{ width: Math.min(100, (totalRewards/3)*100) + '%', height:'100%', background:'linear-gradient(90deg,#B22234,#f4c842)', borderRadius:'4px', transition:'width 0.5s' }}></div>
            </div>
            <div style={{ fontSize:'11px', color:'#4a6fa5', marginTop:'6px' }}>
              Encore {Math.max(0,3-totalRewards)} parrainage(s) pour 3 mois Pro gratuits
            </div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            {REWARDS.map((r,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:'14px', padding:'16px', background: r.unlocked?'rgba(0,200,150,0.08)':'rgba(255,255,255,0.02)', border:'1px solid '+(r.unlocked?'#00c896':'#1e3a5f'), borderRadius:'12px' }}>
                <div style={{ fontSize:'28px', flexShrink:0 }}>{r.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:'13px', fontWeight:'700', color: r.unlocked?'#00c896':'#fff' }}>{r.reward}</div>
                  <div style={{ fontSize:'11px', color:'#4a6fa5', marginTop:'2px' }}>{r.referrals} parrainages requis • Valeur {r.value}</div>
                </div>
                <div style={{ flexShrink:0 }}>
                  {r.unlocked ? (
                    <span style={{ padding:'4px 12px', background:'rgba(0,200,150,0.2)', border:'1px solid #00c896', borderRadius:'10px', fontSize:'11px', color:'#00c896', fontWeight:'700' }}>Debloque</span>
                  ) : (
                    <span style={{ padding:'4px 12px', background:'rgba(255,255,255,0.05)', border:'1px solid #1e3a5f', borderRadius:'10px', fontSize:'11px', color:'#4a6fa5' }}>Verrouille</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop:'20px', padding:'16px', background:'rgba(178,34,52,0.08)', border:'1px solid #B22234', borderRadius:'12px', textAlign:'center' }}>
            <div style={{ fontSize:'13px', fontWeight:'700', color:'#B22234', marginBottom:'4px' }}>Devenez ORBIS Partner</div>
            <div style={{ fontSize:'12px', color:'#6a8aaa', marginBottom:'12px' }}>50 parrainages = 0.1% equity ORBIS + $500 cash</div>
            <button onClick={() => router.push('/pitch')} style={{ padding:'8px 20px', background:'#B22234', border:'none', borderRadius:'8px', color:'#fff', fontSize:'12px', fontWeight:'700', cursor:'pointer' }}>
              En savoir plus
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
