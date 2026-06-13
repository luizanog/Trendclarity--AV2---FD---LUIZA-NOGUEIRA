import { useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './useAuth'
import { useTrends } from './useTrends'
import { signOut } from './api'
import TrendCard from './TrendCard'

const CATS = ['Todos','UI & Interfaces','Motion','Tipografia','Cor','3D','Branding']

export default function HomePage() {
  const navigate           = useNavigate()
  const { user }           = useAuth()
  const [cat,  setCat]     = useState('Todos')
  const [q,    setQ]       = useState('')
  const [qD,   setQD]      = useState('')
  const timer              = useRef(null)

  const { trends, favIds, loading, error, toggleLike } = useTrends(cat, qD)

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Designer'

  function handleSearch(e) {
    setQ(e.target.value)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setQD(e.target.value), 400)
  }

  async function logout() { await signOut(); navigate('/login') }

  return (
    <div style={{ display:'flex', flexDirection:'column', flex:1, overflow:'hidden' }}>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        .chip-btn:hover{background:#ede9ff!important;border-color:rgba(108,71,255,.3)!important}
        .icon-btn:hover{background:#ede9ff!important;color:#6c47ff!important}
        input:focus{border-color:#6c47ff!important;box-shadow:0 0 0 3px rgba(108,71,255,.10)!important}
      `}</style>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 24px 4px'
