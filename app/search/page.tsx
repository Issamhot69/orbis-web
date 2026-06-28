'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PageLayout, Card, Badge, colors } from '../components/orbis-ui'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4080'

function SearchResults() {
  const router  = useRouter()
  const params  = useSearchParams()
  const q       = params.get('q') || ''
  const [query, setQuery]   = useState(q)
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const token = typeof window !== 'undefined' ? localStorage.getItem('orbis_token') : ''

  async function search(searchQuery: string) {
    if (!searchQuery.trim() || !token) return
    setLoading(true)
    try {
      const headers = { Authorization: 'Bearer ' + token }
      const api = API
      const [orgs, projects, listings, opps] = await Promise.all([
        fetch(api + '/api/organizations', { headers }).then(r => r.json()),
        fetch(api + '/api/projects', { headers }).then(r => r.json()),
        fetch(api + '/api/marketplace/listings?search=' + searchQuery, { headers }).then(r => r.json()),
        fetch(api + '/api/opportunity', { headers }).then(r => r.json()),
      ])
      const q = searchQuery.toLowerCase()
      setResults({
        organizations: (orgs.organizations || []).filter((o: any) => (o.org?.name || o.name || '').toLowerCase().includes(q)),
        projects:      (projects.projects || []).filter((p: any) => p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)),
        listings:      (listings.listings || []).filter((l: any) => l.title?.toLowerCase().includes(q) || l.description?.toLowerCase().includes(q)),
        opportunities: (opps.opportunities || []).filter((o: any) => o.title?.toLowerCase().includes(q)),
      })
    } catch(e) {} finally { setLoading(false) }
  }

  const total = Object.values(results).reduce((s: number, arr: any) => s + (arr?.length || 0), 0)

  return (
    <PageLayout title="🔍 Recherche globale" subtitle="Cherchez dans toute la plateforme ORBIS">
      <div style={{ display:'flex', gap:'10px', marginBottom:'24px' }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search(query)}
          placeholder="Rechercher organisations, projets, listings, opportunites..."
          style={{ flex:1, padding:'14px 20px', background: colors.bgCard, border:'1px solid '+colors.border, borderRadius:'10px', color: colors.text, fontSize:'14px', outline:'none' }}
          autoFocus
        />
        <button onClick={() => search(query)} style={{ padding:'14px 24px', background:'#B22234', border:'none', borderRadius:'10px', color:'#fff', fontSize:'14px', fontWeight:'700', cursor:'pointer' }}>
          {loading ? '...' : 'Rechercher'}
        </button>
      </div>

      {total > 0 && (
        <div style={{ fontSize:'13px', color: colors.textMuted, marginBottom:'16px' }}>
          {total} resultat{total > 1 ? 's' : ''} pour "{query}"
        </div>
      )}

      {results.organizations?.length > 0 && (
        <Card style={{ marginBottom:'16px' }}>
          <div style={{ fontSize:'12px', fontWeight:'700', color: colors.primary, marginBottom:'12px', textTransform:'uppercase', letterSpacing:'1px' }}>🏢 Organisations ({results.organizations.length})</div>
          {results.organizations.map((o: any, i: number) => (
            <div key={i} onClick={() => router.push('/organizations')} style={{ padding:'10px', borderBottom:'1px solid '+colors.border, cursor:'pointer', display:'flex', alignItems:'center', gap:'10px' }}>
              <div style={{ width:'32px', height:'32px', borderRadius:'8px', background:'#B22234', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', fontWeight:'900', color:'#fff' }}>{(o.org?.name || o.name || '?')[0]}</div>
              <div>
                <div style={{ fontSize:'13px', fontWeight:'700', color: colors.text }}>{o.org?.name || o.name}</div>
                <div style={{ fontSize:'11px', color: colors.textMuted }}>{o.org?.industry || o.industry || 'Organisation'}</div>
              </div>
              <div style={{ marginLeft:'auto' }}><Badge color='info'>{o.role || 'member'}</Badge></div>
            </div>
          ))}
        </Card>
      )}

      {results.projects?.length > 0 && (
        <Card style={{ marginBottom:'16px' }}>
          <div style={{ fontSize:'12px', fontWeight:'700', color: colors.success, marginBottom:'12px', textTransform:'uppercase', letterSpacing:'1px' }}>📁 Projets ({results.projects.length})</div>
          {results.projects.map((p: any, i: number) => (
            <div key={i} onClick={() => router.push('/projects')} style={{ padding:'10px', borderBottom:'1px solid '+colors.border, cursor:'pointer' }}>
              <div style={{ fontSize:'13px', fontWeight:'700', color: colors.text }}>{p.name}</div>
              <div style={{ fontSize:'11px', color: colors.textMuted }}>{p.description || 'Projet'}</div>
            </div>
          ))}
        </Card>
      )}

      {results.listings?.length > 0 && (
        <Card style={{ marginBottom:'16px' }}>
          <div style={{ fontSize:'12px', fontWeight:'700', color: colors.warning, marginBottom:'12px', textTransform:'uppercase', letterSpacing:'1px' }}>🛒 Marketplace ({results.listings.length})</div>
          {results.listings.map((l: any, i: number) => (
            <div key={i} onClick={() => router.push('/marketplace')} style={{ padding:'10px', borderBottom:'1px solid '+colors.border, cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontSize:'13px', fontWeight:'700', color: colors.text }}>{l.title}</div>
                <div style={{ fontSize:'11px', color: colors.textMuted }}>{l.type} • ${l.price}</div>
              </div>
              <Badge color="success">${Number(l.price).toLocaleString()}</Badge>
            </div>
          ))}
        </Card>
      )}

      {results.opportunities?.length > 0 && (
        <Card style={{ marginBottom:'16px' }}>
          <div style={{ fontSize:'12px', fontWeight:'700', color: colors.info, marginBottom:'12px', textTransform:'uppercase', letterSpacing:'1px' }}>💡 Opportunites ({results.opportunities.length})</div>
          {results.opportunities.map((o: any, i: number) => (
            <div key={i} onClick={() => router.push('/opportunities')} style={{ padding:'10px', borderBottom:'1px solid '+colors.border, cursor:'pointer' }}>
              <div style={{ fontSize:'13px', fontWeight:'700', color: colors.text }}>{o.title}</div>
              <div style={{ fontSize:'11px', color: colors.textMuted }}>{o.stage || 'Opportunite'}</div>
            </div>
          ))}
        </Card>
      )}

      {!loading && query && total === 0 && (
        <Card style={{ textAlign:'center', padding:'60px' }}>
          <div style={{ fontSize:'48px', marginBottom:'16px' }}>🔍</div>
          <div style={{ fontSize:'16px', fontWeight:'700', color: colors.text, marginBottom:'8px' }}>Aucun resultat pour "{query}"</div>
          <div style={{ fontSize:'13px', color: colors.textMuted }}>Essayez avec des termes differents</div>
        </Card>
      )}

      {!query && (
        <Card style={{ textAlign:'center', padding:'60px' }}>
          <div style={{ fontSize:'48px', marginBottom:'16px' }}>🔍</div>
          <div style={{ fontSize:'16px', fontWeight:'700', color: colors.text, marginBottom:'8px' }}>Recherche globale ORBIS</div>
          <div style={{ fontSize:'13px', color: colors.textMuted }}>Tapez votre recherche et appuyez sur Entree</div>
        </Card>
      )}
    </PageLayout>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ minHeight:'100vh', background:'#060e1a' }}/>}>
      <SearchResults />
    </Suspense>
  )
}
