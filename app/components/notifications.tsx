'use client'
import { useState } from 'react'
import { colors } from './orbis-ui'
import { useSocket } from './use-socket'

export function NotificationBell() {
  const { connected, notifications, markRead, markAllRead } = useSocket()
  const [open, setOpen] = useState(false)
  const unread = notifications.filter(n => !n.read).length

  return (
    <div style={{ position:'relative' }}>
      <button onClick={() => setOpen(!open)} style={{ position:'relative', width:'40px', height:'40px', borderRadius:'50%', background: colors.bgCard, border:'1px solid '+colors.border, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px' }}>
        🔔
        {unread > 0 && (
          <div style={{ position:'absolute', top:'-2px', right:'-2px', width:'18px', height:'18px', borderRadius:'50%', background:'#B22234', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', fontWeight:'900', color:'#fff' }}>
            {unread > 9 ? '9+' : unread}
          </div>
        )}
      </button>

      <div style={{ position:'absolute', top:'-4px', right:'-4px', width:'8px', height:'8px', borderRadius:'50%', background: connected ? '#00c896' : '#ff6b6b', border:'2px solid '+colors.bg }}></div>

      {open && (
        <div style={{ position:'absolute', top:'48px', right:0, width:'320px', background: colors.bgCard, border:'1px solid '+colors.border, borderRadius:'14px', boxShadow:'0 8px 32px rgba(0,0,0,0.4)', zIndex:1000, overflow:'hidden' }}>
          <div style={{ padding:'14px 16px', borderBottom:'1px solid '+colors.border, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ fontSize:'14px', fontWeight:'800', color: colors.text }}>Notifications</div>
            <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
                <div style={{ width:'6px', height:'6px', borderRadius:'50%', background: connected ? '#00c896' : '#ff6b6b' }}></div>
                <span style={{ fontSize:'10px', color: connected ? '#00c896' : '#ff6b6b' }}>{connected ? 'Live' : 'Offline'}</span>
              </div>
              {unread > 0 && (
                <button onClick={markAllRead} style={{ fontSize:'11px', color:'#B22234', background:'none', border:'none', cursor:'pointer' }}>Tout lire</button>
              )}
            </div>
          </div>

          <div style={{ maxHeight:'360px', overflowY:'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding:'32px', textAlign:'center', color: colors.textMuted, fontSize:'13px' }}>
                <div style={{ fontSize:'32px', marginBottom:'8px' }}>🔔</div>
                Aucune notification
              </div>
            ) : notifications.map(n => (
              <div key={n.id} onClick={() => markRead(n.id)} style={{ padding:'12px 16px', borderBottom:'1px solid '+colors.border, cursor:'pointer', background: n.read ? 'transparent' : 'rgba(178,34,52,0.05)', display:'flex', gap:'10px', alignItems:'flex-start' }}>
                <div style={{ fontSize:'20px', flexShrink:0 }}>{n.icon || '🔔'}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:'13px', fontWeight: n.read ? '400' : '700', color: colors.text, marginBottom:'2px' }}>{n.title}</div>
                  {n.body && <div style={{ fontSize:'11px', color: colors.textMuted, lineHeight:'1.4' }}>{n.body}</div>}
                  <div style={{ fontSize:'10px', color:'#2a4a7f', marginTop:'4px' }}>
                    {n.createdAt ? new Date(n.createdAt).toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'}) : 'Maintenant'}
                  </div>
                </div>
                {!n.read && <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#B22234', flexShrink:0, marginTop:'4px' }}></div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
