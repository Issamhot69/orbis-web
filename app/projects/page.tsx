'use client'
import { useEffect, useState } from 'react'
import { PageLayout, Card, Button, Input, Select, Badge, StatsGrid, EmptyState, SectionTitle, colors } from '../components/orbis-ui'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4080'

const PRIORITIES: any = {
  high:   { label:'Haute',   color: colors.danger },
  medium: { label:'Moyenne', color: colors.warning },
  low:    { label:'Faible',  color: colors.success },
}

const STATUSES: any = {
  todo:        { label:'A faire',  color: colors.textMuted },
  'in-progress':{ label:'En cours', color: colors.warning },
  done:        { label:'Termine',  color: colors.success },
}

export default function ProjectsPage() {
  const [projects, setProjects]       = useState<any[]>([])
  const [selected, setSelected]       = useState<any>(null)
  const [tasks, setTasks]             = useState<any[]>([])
  const [loading, setLoading]         = useState(true)
  const [showForm, setShowForm]       = useState(false)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [orgs, setOrgs]               = useState<any[]>([])
  const [form, setForm]               = useState({ name:'', description:'', orgId:'' })
  const [taskForm, setTaskForm]       = useState({ title:'', description:'', priority:'medium' })
  const token = typeof window !== 'undefined' ? localStorage.getItem('orbis_token') : ''

  useEffect(() => {
    if (!token) return
    fetchProjects()
    fetchOrgs()
  }, [])

  async function fetchProjects() {
    try {
      const res  = await fetch(API + '/api/projects', { headers:{ Authorization:'Bearer '+token } })
      const data = await res.json()
      setProjects(data.projects || [])
    } catch(e) {} finally { setLoading(false) }
  }

  async function fetchOrgs() {
    try {
      const res  = await fetch(API + '/api/organizations', { headers:{ Authorization:'Bearer '+token } })
      const data = await res.json()
      setOrgs(data.organizations || [])
    } catch(e) {}
  }

  async function fetchTasks(projectId: string) {
    try {
      const res  = await fetch(API + '/api/projects/' + projectId + '/tasks', { headers:{ Authorization:'Bearer '+token } })
      const data = await res.json()
      setTasks(data.tasks || [])
    } catch(e) {}
  }

  async function createProject(e: any) {
    e.preventDefault()
    try {
      const res  = await fetch(API + '/api/projects', {
        method:'POST',
        headers:{ 'Content-Type':'application/json', Authorization:'Bearer '+token },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (res.status >= 400) throw new Error(data.error)
      setProjects(prev => [...prev, data.project])
      setShowForm(false)
      setForm({ name:'', description:'', orgId:'' })
    } catch(err: any) { alert(err.message) }
  }

  async function createTask(e: any) {
    e.preventDefault()
    try {
      const res  = await fetch(API + '/api/projects/' + selected.id + '/tasks', {
        method:'POST',
        headers:{ 'Content-Type':'application/json', Authorization:'Bearer '+token },
        body: JSON.stringify(taskForm)
      })
      const data = await res.json()
      if (res.status >= 400) throw new Error(data.error)
      setTasks(prev => [...prev, data.task])
      setShowTaskForm(false)
      setTaskForm({ title:'', description:'', priority:'medium' })
    } catch(err: any) { alert(err.message) }
  }

  async function updateTask(taskId: string, status: string) {
    try {
      await fetch(API + '/api/projects/' + selected.id + '/tasks/' + taskId, {
        method:'PATCH',
        headers:{ 'Content-Type':'application/json', Authorization:'Bearer '+token },
        body: JSON.stringify({ status })
      })
      setTasks(prev => prev.map(t => t.id === taskId ? {...t, status} : t))
    } catch(e) {}
  }

  function getOrgs() {
    return [{ value:'', label:'Sélectionner...' }, ...orgs.map((o:any) => ({ value: o.org?.id||o.id, label: o.org?.name||o.name }))]
  }

  return (
    <PageLayout
      title={selected ? '📁 '+selected.name : '📁 Projets'}
      subtitle={selected ? 'Tableau des tâches' : 'Gérez vos projets ORBIS'}
      action={
        <div style={{ display:'flex', gap:'10px' }}>
          {selected && <Button variant="secondary" onClick={() => setSelected(null)}>← Projets</Button>}
          <Button onClick={() => selected ? setShowTaskForm(true) : setShowForm(true)}>
            + {selected ? 'Nouvelle tâche' : 'Nouveau projet'}
          </Button>
        </div>
      }
    >
      {!selected ? (
        <>
          <StatsGrid stats={[
            { icon:'📁', label:'Total projets', value: projects.length,                                   color: colors.info },
            { icon:'✅', label:'Actifs',         value: projects.filter(p=>p.status==='active').length,   color: colors.success },
            { icon:'⏸️', label:'En pause',       value: projects.filter(p=>p.status==='paused').length,  color: colors.warning },
            { icon:'🏁', label:'Terminés',       value: projects.filter(p=>p.status==='completed').length, color: colors.textMuted },
          ]}/>

          {showForm && (
            <Card style={{ marginBottom:'24px' }}>
              <SectionTitle>Nouveau projet</SectionTitle>
              <form onSubmit={createProject} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
                <Input label="Nom *" value={form.name} onChange={v => setForm(f=>({...f,name:v}))} placeholder="Nom du projet" required/>
                <Select label="Organisation" value={form.orgId} onChange={v => setForm(f=>({...f,orgId:v}))} options={getOrgs()}/>
                <div style={{ gridColumn:'span 2' }}>
                  <Input label="Description" value={form.description} onChange={v => setForm(f=>({...f,description:v}))} placeholder="Description du projet"/>
                </div>
                <div style={{ gridColumn:'span 2', display:'flex', gap:'10px', justifyContent:'flex-end' }}>
                  <Button variant="secondary" onClick={() => setShowForm(false)}>Annuler</Button>
                  <Button>Créer</Button>
                </div>
              </form>
            </Card>
          )}

          {loading ? (
            <div style={{ textAlign:'center', color: colors.textMuted, padding:'60px' }}>Chargement...</div>
          ) : projects.length === 0 ? (
            <EmptyState icon="📁" title="Aucun projet" description="Créez votre premier projet ORBIS" action={<Button onClick={() => setShowForm(true)}>+ Créer maintenant</Button>}/>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'16px' }}>
              {projects.map((p:any, i) => (
                <Card key={i} onClick={() => { setSelected(p); fetchTasks(p.id) }} style={{ cursor:'pointer' }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' }}>
                    <div style={{ width:'40px', height:'40px', borderRadius:'10px', background:'linear-gradient(135deg,'+colors.success+',#007a4d)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px' }}>📁</div>
                    <Badge color="success">{p.status}</Badge>
                  </div>
                  <h3 style={{ margin:'0 0 4px', fontSize:'15px', fontWeight:'800', color: colors.text }}>{p.name}</h3>
                  <p style={{ margin:'0 0 12px', fontSize:'12px', color: colors.textMuted }}>{p.description || 'Pas de description'}</p>
                  <div style={{ borderTop:'1px solid '+colors.border, paddingTop:'10px', fontSize:'11px', color:'#2a4a7f' }}>
                    {new Date(p.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {showTaskForm && (
            <Card style={{ marginBottom:'24px' }}>
              <SectionTitle>Nouvelle tâche</SectionTitle>
              <form onSubmit={createTask} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
                <Input label="Titre *" value={taskForm.title} onChange={v => setTaskForm(f=>({...f,title:v}))} placeholder="Titre de la tâche" required/>
                <Select label="Priorité" value={taskForm.priority} onChange={v => setTaskForm(f=>({...f,priority:v}))} options={[{value:'low',label:'Faible'},{value:'medium',label:'Moyenne'},{value:'high',label:'Haute'}]}/>
                <div style={{ gridColumn:'span 2' }}>
                  <Input label="Description" value={taskForm.description} onChange={v => setTaskForm(f=>({...f,description:v}))} placeholder="Description"/>
                </div>
                <div style={{ gridColumn:'span 2', display:'flex', gap:'10px', justifyContent:'flex-end' }}>
                  <Button variant="secondary" onClick={() => setShowTaskForm(false)}>Annuler</Button>
                  <Button>Créer</Button>
                </div>
              </form>
            </Card>
          )}

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'16px' }}>
            {['todo','in-progress','done'].map(status => (
              <Card key={status}>
                <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'16px' }}>
                  <div style={{ width:'8px', height:'8px', borderRadius:'50%', background: STATUSES[status]?.color || colors.textMuted }}></div>
                  <span style={{ fontSize:'13px', fontWeight:'700', color: STATUSES[status]?.color, textTransform:'uppercase', letterSpacing:'1px' }}>
                    {STATUSES[status]?.label}
                  </span>
                  <span style={{ marginLeft:'auto', fontSize:'12px', color: colors.textMuted }}>{tasks.filter(t=>t.status===status).length}</span>
                </div>
                {tasks.filter(t=>t.status===status).map((task:any) => (
                  <div key={task.id} style={{ background: colors.bg, border:'1px solid '+colors.border, borderRadius:'10px', padding:'12px', marginBottom:'8px' }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'6px' }}>
                      <span style={{ fontSize:'13px', fontWeight:'600', color: colors.text }}>{task.title}</span>
                      <div style={{ width:'8px', height:'8px', borderRadius:'50%', background: PRIORITIES[task.priority]?.color || colors.textMuted }}></div>
                    </div>
                    {task.description && <p style={{ margin:'0 0 8px', fontSize:'11px', color: colors.textMuted }}>{task.description}</p>}
                    <select onChange={e => updateTask(task.id, e.target.value)} value={task.status} style={{ width:'100%', padding:'4px 8px', background: colors.bgCard, border:'1px solid '+colors.border, borderRadius:'6px', color: colors.textMuted, fontSize:'11px', cursor:'pointer' }}>
                      <option value="todo">A faire</option>
                      <option value="in-progress">En cours</option>
                      <option value="done">Terminé</option>
                    </select>
                  </div>
                ))}
                {tasks.filter(t=>t.status===status).length === 0 && (
                  <div style={{ textAlign:'center', padding:'20px', color:'#2a4a7f', fontSize:'12px' }}>Aucune tâche</div>
                )}
              </Card>
            ))}
          </div>
        </>
      )}
    </PageLayout>
  )
}
