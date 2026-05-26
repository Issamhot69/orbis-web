'use client'
import { useEffect, useState, useRef } from 'react'

export function useSocket() {
  const [connected, setConnected] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    const token = localStorage.getItem('orbis_token')
    if (!token) return

    let socket: any = null

    async function connect() {
      try {
        const { io } = await import('socket.io-client')
        socket = io('http://localhost:4080', {
          auth: { token },
          transports: ['websocket','polling'],
        })

        socket.on('connect', () => setConnected(true))
        socket.on('disconnect', () => setConnected(false))

        socket.on('notification', (data: any) => {
          setNotifications((prev: any[]) => [{ ...data, id: Date.now(), read: false }, ...prev.slice(0,49)])
        })

        socket.on('message-received', (data: any) => {
          setNotifications((prev: any[]) => [{
            id: Date.now(), type:'message', title:'Nouveau message',
            body: data.content?.slice(0,60), icon:'💬', read: false, createdAt: new Date(),
          }, ...prev.slice(0,49)])
        })
      } catch(e) {
        console.log('[Socket] Connection failed:', e)
      }
    }

    connect()
    return () => { socket?.disconnect() }
  }, [])

  function markRead(id: number) {
    setNotifications(prev => prev.map((n:any) => n.id === id ? {...n, read:true} : n))
  }

  function markAllRead() {
    setNotifications(prev => prev.map((n:any) => ({...n, read:true})))
  }

  function joinOrg(orgId: string) {}
  function sendMessage(data: any) {}
  function sendTyping(data: any) {}

  return { connected, notifications, joinOrg, sendMessage, sendTyping, markRead, markAllRead }
}
