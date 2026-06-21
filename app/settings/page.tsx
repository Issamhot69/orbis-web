'use client'
import { useEffect, useState } from 'react'
import { PageLayout, Card, Button, Input, Badge, SectionTitle, colors } from '../components/orbis-ui'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4080'

export default function SettingsPage() {
  const [user, setUser]           = useState<any>(null)
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [savedMsg, setSavedMsg]   = useState('')
  const [form, setForm]           = useState({ firstName:'', lastName:'' })
  const [pwForm, setPwForm]       = useState({ currentPassword:'', newPassword:'', confirmPassword:'' })
  const [pwSaving, setPwSaving]   = useState(false)
  const [pwMsg, setPwMsg]         = useState('')
  const [pwError, setPwError]     = useState('')
  const token = typeof window !== 'undefined' ? localStorage.getItem('orbis_token') : ''

  useEffect(() => { if (token) fetchProfile() }, [])

  async function fetchProfile() {
    try {
      const res  = await fetch(API + '/api/auth/me', { headers:{ Authorization:'Bearer '+token } })
      const data = await res.json()
      setUser(data.user)
      setForm({ firstName: data.user?.firstName || '', lastName: data.user?.lastName || '' })
    } catch(e) {} finally { setLoading(false) }
  }

  async function saveProfile(e: any) {
    e.preventDefault()
    setSaving(true)
    setSavedMsg('')
    try {
      const res  = await fetch(API + '/api/auth/me', {
        method:'PATCH',
        headers:{ 'Content-Type':'application/json', Authorization:'Bearer '+token },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (res.status >= 400) throw new Error(data.error)
      setUser(data.user)
      setSavedMsg('Profil mis a jour avec succes')
      setTimeout(() => setSavedMsg(''), 3000)
    } catch(err: any) {
      setSavedMsg('Erreur: ' + err.message)
    } finally { setSaving(false) }
  }

  async function changePassword(e: any) {
    e.preventDefault()
    setPwError('')
    setPwMsg('')
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError('Les mots de passe ne correspondent pas')
      return
    }
    if (pwForm.newPassword.length < 6) {
      setPwError('Le mot de passe doit faire au moins 6 caracteres')
      return
    }
    setPwSaving(true)
    try {
      const res  = await fetch(API + '/api/auth/change-password', {
        method:'POST',
        headers:{ 'Content-Type':'application/json', Authorization:'Bearer '+token },
        body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword })
      })
      const data = await res.json()
      if (res.status >= 400) throw new Error(data.error)
      setPwMsg('Mot de passe modifie avec succes')
      setPwForm({ currentPassword:'', newPassword:'', confirmPassword:'' })
      setTimeout(() => setPwMsg(''), 3000)
    } catch(err: any) {
      setPwError(err.message)
    } finally { setPwSaving(false) }
  }

  if (loading) {
    return (
      <PageLayout title="⚙️ Parametres" subtitle="Gerez votre profil ORBIS">
        <div style={{ textAlign:'center', color: colors.textMuted, padding:'60px' }}>Chargement...</div>
      </PageLayout>
    )
  }

  return (
    <PageLayout title="⚙️ Parametres" subtitle="Gerez votre profil ORBIS">
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' }}>

        {/* Profile */}
        <Card>
          <SectionTitle>Informations personnelles</SectionTitle>
          <div style={{ display:'flex', alignItems:'center', gap:'14px', marginBottom:'24px' }}>
            <div style={{ width:'64px', height:'64px', borderRadius:'16px', background:'linear-gradient(135deg,#B22234,#7a0f1e)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'26px', fontWeight:'900', color:'#fff' }}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div>
              <div style={{ fontSize:'15px', fontWeight:'800', color: colors.text }}>{user?.firstName} {user?.lastName}</div>
              <div style={{ fontSize:'12px', color: colors.textMuted }}>{user?.email}</div>
              {user?.isVerified && <Badge color="success">✓ Verifie</Badge>}
            </div>
          </div>
          <form onSubmit={saveProfile} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            <Input label="Prenom" value={form.firstName} onChange={v => setForm(f=>({...f,firstName:v}))} placeholder="Prenom"/>
            <Input label="Nom" value={form.lastName} onChange={v => setForm(f=>({...f,lastName:v}))} placeholder="Nom"/>
            <Input label="Email" value={user?.email || ''} onChange={()=>{}} placeholder=""/>
            <div style={{ fontSize:'11px', color: colors.textMuted, marginTop:'-8px' }}>L email ne peut pas etre modifie</div>
            {savedMsg && (
              <div style={{ padding:'10px', background: savedMsg.startsWith('Erreur')?'rgba(255,107,107,0.1)':'rgba(0,200,150,0.1)', border:'1px solid '+(savedMsg.startsWith('Erreur')?colors.danger:colors.success), borderRadius:'8px', color: savedMsg.startsWith('Erreur')?colors.danger:colors.success, fontSize:'12px' }}>
                {savedMsg}
              </div>
            )}
            <Button disabled={saving}>{saving ? 'Sauvegarde...' : 'Sauvegarder les modifications'}</Button>
          </form>
        </Card>

        {/* Password */}
        <Card>
          <SectionTitle color={colors.warning}>Securite — Changer le mot de passe</SectionTitle>
          <form onSubmit={changePassword} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            <Input label="Mot de passe actuel" type="password" value={pwForm.currentPassword} onChange={v => setPwForm(f=>({...f,currentPassword:v}))} placeholder="••••••••" required/>
            <Input label="Nouveau mot de passe" type="password" value={pwForm.newPassword} onChange={v => setPwForm(f=>({...f,newPassword:v}))} placeholder="••••••••" required/>
            <Input label="Confirmer le nouveau mot de passe" type="password" value={pwForm.confirmPassword} onChange={v => setPwForm(f=>({...f,confirmPassword:v}))} placeholder="••••••••" required/>
            {pwError && (
              <div style={{ padding:'10px', background:'rgba(255,107,107,0.1)', border:'1px solid '+colors.danger, borderRadius:'8px', color: colors.danger, fontSize:'12px' }}>{pwError}</div>
            )}
            {pwMsg && (
              <div style={{ padding:'10px', background:'rgba(0,200,150,0.1)', border:'1px solid '+colors.success, borderRadius:'8px', color: colors.success, fontSize:'12px' }}>{pwMsg}</div>
            )}
            <Button variant="danger" disabled={pwSaving}>{pwSaving ? 'Modification...' : 'Changer le mot de passe'}</Button>
          </form>

          <div style={{ marginTop:'24px', paddingTop:'20px', borderTop:'1px solid '+colors.border }}>
            <SectionTitle color={colors.danger}>Zone de danger</SectionTitle>
            <p style={{ fontSize:'12px', color: colors.textMuted, marginBottom:'12px' }}>
              La suppression de compte est definitive et supprime toutes vos donnees ORBIS.
            </p>
            <Button variant="danger" onClick={() => alert('Contactez support@orbis.app pour supprimer votre compte')}>
              Supprimer mon compte
            </Button>
          </div>
        </Card>
      </div>
    </PageLayout>
  )
}
