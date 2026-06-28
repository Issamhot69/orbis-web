'use client'
import { useRouter } from 'next/navigation'

export default function TermsPage() {
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

      <h1 style={{ fontSize:'32px', fontWeight:'900', margin:'0 0 8px' }}>Conditions Generales d Utilisation</h1>
      <p style={{ fontSize:'13px', color:'#4a6fa5', margin:'0 0 32px' }}>Derniere mise a jour : 28 juin 2026 — ORBIS Inc, Delaware, USA</p>

      {[
        {
          title:'1. Acceptation des conditions',
          content:'En utilisant ORBIS, vous acceptez les presentes Conditions Generales d Utilisation. Si vous n acceptez pas ces conditions, vous ne devez pas utiliser la plateforme. Ces conditions constituent un contrat juridiquement contraignant entre vous et ORBIS Inc.'
        },
        {
          title:'2. Description du service',
          content:'ORBIS est une plateforme B2B mondiale qui combine : Business OS (gestion de projets, messages, reunions, memoire IA), Marketplace B2B (services, produits en gros, developpeurs, investisseurs), Outils IA (Speech-to-Speech, Trust Passport, contrats automatiques, escrow, tracking satellite).'
        },
        {
          title:'3. Eligibilite',
          content:'Pour utiliser ORBIS, vous devez : avoir au moins 18 ans, etre capable de conclure des contrats juridiquement contraignants, representer une entreprise ou agir en votre nom propre a des fins professionnelles, ne pas etre interdit d utiliser le service par les lois applicables.'
        },
        {
          title:'4. Compte utilisateur',
          content:'Vous etes responsable de : maintenir la confidentialite de vos identifiants, toutes les activites effectuees sous votre compte, notifier immediatement ORBIS en cas d utilisation non autorisee (security@orbis.app). ORBIS se reserve le droit de suspendre tout compte en cas de violation des presentes conditions.'
        },
        {
          title:'5. Utilisation acceptable',
          content:'Vous vous engagez a ne pas : publier du contenu illegal, frauduleux ou trompeur, usurper l identite d une autre personne ou entreprise, tenter de contourner les mesures de securite, utiliser ORBIS pour du spam ou du phishing, revendre l acces a ORBIS sans autorisation, utiliser des bots ou scrapers automatises.'
        },
        {
          title:'6. Transactions et paiements',
          content:'ORBIS facilite les transactions B2B via son systeme Escrow securise. Les frais de transaction sont de 2.5% du montant. Les abonnements (Pro $49/mois, Enterprise $199/mois) sont factures mensuellement via Stripe. Aucun remboursement n est possible apres utilisation du service. En cas de litige, ORBIS peut arbitrer via son systeme de resolution IA.'
        },
        {
          title:'7. Trust Passport et verification',
          content:'Le systeme Trust Passport ORBIS fournit des scores de confiance bases sur les informations fournies par les utilisateurs. ORBIS ne garantit pas l exactitude de ces scores. Les utilisateurs sont responsables de verifier l identite de leurs partenaires commerciaux avant toute transaction significative.'
        },
        {
          title:'8. Contenu utilisateur',
          content:'Vous conservez la propriete de votre contenu. En le publiant sur ORBIS, vous accordez une licence mondiale, non exclusive, pour l afficher et le diffuser sur la plateforme. ORBIS peut supprimer tout contenu violant ces conditions sans preavis.'
        },
        {
          title:'9. Propriete intellectuelle',
          content:'La marque ORBIS, le logo, le design et le code source sont la propriete exclusive de ORBIS Inc. Toute reproduction, copie ou utilisation sans autorisation expresse est interdite. Le SDK ORBIS est disponible sous licence MIT.'
        },
        {
          title:'10. Limitation de responsabilite',
          content:'ORBIS est fourni "en l etat" sans garantie. ORBIS Inc ne peut etre tenu responsable des pertes de donnees, des interruptions de service, des transactions entre utilisateurs, des dommages indirects ou consequents. Notre responsabilite maximale est limitee aux frais payes au cours des 3 derniers mois.'
        },
        {
          title:'11. Resiliation',
          content:'Vous pouvez resilier votre compte a tout moment via Parametres > Zone de danger. ORBIS peut resilier votre compte en cas de violation des presentes conditions, avec ou sans preavis. En cas de resiliation, vos donnees sont supprimees dans les 30 jours.'
        },
        {
          title:'12. Droit applicable',
          content:'Ces conditions sont regies par les lois de l Etat du Delaware, USA. Tout litige sera soumis a la juridiction exclusive des tribunaux du Delaware. Les utilisateurs de l UE beneficient egalement des protections prevues par le droit europeen applicable.'
        },
        {
          title:'13. Contact',
          content:'ORBIS Inc — 1209 Orange Street, Wilmington, Delaware 19801, USA. Email legal : legal@orbis.app — Support : support@orbis.app'
        },
      ].map((section, i) => (
        <div key={i} style={{ marginBottom:'24px', padding:'20px', background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'12px' }}>
          <h2 style={{ fontSize:'16px', fontWeight:'800', color:'#3C3B6E', margin:'0 0 10px' }}>{section.title}</h2>
          <p style={{ fontSize:'13px', color:'#c8d8f0', lineHeight:'1.8', margin:0 }}>{section.content}</p>
        </div>
      ))}

      <div style={{ padding:'20px', background:'rgba(60,59,110,0.15)', border:'1px solid #3C3B6E', borderRadius:'12px', textAlign:'center', marginTop:'32px' }}>
        <div style={{ fontSize:'13px', color:'#a78bfa', fontWeight:'700', marginBottom:'8px' }}>Questions juridiques ?</div>
        <div style={{ fontSize:'13px', color:'#4a6fa5' }}>legal@orbis.app — ORBIS Inc, Delaware, USA</div>
      </div>
    </div>
  )
}
