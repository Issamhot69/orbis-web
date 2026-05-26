'use client'
import { useState } from 'react'
import { Card, Button, Badge, SectionTitle, colors } from './orbis-ui'

interface TrustTransactionProps {
  seller: { name: string, trust: number, verified: boolean, country: string }
  product: { name: string, price: number, currency?: string }
  onClose: () => void
  onConfirm: () => void
}

const STEPS = [
  { id:'verify',   icon:'🛂', label:'Verification',   desc:'Trust Passport vérifiée' },
  { id:'call',     icon:'📹', label:'Video Call',      desc:'Réunion de confirmation' },
  { id:'contract', icon:'📝', label:'Contrat',         desc:'Contrat auto-généré' },
  { id:'escrow',   icon:'🔒', label:'Escrow',          desc:'Paiement sécurisé' },
  { id:'delivery', icon:'🛰️', label:'Livraison',       desc:'Tracking satellite' },
  { id:'confirm',  icon:'✅', label:'Confirmation',    desc:'Libération paiement' },
]

export function TrustTransaction({ seller, product, onClose, onConfirm }: TrustTransactionProps) {
  const [step, setStep]         = useState(0)
  const [agreed, setAgreed]     = useState(false)
  const [callScheduled, setCallScheduled] = useState(false)
  const [contractSigned, setContractSigned] = useState(false)
  const [escrowLocked, setEscrowLocked]     = useState(false)

  const currentStep = STEPS[step]

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:'20px' }}>
      <Card style={{ width:'100%', maxWidth:'560px', padding:'28px' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px' }}>
          <div>
            <h2 style={{ margin:0, fontSize:'18px', fontWeight:'900', color: colors.text }}>Transaction ORBIS sécurisée</h2>
            <div style={{ fontSize:'12px', color: colors.textMuted, marginTop:'2px' }}>Processus de confiance en 6 étapes</div>
          </div>
          <button onClick={onClose} style={{ background:'transparent', border:'none', color: colors.textMuted, fontSize:'20px', cursor:'pointer' }}>✕</button>
        </div>

        {/* Progress Steps */}
        <div style={{ display:'flex', alignItems:'center', marginBottom:'28px', overflow:'auto' }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', flex: i < STEPS.length-1 ? 1 : 0 }}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'4px' }}>
                <div style={{ width:'36px', height:'36px', borderRadius:'50%', background: i < step ? colors.success : i === step ? colors.primary : colors.border, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', border: i === step ? '2px solid '+colors.primary : 'none', flexShrink:0 }}>
                  {i < step ? '✓' : s.icon}
                </div>
                <div style={{ fontSize:'9px', color: i <= step ? colors.text : colors.textMuted, fontWeight: i === step ? '700' : '400', textAlign:'center', maxWidth:'50px' }}>{s.label}</div>
              </div>
              {i < STEPS.length-1 && (
                <div style={{ flex:1, height:'2px', background: i < step ? colors.success : colors.border, margin:'0 4px', marginBottom:'16px' }}></div>
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <Card style={{ marginBottom:'20px', background: colors.bg }}>

          {step === 0 && (
            <div>
              <SectionTitle color={colors.success}>Vérification Trust Passport</SectionTitle>
              <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px' }}>
                <div style={{ width:'48px', height:'48px', borderRadius:'12px', background: colors.primary, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', fontWeight:'900', color:'#fff' }}>{seller.name[0]}</div>
                <div>
                  <div style={{ fontSize:'14px', fontWeight:'700' }}>{seller.country} {seller.name}</div>
                  <div style={{ fontSize:'12px', color: colors.textMuted }}>Trust Score: {seller.trust}/100</div>
                </div>
                {seller.verified && <Badge color="success">✓ Vérifié ORBIS</Badge>}
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'8px', marginBottom:'16px' }}>
                {['Identité vérifiée','Entreprise enregistrée','Historique transactions positif','Pas de litiges ouverts'].map((item,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'12px', color: colors.text }}>
                    <span style={{ color: colors.success }}>✓</span> {item}
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px', background:'rgba(0,200,150,0.08)', border:'1px solid '+colors.success, borderRadius:'8px' }}>
                <input type="checkbox" id="agree" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ width:'16px', height:'16px', cursor:'pointer' }}/>
                <label htmlFor="agree" style={{ fontSize:'12px', color: colors.text, cursor:'pointer' }}>J accepte les conditions générales ORBIS et confirme avoir vérifié le profil du vendeur</label>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <SectionTitle color={colors.info}>Video Call de confirmation</SectionTitle>
              <p style={{ fontSize:'13px', color:'#6a8aaa', lineHeight:'1.6', marginBottom:'16px' }}>
                Avant de finaliser la transaction, planifiez un appel vidéo avec {seller.name} pour confirmer les détails du produit, la qualité et les conditions de livraison.
              </p>
              {!callScheduled ? (
                <div style={{ display:'flex', gap:'10px' }}>
                  <Button onClick={() => setCallScheduled(true)} style={{ flex:1 }}>📹 Planifier maintenant</Button>
                  <Button variant="ghost" onClick={() => setCallScheduled(true)} style={{ flex:1 }}>⏭️ Passer cette étape</Button>
                </div>
              ) : (
                <div style={{ padding:'12px', background:'rgba(0,200,150,0.08)', border:'1px solid '+colors.success, borderRadius:'8px', fontSize:'12px', color: colors.success }}>
                  ✅ Video call planifié — vous recevrez une invitation par email
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div>
              <SectionTitle color={colors.warning}>Contrat auto-généré</SectionTitle>
              <div style={{ background: colors.bgCard, borderRadius:'8px', padding:'14px', marginBottom:'16px', border:'1px solid '+colors.border }}>
                <div style={{ fontSize:'12px', fontWeight:'700', color: colors.text, marginBottom:'10px' }}>Contrat de vente ORBIS</div>
                {[
                  ['Vendeur',    seller.name],
                  ['Produit',    product.name],
                  ['Montant',    (product.currency||'$')+product.price],
                  ['Paiement',   'Escrow ORBIS — libéré à la livraison'],
                  ['Juridiction','ORBIS Trust Network'],
                  ['Date',       new Date().toLocaleDateString('fr-FR')],
                ].map(([k,v]) => (
                  <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'5px 0', borderBottom:'1px solid '+colors.border, fontSize:'11px' }}>
                    <span style={{ color: colors.textMuted }}>{k}</span>
                    <span style={{ color: colors.text, fontWeight:'600' }}>{v}</span>
                  </div>
                ))}
              </div>
              {!contractSigned ? (
                <Button onClick={() => setContractSigned(true)} style={{ width:'100%' }}>✍️ Signer le contrat</Button>
              ) : (
                <div style={{ padding:'12px', background:'rgba(0,200,150,0.08)', border:'1px solid '+colors.success, borderRadius:'8px', fontSize:'12px', color: colors.success }}>
                  ✅ Contrat signé électroniquement — {new Date().toLocaleString('fr-FR')}
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div>
              <SectionTitle color={colors.warning}>Paiement Escrow sécurisé</SectionTitle>
              <p style={{ fontSize:'13px', color:'#6a8aaa', lineHeight:'1.6', marginBottom:'16px' }}>
                Votre paiement est bloqué dans l escrow ORBIS. Il sera libéré au vendeur uniquement après confirmation de réception de la marchandise.
              </p>
              <div style={{ background:'rgba(244,200,66,0.08)', border:'1px solid '+colors.warning, borderRadius:'10px', padding:'16px', marginBottom:'16px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
                  <span style={{ fontSize:'13px', color: colors.textMuted }}>Montant en escrow</span>
                  <span style={{ fontSize:'20px', fontWeight:'900', color: colors.warning }}>{(product.currency||'$')}{product.price}</span>
                </div>
                <div style={{ fontSize:'11px', color: colors.textMuted }}>Protégé par ORBIS Trust Network • Remboursement garanti en cas de litige</div>
              </div>
              {!escrowLocked ? (
                <div style={{ display:'flex', gap:'10px' }}>
                  <Button variant="success" onClick={() => setEscrowLocked(true)} style={{ flex:1 }}>🔒 Bloquer le paiement</Button>
                  <Button variant="ghost" style={{ flex:1 }}>💳 Choisir méthode</Button>
                </div>
              ) : (
                <div style={{ padding:'12px', background:'rgba(0,200,150,0.08)', border:'1px solid '+colors.success, borderRadius:'8px', fontSize:'12px', color: colors.success }}>
                  ✅ Paiement bloqué en escrow — vendeur notifié
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div>
              <SectionTitle color={colors.info}>Suivi satellite de livraison</SectionTitle>
              <div style={{ background: colors.bgCard, borderRadius:'10px', padding:'16px', marginBottom:'16px', border:'1px solid '+colors.border }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'12px' }}>
                  <span style={{ fontSize:'13px', color: colors.text, fontWeight:'700' }}>Numéro de suivi</span>
                  <span style={{ fontSize:'13px', color: colors.info, fontFamily:'monospace' }}>ORB-2026-{Math.floor(Math.random()*10000).toString().padStart(4,'0')}</span>
                </div>
                <div style={{ height:'6px', background: colors.border, borderRadius:'3px', marginBottom:'12px', overflow:'hidden' }}>
                  <div style={{ width:'40%', height:'100%', background: colors.info, borderRadius:'3px' }}></div>
                </div>
                {['Commande confirmée ✓','En préparation ✓','En transit ⏳','Livré'].map((s,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'5px 0', fontSize:'12px' }}>
                    <div style={{ width:'8px', height:'8px', borderRadius:'50%', background: i < 2 ? colors.success : i === 2 ? colors.warning : colors.border, flexShrink:0 }}></div>
                    <span style={{ color: i <= 2 ? colors.text : colors.textMuted }}>{s}</span>
                  </div>
                ))}
              </div>
              <Button variant="ghost" style={{ width:'100%' }} onClick={() => window.open('/tracking','_blank')}>
                🛰️ Voir suivi satellite complet
              </Button>
            </div>
          )}

          {step === 5 && (
            <div>
              <SectionTitle color={colors.success}>Confirmation de réception</SectionTitle>
              <p style={{ fontSize:'13px', color:'#6a8aaa', lineHeight:'1.6', marginBottom:'16px' }}>
                Confirmez la réception de la marchandise pour libérer le paiement escrow au vendeur.
              </p>
              <div style={{ display:'flex', flex:'column', gap:'12px', marginBottom:'16px' }}>
                {['Marchandise reçue','Qualité conforme','Quantité correcte','Emballage intact'].map((item,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px', background:'rgba(0,200,150,0.05)', border:'1px solid '+colors.border, borderRadius:'8px', marginBottom:'6px' }}>
                    <input type="checkbox" defaultChecked style={{ width:'16px', height:'16px' }}/>
                    <span style={{ fontSize:'13px', color: colors.text }}>{item}</span>
                  </div>
                ))}
              </div>
              <Button variant="success" onClick={onConfirm} style={{ width:'100%', padding:'14px', fontSize:'15px' }}>
                ✅ Confirmer et libérer le paiement
              </Button>
            </div>
          )}
        </Card>

        {/* Navigation */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <Button variant="secondary" onClick={() => step > 0 ? setStep(step-1) : onClose()}>
            {step === 0 ? '✕ Annuler' : '← Retour'}
          </Button>
          <span style={{ fontSize:'12px', color: colors.textMuted }}>Étape {step+1} / {STEPS.length}</span>
          {step < STEPS.length-1 && (
            <Button
              onClick={() => setStep(step+1)}
              disabled={step===0&&!agreed || step===2&&!contractSigned || step===3&&!escrowLocked}
            >
              Continuer →
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}
