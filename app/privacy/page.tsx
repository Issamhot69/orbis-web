'use client'
import { useRouter } from 'next/navigation'

export default function PrivacyPage() {
  const router = useRouter()
  return (
    <div style={{ minHeight:'100vh', background:'#060e1a', color:'#fff', fontFamily:'system-ui', padding:'40px 24px', maxWidth:'800px', margin:'0 auto' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'32px' }}>
        <button onClick={() => router.back()} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid #1e3a5f', borderRadius:'8px', padding:'8px 14px', color:'#4a6fa5', cursor:'pointer', fontSize:'12px' }}>
          ← Retour
        </button>
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <div style={{ width:'28px', height:'28px', borderRadius:'8px', background:'#B22234', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', fontWeight:'900', color:'#fff' }}>◎</div>
          <span style={{ fontSize:'16px', fontWeight:'900' }}>ORBIS</span>
        </div>
      </div>

      <h1 style={{ fontSize:'32px', fontWeight:'900', margin:'0 0 8px' }}>Politique de Confidentialite</h1>
      <p style={{ fontSize:'13px', color:'#4a6fa5', margin:'0 0 32px' }}>Derniere mise a jour : 28 juin 2026 — ORBIS Inc, Delaware, USA</p>

      {[
        {
          title:'1. Qui sommes-nous ?',
          content:'ORBIS Inc est une societe incorporee dans le Delaware, USA. Nous exploitons la plateforme ORBIS — une plateforme B2B mondiale combinant Business OS et Marketplace IA. Contact : privacy@orbis.app'
        },
        {
          title:'2. Donnees que nous collectons',
          content:'Nous collectons : (a) Donnees de compte : nom, email, mot de passe chiffre, photo de profil. (b) Donnees business : organisations, projets, contrats, opportunites. (c) Donnees de communication : messages, reunions, fichiers partages. (d) Donnees techniques : adresse IP, navigateur, logs de connexion. (e) Donnees de paiement : traitees par Stripe — ORBIS ne stocke pas vos numeros de carte.'
        },
        {
          title:'3. Comment nous utilisons vos donnees',
          content:'Vos donnees sont utilisees pour : fournir et ameliorer les services ORBIS, personnaliser votre experience via notre IA, assurer la securite de la plateforme, traiter vos paiements, vous envoyer des notifications de service, respecter nos obligations legales. Nous ne vendons jamais vos donnees a des tiers.'
        },
        {
          title:'4. Base legale (RGPD)',
          content:'Nous traitons vos donnees sur les bases legales suivantes : (a) Execution du contrat : pour fournir les services auxquels vous avez souscrit. (b) Consentement : pour les communications marketing (retirable a tout moment). (c) Interet legitime : pour la securite et la prevention de la fraude. (d) Obligation legale : pour respecter les lois applicables.'
        },
        {
          title:'5. Partage des donnees',
          content:'Nous partageons vos donnees uniquement avec : (a) Prestataires de services : Stripe (paiements), Anthropic (IA), Vercel (hebergement), Railway (infrastructure). (b) Partenaires commerciaux : uniquement avec votre consentement explicite via les fonctionnalites de matching ORBIS. (c) Autorites legales : si requis par la loi ou pour proteger nos droits.'
        },
        {
          title:'6. Vos droits (RGPD)',
          content:'Si vous etes resident de l UE, vous avez le droit de : Acceder a vos donnees personnelles. Rectifier les donnees inexactes. Supprimer vos donnees (droit a l oubli). Limiter ou vous opposer au traitement. Portabilite de vos donnees. Retirer votre consentement a tout moment. Pour exercer ces droits : privacy@orbis.app'
        },
        {
          title:'7. Conservation des donnees',
          content:'Nous conservons vos donnees aussi longtemps que votre compte est actif. En cas de suppression de compte, vos donnees sont supprimees dans les 30 jours, sauf obligation legale contraire (comptabilite : 7 ans).'
        },
        {
          title:'8. Securite',
          content:'ORBIS met en oeuvre des mesures de securite robustes : chiffrement SSL/TLS, hashage des mots de passe (bcrypt), authentification 2FA, rate limiting et detection de fraude IA, logs d audit, acces aux donnees restreint au personnel autorise.'
        },
        {
          title:'9. Cookies',
          content:'ORBIS utilise uniquement des cookies essentiels au fonctionnement de la plateforme (session, authentification). Nous n utilisons pas de cookies publicitaires ou de tracking tiers.'
        },
        {
          title:'10. Transferts internationaux',
          content:'ORBIS Inc est base aux USA. Vos donnees peuvent etre transferees et traitees aux Etats-Unis et dans d autres pays. Ces transferts sont encadres par des garanties appropriees conformes au RGPD (clauses contractuelles standard).'
        },
        {
          title:'11. Modifications',
          content:'Nous pouvons modifier cette politique a tout moment. En cas de changement significatif, nous vous informerons par email ou notification dans l application au moins 30 jours avant l entree en vigueur.'
        },
        {
          title:'12. Contact',
          content:'Pour toute question relative a votre vie privee : Email : privacy@orbis.app — Adresse : ORBIS Inc, 1209 Orange Street, Wilmington, Delaware 19801, USA'
        },
      ].map((section, i) => (
        <div key={i} style={{ marginBottom:'24px', padding:'20px', background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'12px' }}>
          <h2 style={{ fontSize:'16px', fontWeight:'800', color:'#B22234', margin:'0 0 10px' }}>{section.title}</h2>
          <p style={{ fontSize:'13px', color:'#c8d8f0', lineHeight:'1.8', margin:0 }}>{section.content}</p>
        </div>
      ))}

      <div style={{ padding:'20px', background:'rgba(178,34,52,0.08)', border:'1px solid #B22234', borderRadius:'12px', textAlign:'center', marginTop:'32px' }}>
        <div style={{ fontSize:'13px', color:'#B22234', fontWeight:'700', marginBottom:'8px' }}>Questions sur votre vie privee ?</div>
        <div style={{ fontSize:'13px', color:'#4a6fa5' }}>privacy@orbis.app — ORBIS Inc, Delaware, USA</div>
      </div>
    </div>
  )
}
