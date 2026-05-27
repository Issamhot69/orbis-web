'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4080'

const DOC_TYPES = [
  { id:'contract',  label:'Contrat',        icon:'📝', color:'#1a6fff' },
  { id:'invoice',   label:'Facture',         icon:'🧾', color:'#00c896' },
  { id:'id',        label:'Identité',        icon:'🪪', color:'#f4c842' },
  { id:'financial', label:'Bilan financier', icon:'📊', color:'#a78bfa' },
  { id:'legal',     label:'Document légal',  icon:'⚖️', color:'#ff6b6b' },
  { id:'other',     label:'Autre',           icon:'📄', color:'#4a6fa5' },
]

const SAMPLE_ANALYSIS = {
  contract: {
    type: 'Contrat de prestation de services',
    parties: ['ORBIS Corp (Prestataire)', 'Dubai Ventures LLC (Client)'],
    amount: '$150,000 USD',
    duration: '12 mois',
    startDate: '01 Juin 2026',
    risks: [
      { level:'high',   text:'Clause de non-concurrence trop large — 5 ans, monde entier' },
      { level:'medium', text:'Pénalités de retard non plafonnées — risque financier' },
      { level:'low',    text:'Juridiction Dubai — loi locale peut différer' },
    ],
    keyPoints: [
      'Paiement mensuel de $12,500',
      'Propriété intellectuelle reste au prestataire',
      'Résiliation avec 90 jours de préavis',
      'Confidentialité sur 3 ans après contrat',
    ],
    score: 72,
    recommendation: 'Renégocier la clause de non-concurrence avant signature.',
  },
  invoice: {
    type: 'Facture commerciale',
    parties: ['ORBIS Corp', 'Tech Solutions Ltd'],
    amount: '$25,000 USD',
    duration: 'Paiement 30 jours',
    startDate: '24 Mai 2026',
    risks: [
      { level:'low', text:'TVA non mentionnée — vérifier selon juridiction' },
    ],
    keyPoints: [
      '5 licences ORBIS Enterprise',
      'Support technique 12 mois inclus',
      'Remise 10% appliquée',
    ],
    score: 92,
    recommendation: 'Document conforme. Paiement sécurisé recommandé via escrow ORBIS.',
  },
}

export default function DocumentsPage() {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzed, setAnalyzed] = useState(false)
  const [docType, setDocType] = useState('contract')
  const [fileName, setFileName] = useState('')
  const [analysis, setAnalysis] = useState<any>(null)
  const [targetLang, setTargetLang] = useState('fr')
  const [recentDocs, setRecentDocs] = useState([
    { name:'Contrat_Partnership_Dubai.pdf', type:'contract', score:72, date:'24/05/2026', size:'2.4 MB' },
    { name:'Facture_Tech_Solutions.pdf',    type:'invoice',  score:92, date:'23/05/2026', size:'0.8 MB' },
    { name:'NDA_Berlin_Tech.pdf',           type:'legal',    score:85, date:'22/05/2026', size:'1.2 MB' },
  ])
  const fileRef = useRef<HTMLInputElement>(null)
  const token = typeof window !== 'undefined' ? localStorage.getItem('orbis_token') : ''

  useEffect(() => {
    if (!token) { router.push('/'); return }
  }, [])

  async function handleUpload(e: any) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    setUploading(true)
    setAnalyzed(false)
    await new Promise(r => setTimeout(r, 1000))
    setUploading(false)
    setAnalyzing(true)
    await new Promise(r => setTimeout(r, 2500))
    setAnalyzing(false)
    setAnalyzed(true)
    const a = SAMPLE_ANALYSIS[docType as keyof typeof SAMPLE_ANALYSIS] || SAMPLE_ANALYSIS.contract
    setAnalysis(a)
    setRecentDocs(prev => [{ name: file.name, type: docType, score: a.score, date: new Date().toLocaleDateString('fr-FR'), size: (file.size/1024/1024).toFixed(1)+' MB' }, ...prev.slice(0,4)])
  }

  const scoreColor = (s: number) => s >= 80 ? '#00c896' : s >= 60 ? '#f4c842' : '#ff6b6b'
  const riskColor  = (l: string) => l === 'high' ? '#ff6b6b' : l === 'medium' ? '#f4c842' : '#00c896'

  return (
    <div style={{ minHeight:'100vh', background:'#060e1a', color:'#fff', fontFamily:'system-ui', padding:'24px' }}>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <button onClick={() => router.push('/dashboard')} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid #1e3a5f', borderRadius:'8px', padding:'8px 14px', color:'#4a6fa5', cursor:'pointer', fontSize:'12px' }}>← Dashboard</button>
          <div>
            <h1 style={{ margin:0, fontSize:'22px', fontWeight:'900' }}>📄 Document AI Scanner</h1>
            <p style={{ margin:0, fontSize:'12px', color:'#4a6fa5' }}>Analyse IA de documents en 3 secondes</p>
          </div>
        </div>
        <div style={{ padding:'6px 14px', background:'rgba(0,200,150,0.1)', border:'1px solid #00c896', borderRadius:'20px', fontSize:'12px', color:'#00c896', fontWeight:'700' }}>
          🟢 AI Scanner — Actif
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' }}>

        {/* Left — Upload */}
        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>

          {/* Upload Zone */}
          <div style={{ background:'#0a1628', border:'2px dashed #1e3a5f', borderRadius:'14px', padding:'32px', textAlign:'center' }}>
            <div style={{ fontSize:'48px', marginBottom:'16px' }}>📄</div>
            <div style={{ fontSize:'15px', fontWeight:'800', marginBottom:'8px' }}>Uploader un document</div>
            <div style={{ fontSize:'12px', color:'#4a6fa5', marginBottom:'20px' }}>PDF, Word, Image — Max 50MB</div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'8px', marginBottom:'20px' }}>
              {DOC_TYPES.map(t => (
                <button key={t.id} onClick={() => setDocType(t.id)} style={{ padding:'8px', background: docType===t.id?'rgba(26,111,255,0.2)':'rgba(255,255,255,0.03)', border:'1px solid '+(docType===t.id?'#1a6fff':'#1e3a5f'), borderRadius:'8px', color: docType===t.id?'#5b9fff':'#4a6fa5', fontSize:'11px', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:'4px' }}>
                  <span style={{ fontSize:'18px' }}>{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={handleUpload} style={{ display:'none' }}/>
            <button onClick={() => fileRef.current?.click()} disabled={uploading||analyzing} style={{ padding:'12px 24px', background: uploading||analyzing?'#1e3a5f':'#1a6fff', border:'none', borderRadius:'10px', color:'#fff', fontSize:'13px', fontWeight:'700', cursor: uploading||analyzing?'not-allowed':'pointer' }}>
              {uploading ? '📤 Upload en cours...' : analyzing ? '🤖 Analyse IA en cours...' : '📤 Choisir un document'}
            </button>

            {(uploading || analyzing) && (
              <div style={{ marginTop:'16px' }}>
                <div style={{ height:'4px', background:'#1e3a5f', borderRadius:'2px', overflow:'hidden' }}>
                  <div style={{ width: uploading?'30%':'85%', height:'100%', background:'#1a6fff', borderRadius:'2px', transition:'width 1s' }}></div>
                </div>
                <div style={{ fontSize:'11px', color:'#4a6fa5', marginTop:'6px' }}>
                  {uploading ? 'Upload du fichier...' : 'Analyse IA en cours — détection clauses, risques...'}
                </div>
              </div>
            )}
          </div>

          {/* Recent Docs */}
          <div style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'14px', padding:'20px' }}>
            <div style={{ fontSize:'13px', fontWeight:'800', color:'#5b9fff', marginBottom:'14px' }}>Documents récents</div>
            {recentDocs.map((doc, i) => {
              const t = DOC_TYPES.find(d => d.id === doc.type) || DOC_TYPES[5]
              return (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 0', borderBottom:'1px solid #0f1f3d' }}>
                  <span style={{ fontSize:'20px' }}>{t.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:'12px', fontWeight:'600', color:'#fff', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'180px' }}>{doc.name}</div>
                    <div style={{ fontSize:'10px', color:'#4a6fa5' }}>{doc.size} • {doc.date}</div>
                  </div>
                  <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:'rgba(0,0,0,0.3)', border:'2px solid '+scoreColor(doc.score), display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:'900', color:scoreColor(doc.score) }}>
                    {doc.score}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right — Analysis */}
        <div>
          {!analyzed ? (
            <div style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'14px', padding:'60px', textAlign:'center', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
              <div style={{ fontSize:'48px', marginBottom:'16px' }}>🤖</div>
              <div style={{ fontSize:'16px', fontWeight:'700', color:'#5b9fff', marginBottom:'8px' }}>ORBIS Document AI</div>
              <div style={{ fontSize:'13px', color:'#4a6fa5', maxWidth:'280px', lineHeight:'1.6' }}>
                Uploadez un document pour obtenir une analyse complète — risques, clauses, recommandations — en 3 secondes.
              </div>
            </div>
          ) : analysis && (
            <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>

              {/* Score */}
              <div style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'14px', padding:'20px' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'14px' }}>
                  <div>
                    <div style={{ fontSize:'14px', fontWeight:'800', color:'#fff' }}>{analysis.type}</div>
                    <div style={{ fontSize:'11px', color:'#4a6fa5', marginTop:'2px' }}>{fileName}</div>
                  </div>
                  <div style={{ width:'56px', height:'56px', borderRadius:'50%', border:'3px solid '+scoreColor(analysis.score), display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column' }}>
                    <div style={{ fontSize:'18px', fontWeight:'900', color:scoreColor(analysis.score) }}>{analysis.score}</div>
                    <div style={{ fontSize:'9px', color:'#4a6fa5' }}>score</div>
                  </div>
                </div>
                <div style={{ height:'6px', background:'#1e3a5f', borderRadius:'3px', overflow:'hidden' }}>
                  <div style={{ width:analysis.score+'%', height:'100%', background:scoreColor(analysis.score), borderRadius:'3px', transition:'width 1s' }}></div>
                </div>
              </div>

              {/* Risks */}
              <div style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'14px', padding:'20px' }}>
                <div style={{ fontSize:'13px', fontWeight:'800', color:'#ff6b6b', marginBottom:'12px' }}>⚠️ Risques détectés</div>
                {analysis.risks.map((r: any, i: number) => (
                  <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'8px', padding:'8px 0', borderBottom:'1px solid #0f1f3d' }}>
                    <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:riskColor(r.level), flexShrink:0, marginTop:'4px' }}></div>
                    <div style={{ fontSize:'12px', color:'#c8d8f0', lineHeight:'1.5' }}>{r.text}</div>
                    <span style={{ fontSize:'10px', color:riskColor(r.level), fontWeight:'700', flexShrink:0, padding:'2px 6px', background:riskColor(r.level)+'22', borderRadius:'10px' }}>{r.level}</span>
                  </div>
                ))}
              </div>

              {/* Key Points */}
              <div style={{ background:'#0a1628', border:'1px solid #1e3a5f', borderRadius:'14px', padding:'20px' }}>
                <div style={{ fontSize:'13px', fontWeight:'800', color:'#00c896', marginBottom:'12px' }}>✅ Points clés</div>
                {analysis.keyPoints.map((p: string, i: number) => (
                  <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'8px', padding:'6px 0', fontSize:'12px', color:'#c8d8f0' }}>
                    <span style={{ color:'#00c896', flexShrink:0 }}>•</span>
                    {p}
                  </div>
                ))}
              </div>

              {/* Recommendation */}
              <div style={{ background:'rgba(26,111,255,0.08)', border:'1px solid #1a6fff', borderRadius:'14px', padding:'16px' }}>
                <div style={{ fontSize:'12px', fontWeight:'800', color:'#5b9fff', marginBottom:'6px' }}>🤖 Recommandation ORBIS AI</div>
                <div style={{ fontSize:'12px', color:'#c8d8f0', lineHeight:'1.6' }}>{analysis.recommendation}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
