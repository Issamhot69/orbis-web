'use client'
import { useRouter } from 'next/navigation'

// ─── ORBIS Design Tokens ─────────────────────
export const colors = {
  bg:        '#060e1a',
  bgCard:    '#0a1628',
  bgInput:   '#060e1a',
  border:    '#1e3a5f',
  borderHover:'#2a4a7f',
  primary:   '#B22234',
  primaryHover:'#8a1520',
  secondary: '#3C3B6E',
  text:      '#ffffff',
  textMuted: '#4a6fa5',
  textLight: '#c8d8f0',
  success:   '#00c896',
  warning:   '#f4c842',
  danger:    '#ff6b6b',
  info:      '#5b9fff',
}

// ─── Page Layout ─────────────────────────────
export function PageLayout({ children, title, subtitle, action }: {
  children: React.ReactNode
  title: string
  subtitle?: string
  action?: React.ReactNode
}) {
  const router = useRouter()
  return (
    <div style={{ minHeight:'100vh', background: colors.bg, color: colors.text, fontFamily:'system-ui', padding:'24px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <button onClick={() => router.push('/dashboard')} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid '+colors.border, borderRadius:'8px', padding:'8px 14px', color:colors.textMuted, cursor:'pointer', fontSize:'12px' }}>
            ← Dashboard
          </button>
          <div>
            <h1 style={{ margin:0, fontSize:'22px', fontWeight:'900', color:colors.text }}>{title}</h1>
            {subtitle && <p style={{ margin:0, fontSize:'12px', color:colors.textMuted }}>{subtitle}</p>}
          </div>
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}

// ─── Card ─────────────────────────────────────
export function Card({ children, style = {}, onClick }: {
  children: React.ReactNode
  style?: any
  onClick?: () => void
}) {
  return (
    <div onClick={onClick} style={{ background: colors.bgCard, border:'1px solid '+colors.border, borderRadius:'14px', padding:'20px', cursor: onClick?'pointer':'default', ...style }}>
      {children}
    </div>
  )
}

// ─── Button ──────────────────────────────────
export function Button({ children, onClick, variant = 'primary', size = 'md', disabled = false, style = {} }: {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  style?: any
}) {
  const variants: any = {
    primary:   { background: colors.primary,   border:'none',                          color:'#fff' },
    secondary: { background:'transparent',      border:'1px solid '+colors.border,      color: colors.textMuted },
    danger:    { background:'rgba(255,107,107,0.15)', border:'1px solid '+colors.danger, color: colors.danger },
    success:   { background:'rgba(0,200,150,0.15)',   border:'1px solid '+colors.success, color: colors.success },
    ghost:     { background:'rgba(255,255,255,0.05)', border:'1px solid '+colors.border, color: colors.text },
  }
  const sizes: any = {
    sm: { padding:'6px 12px',  fontSize:'11px' },
    md: { padding:'10px 20px', fontSize:'13px' },
    lg: { padding:'14px 28px', fontSize:'15px' },
  }
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...variants[variant], ...sizes[size], borderRadius:'8px', fontWeight:'700', cursor: disabled?'not-allowed':'pointer', opacity: disabled?0.6:1, ...style }}>
      {children}
    </button>
  )
}

// ─── Input ───────────────────────────────────
export function Input({ label, value, onChange, placeholder, type = 'text', required = false }: {
  label?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  required?: boolean
}) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
      {label && <label style={{ fontSize:'12px', color: colors.textMuted, fontWeight:'600' }}>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        style={{ padding:'10px 14px', background: colors.bgInput, border:'1px solid '+colors.border, borderRadius:'8px', color: colors.text, fontSize:'13px', outline:'none' }}
      />
    </div>
  )
}

// ─── Select ──────────────────────────────────
export function Select({ label, value, onChange, options }: {
  label?: string
  value: string
  onChange: (v: string) => void
  options: { value: string, label: string }[]
}) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
      {label && <label style={{ fontSize:'12px', color: colors.textMuted, fontWeight:'600' }}>{label}</label>}
      <select value={value} onChange={e => onChange(e.target.value)} style={{ padding:'10px 14px', background: colors.bgInput, border:'1px solid '+colors.border, borderRadius:'8px', color: colors.text, fontSize:'13px', outline:'none' }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

// ─── Badge ───────────────────────────────────
export function Badge({ children, color = 'info' }: {
  children: React.ReactNode
  color?: 'info' | 'success' | 'warning' | 'danger' | 'default'
}) {
  const colorMap: any = {
    info:    { bg:'rgba(91,159,255,0.15)',   border:'#5b9fff', text:'#5b9fff' },
    success: { bg:'rgba(0,200,150,0.15)',    border:'#00c896', text:'#00c896' },
    warning: { bg:'rgba(244,200,66,0.15)',   border:'#f4c842', text:'#f4c842' },
    danger:  { bg:'rgba(255,107,107,0.15)',  border:'#ff6b6b', text:'#ff6b6b' },
    default: { bg:'rgba(255,255,255,0.05)',  border:'#1e3a5f', text:'#4a6fa5' },
  }
  const c = colorMap[color]
  return (
    <span style={{ padding:'3px 10px', background:c.bg, border:'1px solid '+c.border, borderRadius:'20px', fontSize:'11px', color:c.text, fontWeight:'700' }}>
      {children}
    </span>
  )
}

// ─── Stats Grid ──────────────────────────────
export function StatsGrid({ stats }: {
  stats: { icon: string, label: string, value: string | number, color?: string }[]
}) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:`repeat(${Math.min(stats.length, 4)}, 1fr)`, gap:'14px', marginBottom:'24px' }}>
      {stats.map((s, i) => (
        <Card key={i}>
          <div style={{ fontSize:'22px', marginBottom:'8px' }}>{s.icon}</div>
          <div style={{ fontSize:'24px', fontWeight:'900', color: s.color || colors.info }}>{s.value}</div>
          <div style={{ fontSize:'11px', color: colors.textMuted, marginTop:'4px' }}>{s.label}</div>
        </Card>
      ))}
    </div>
  )
}

// ─── Empty State ─────────────────────────────
export function EmptyState({ icon, title, description, action }: {
  icon: string
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <Card style={{ textAlign:'center', padding:'60px' }}>
      <div style={{ fontSize:'48px', marginBottom:'16px' }}>{icon}</div>
      <h2 style={{ color: colors.info, margin:'0 0 8px', fontSize:'18px' }}>{title}</h2>
      {description && <p style={{ color: colors.textMuted, fontSize:'13px', margin:'0 0 20px' }}>{description}</p>}
      {action}
    </Card>
  )
}

// ─── Section Title ───────────────────────────
export function SectionTitle({ children, color }: { children: React.ReactNode, color?: string }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'16px' }}>
      <div style={{ width:'4px', height:'20px', background: color || colors.primary, borderRadius:'2px' }}></div>
      <h3 style={{ margin:0, fontSize:'13px', fontWeight:'800', color: color || colors.primary, textTransform:'uppercase', letterSpacing:'1px' }}>{children}</h3>
    </div>
  )
}

// ─── Live Indicator ──────────────────────────
export function LiveIndicator({ label, color }: { label: string, color?: string }) {
  const c = color || colors.success
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'6px', padding:'6px 14px', background:`rgba(${c === colors.success ? '0,200,150' : '178,34,52'},0.1)`, border:`1px solid ${c}`, borderRadius:'20px' }}>
      <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:c }}></div>
      <span style={{ fontSize:'12px', color:c, fontWeight:'700' }}>{label}</span>
    </div>
  )
}
