'use client'
import { useState } from 'react'
import { Card, Button, Badge, SectionTitle, colors } from './orbis-ui'

interface OrbisUser {
  name: string
  role: string
  country: string
  trust: number
  verified: boolean
}

interface OrbisSuiteProps {
  withUser: OrbisUser
  context: string
  onClose: () => void
}

const TOOLS = [
  { id:'speech',    icon:'🎙️', label:'Speech to Speech',    desc:'Parlez votre langue — entendu dans la sienne', color:'#1a6fff' },
  { id:'video',     icon:'📹', label:'Video Call HD',        desc:'Conference sécurisée avec traduction IA', color:'#00c896' },
  { id:'contract',  icon:'📝', label:'Contrat Auto',         desc:'Généré, signé, archivé en 30 secondes', color:'#a78bfa' },
  { id:'document',  icon:'📄', label:'Document Scanner',     desc:'Analyse IA — risques, clauses, traduction', color:'#f4c842' },
  { id:'escrow',    icon:'🔒', label:'Paiement Escrow',      desc:'Argent bloqué jusqu à livraison confirmée', color:'#00c896' },
  { id:'tracking',  icon:'🛰️', label:'Satellite Tracking',   desc:'Suivi GPS temps réel de votre commande', color:'#1a6fff' },
  { id:'trust',     icon:'🛂', label:'Trust Passport',       desc:'Vérification identité et réputation', color:'#f4c842' },
  { id:'ai',        icon:'🤖', label:'AI Business Coach',    desc:'Conseils IA pour maximiser votre deal', color:'#a78bfa' },
  { id:'translate', icon:'🌍', label:'Traduction Live',      desc:'12 langues — temps réel dans les documents', color:'#1a6fff' },
  { id:'sign',      icon:'✍️', label:'Signature Électronique', desc:'Valide dans 190 pays — certifiée eIDAS', color:'#00c896' },
  { id:'dispute',   icon:'⚖️', label:'Résolution Litiges',   desc:'Arbitrage IA — résolution en 48h', color:'#ff6b6b' },
  { id:'memory',    icon:'🧠', label:'Business Memory',      desc:'Tout est sauvegardé — accès à vie', color:'#a78bfa' },
]

export function OrbisActionBar({ withUser, context, onClose }: OrbisSuiteProps) {
  const [activeTool, setActiveTool] = useState<string|null>(null)
  const [speechActive, setSpeechActive] = useState(false)
  const [videoActive, setVideoActive]   = useState(false)
  const [contractDone, setContractDone] = useState(false)
  const [escrowLocked, setEscrowLocked] = useState(false)
  const [langFrom, setLangFrom]         = useState('fr')
  const [langTo, setLangTo]             = useState('en')

  const LANGS = [
    {code:'fr',flag:'🇫🇷',name:'Français'},
    {code:'en',flag:'🇬🇧',name:'English'},
    {code:'ru',flag:'🇷🇺',name:'Русский'},
    {code:'zh',flag:'🇨🇳',name:'中文'},
    {code:'ja',flag:'🇯🇵',name:'日本語'},
    {code:'es',flag:'🇪🇸',name:'Español'},
    {code:'de',flag:'🇩🇪',name:'Deutsch'},
    {code:'sv',flag:'🇸🇪',name:'Svenska'},
    {code:'no',flag:'🇳🇴',name:'Norsk'},
    {code:'pt',flag:'🇧🇷',name:'Português'},
    {code:'it',flag:'🇮🇹',name:'Italiano'},
    {code:'ko',flag:'🇰🇷',name:'한국어'},
  ]

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:'20px' }}>
      <Card style={{ width:'100%', maxWidth:'720px', maxHeight:'90vh', overflow:'auto', padding:'28px' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            <div style={{ width:'44px', height:'44px', borderRadius:'12px', background:'linear-gradient(135deg,#B22234,#7a0f1e)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', fontWeight:'900', color:'#fff' }}>
              {withUser.name[0]}
            </div>
            <div>
              <div style={{ fontSize:'15px', fontWeight:'800', color: colors.text }}>
                {withUser.country} {withUser.name}
              </div>
              <div style={{ fontSize:'11px', color: colors.textMuted }}>{withUser.role} • Trust {withUser.trust}/100 • {context}</div>
            </div>
            {withUser.verified && <Badge color="success">✓ Vérifié ORBIS</Badge>}
          </div>
          <button onClick={onClose} style={{ background:'transparent', border:'none', color: colors.textMuted, fontSize:'20px', cursor:'pointer' }}>✕</button>
        </div>

        {/* Tools Grid */}
        {!activeTool && (
          <>
            <SectionTitle>ORBIS Suite — Outils disponibles</SectionTitle>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'10px', marginBottom:'20px' }}>
              {TOOLS.map(tool => (
                <div key={tool.id} onClick={() => setActiveTool(tool.id)} style={{ background: colors.bg, border:'1px solid '+colors.border, borderRadius:'12px', padding:'14px', cursor:'pointer', textAlign:'center', transition:'border-color 0.2s' }}>
                  <div style={{ fontSize:'24px', marginBottom:'8px' }}>{tool.icon}</div>
                  <div style={{ fontSize:'12px', fontWeight:'700', color: colors.text, marginBottom:'4px' }}>{tool.label}</div>
                  <div style={{ fontSize:'10px', color: colors.textMuted, lineHeight:'1.4' }}>{tool.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', gap:'10px' }}>
              <Button style={{ flex:1 }} onClick={() => setActiveTool('video')}>📹 Démarrer Video Call</Button>
              <Button variant="success" style={{ flex:1 }} onClick={() => setActiveTool('contract')}>📝 Créer Contrat</Button>
              <Button variant="ghost" onClick={onClose}>Fermer</Button>
            </div>
          </>
        )}

        {/* Speech to Speech */}
        {activeTool === 'speech' && (
          <div>
            <SectionTitle color="#1a6fff">🎙️ Speech to Speech — Temps réel</SectionTitle>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'20px' }}>
              <div>
                <label style={{ fontSize:'12px', color: colors.textMuted, display:'block', marginBottom:'6px' }}>Ma langue</label>
                <select value={langFrom} onChange={e => setLangFrom(e.target.value)} style={{ width:'100%', padding:'10px', background: colors.bg, border:'1px solid '+colors.border, borderRadius:'8px', color: colors.text, fontSize:'13px', outline:'none' }}>
                  {LANGS.map(l => <option key={l.code} value={l.code}>{l.flag} {l.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize:'12px', color: colors.textMuted, display:'block', marginBottom:'6px' }}>{withUser.name} entend en</label>
                <select value={langTo} onChange={e => setLangTo(e.target.value)} style={{ width:'100%', padding:'10px', background: colors.bg, border:'1px solid '+colors.border, borderRadius:'8px', color: colors.text, fontSize:'13px', outline:'none' }}>
                  {LANGS.map(l => <option key={l.code} value={l.code}>{l.flag} {l.name}</option>)}
                </select>
              </div>
            </div>
            <div style={{ background: colors.bg, border:'1px solid '+colors.border, borderRadius:'12px', padding:'24px', textAlign:'center', marginBottom:'16px' }}>
              {!speechActive ? (
                <>
                  <div style={{ fontSize:'48px', marginBottom:'12px' }}>🎙️</div>
                  <div style={{ fontSize:'13px', color: colors.textMuted, marginBottom:'16px' }}>Cliquez pour parler — votre voix sera clonée et traduite instantanément</div>
                  <Button onClick={() => setSpeechActive(true)}>🎙️ Démarrer Speech to Speech</Button>
                </>
              ) : (
                <>
                  <div style={{ display:'flex', justifyContent:'center', gap:'3px', marginBottom:'16px' }}>
                    {[1,2,3,4,5,6,7,8,9,10].map(i => (
                      <div key={i} style={{ width:'4px', background:'#B22234', borderRadius:'2px', height: Math.random()>0.5?'40px':'16px' }}></div>
                    ))}
                  </div>
                  <div style={{ fontSize:'13px', color:'#B22234', fontWeight:'700', marginBottom:'8px' }}>🔴 En cours — Latence 0.3s</div>
                  <div style={{ fontSize:'12px', color: colors.textMuted, marginBottom:'16px' }}>
                    {LANGS.find(l=>l.code===langFrom)?.flag} → {LANGS.find(l=>l.code===langTo)?.flag} • Voix clonée active
                  </div>
                  <Button variant="danger" onClick={() => setSpeechActive(false)}>⏹ Arrêter</Button>
                </>
              )}
            </div>
            <Button variant="secondary" onClick={() => setActiveTool(null)}>← Retour aux outils</Button>
          </div>
        )}

        {/* Video Call */}
        {activeTool === 'video' && (
          <div>
            <SectionTitle color="#00c896">📹 Video Call HD — Traduction IA</SectionTitle>
            {!videoActive ? (
              <div style={{ textAlign:'center', padding:'32px' }}>
                <div style={{ fontSize:'64px', marginBottom:'16px' }}>📹</div>
                <div style={{ fontSize:'14px', color: colors.text, marginBottom:'8px' }}>Appel vidéo avec {withUser.name}</div>
                <div style={{ fontSize:'12px', color: colors.textMuted, marginBottom:'24px' }}>Traduction simultanée • Enregistrement sécurisé • Transcription automatique</div>
                <div style={{ display:'flex', gap:'10px', justifyContent:'center' }}>
                  <Button onClick={() => { setVideoActive(true); window.open('/conference','_blank') }}>📹 Démarrer l appel</Button>
                  <Button variant="ghost" onClick={() => setActiveTool(null)}>Planifier plus tard</Button>
                </div>
              </div>
            ) : (
              <div style={{ background: colors.bg, borderRadius:'12px', padding:'20px', textAlign:'center' }}>
                <Badge color="success">🔴 Appel en cours</Badge>
                <div style={{ marginTop:'16px', fontSize:'12px', color: colors.textMuted }}>Ouvert dans ORBIS Conference Room</div>
              </div>
            )}
            <Button variant="secondary" style={{ marginTop:'16px' }} onClick={() => setActiveTool(null)}>← Retour</Button>
          </div>
        )}

        {/* Contract */}
        {activeTool === 'contract' && (
          <div>
            <SectionTitle color="#a78bfa">📝 Contrat Auto-généré</SectionTitle>
            {!contractDone ? (
              <div>
                <div style={{ background: colors.bg, border:'1px solid '+colors.border, borderRadius:'10px', padding:'16px', marginBottom:'16px' }}>
                  <div style={{ fontSize:'12px', fontWeight:'700', color: colors.text, marginBottom:'12px' }}>Contrat ORBIS — Auto-généré par IA</div>
                  {[
                    ['Partie A',    'Vous (ORBIS User)'],
                    ['Partie B',    withUser.name+' • '+withUser.country],
                    ['Contexte',    context],
                    ['Juridiction', 'ORBIS Trust Network — USA'],
                    ['Date',        new Date().toLocaleDateString('fr-FR')],
                    ['Statut',      'En attente de signature'],
                  ].map(([k,v]) => (
                    <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid '+colors.border, fontSize:'12px' }}>
                      <span style={{ color: colors.textMuted }}>{k}</span>
                      <span style={{ color: colors.text, fontWeight:'600' }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display:'flex', gap:'10px' }}>
                  <Button style={{ flex:1 }} onClick={() => setContractDone(true)}>✍️ Signer maintenant</Button>
                  <Button variant="ghost" style={{ flex:1 }}>📥 Télécharger PDF</Button>
                  <Button variant="ghost" style={{ flex:1 }}>✏️ Modifier</Button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign:'center', padding:'32px' }}>
                <div style={{ fontSize:'48px', marginBottom:'12px' }}>✅</div>
                <div style={{ fontSize:'15px', fontWeight:'800', color: colors.success, marginBottom:'8px' }}>Contrat signé !</div>
                <div style={{ fontSize:'12px', color: colors.textMuted }}>Archivé sur ORBIS Trust Network • Valide dans 190 pays</div>
              </div>
            )}
            <Button variant="secondary" style={{ marginTop:'16px' }} onClick={() => setActiveTool(null)}>← Retour</Button>
          </div>
        )}

        {/* Escrow */}
        {activeTool === 'escrow' && (
          <div>
            <SectionTitle color="#00c896">🔒 Paiement Escrow Sécurisé</SectionTitle>
            {!escrowLocked ? (
              <div>
                <div style={{ background:'rgba(0,200,150,0.08)', border:'1px solid '+colors.success, borderRadius:'10px', padding:'20px', marginBottom:'16px', textAlign:'center' }}>
                  <div style={{ fontSize:'13px', color: colors.textMuted, marginBottom:'8px' }}>Votre argent est protégé</div>
                  <div style={{ fontSize:'11px', color: colors.textMuted, lineHeight:'1.6' }}>
                    Le paiement est bloqué par ORBIS jusqu à confirmation de réception.<br/>
                    Remboursement garanti en cas de litige.
                  </div>
                </div>
                <div style={{ display:'flex', gap:'10px', marginBottom:'16px' }}>
                  {['💳 Carte bancaire','🏦 Virement SWIFT','₿ Crypto','🏢 ORBIS Credit'].map((m,i) => (
                    <button key={i} style={{ flex:1, padding:'10px 6px', background: colors.bg, border:'1px solid '+colors.border, borderRadius:'8px', color: colors.textMuted, fontSize:'10px', cursor:'pointer', textAlign:'center' }}>{m}</button>
                  ))}
                </div>
                <Button variant="success" style={{ width:'100%' }} onClick={() => setEscrowLocked(true)}>🔒 Bloquer le paiement</Button>
              </div>
            ) : (
              <div style={{ textAlign:'center', padding:'32px' }}>
                <div style={{ fontSize:'48px', marginBottom:'12px' }}>🔒</div>
                <div style={{ fontSize:'15px', fontWeight:'800', color: colors.success, marginBottom:'8px' }}>Paiement sécurisé en escrow</div>
                <div style={{ fontSize:'12px', color: colors.textMuted }}>Libéré automatiquement à la confirmation de livraison</div>
              </div>
            )}
            <Button variant="secondary" style={{ marginTop:'16px' }} onClick={() => setActiveTool(null)}>← Retour</Button>
          </div>
        )}

        {/* Document Scanner */}
        {activeTool === 'document' && (
          <div>
            <SectionTitle color="#f4c842">📄 Document AI Scanner</SectionTitle>
            <div style={{ textAlign:'center', padding:'32px', background: colors.bg, border:'2px dashed '+colors.border, borderRadius:'12px', marginBottom:'16px' }}>
              <div style={{ fontSize:'48px', marginBottom:'12px' }}>📄</div>
              <div style={{ fontSize:'13px', color: colors.textMuted, marginBottom:'16px' }}>PDF, Word, Image — Analyse IA en 3 secondes</div>
              <Button onClick={() => window.open('/documents','_blank')}>📤 Scanner un document</Button>
            </div>
            <Button variant="secondary" onClick={() => setActiveTool(null)}>← Retour</Button>
          </div>
        )}

        {/* AI Coach */}
        {activeTool === 'ai' && (
          <div>
            <SectionTitle color="#a78bfa">🤖 AI Business Coach</SectionTitle>
            <div style={{ background: colors.bg, border:'1px solid '+colors.border, borderRadius:'12px', padding:'16px', marginBottom:'16px' }}>
              <div style={{ fontSize:'13px', color:'#c8d8f0', lineHeight:'1.7', marginBottom:'12px' }}>
                Analyse du contexte : <strong style={{ color: colors.text }}>{context}</strong> avec {withUser.name} ({withUser.country})
              </div>
              {[
                '✅ Trust Score élevé — deal à faible risque',
                '💡 Proposez un paiement en plusieurs tranches pour faciliter la décision',
                '📊 Prix dans la moyenne du marché — marge de négociation estimée 8-12%',
                '🎯 Moment idéal pour proposer un partenariat long terme',
                '⚡ Répondre dans les 2 prochaines heures — fenêtre optimale',
              ].map((tip,i) => (
                <div key={i} style={{ fontSize:'12px', color: colors.text, padding:'8px', background: colors.bgCard, borderRadius:'6px', marginBottom:'6px', lineHeight:'1.5' }}>
                  {tip}
                </div>
              ))}
            </div>
            <div style={{ display:'flex', gap:'10px' }}>
              <Button style={{ flex:1 }} onClick={() => window.open('/ai','_blank')}>🤖 Chat avec ORBIS AI</Button>
              <Button variant="secondary" onClick={() => setActiveTool(null)}>← Retour</Button>
            </div>
          </div>
        )}

        {/* Default tool handler */}
        {activeTool && !['speech','video','contract','escrow','document','ai'].includes(activeTool) && (
          <div style={{ textAlign:'center', padding:'40px' }}>
            <div style={{ fontSize:'48px', marginBottom:'16px' }}>{TOOLS.find(t=>t.id===activeTool)?.icon}</div>
            <div style={{ fontSize:'16px', fontWeight:'800', color: colors.text, marginBottom:'8px' }}>{TOOLS.find(t=>t.id===activeTool)?.label}</div>
            <div style={{ fontSize:'13px', color: colors.textMuted, marginBottom:'24px' }}>{TOOLS.find(t=>t.id===activeTool)?.desc}</div>
            <div style={{ display:'flex', gap:'10px', justifyContent:'center' }}>
              <Button onClick={() => alert(TOOLS.find(t=>t.id===activeTool)?.label + ' — activé !')}>Activer</Button>
              <Button variant="secondary" onClick={() => setActiveTool(null)}>← Retour</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
