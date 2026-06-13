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

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 24px 4px', fontSize:12, fontWeight:600, color:'#1a1035', flexShrink:0 }}>
        <span>9:41</span>
        <div style={{ display:'flex', gap:5 }}>
          <i className="ti ti-wifi" style={{ fontSize:14 }}/>
          <i className="ti ti-battery" style={{ fontSize:14 }}/>
        </div>
      </div>

      <div style={{ padding:'0 20px', flexShrink:0, background:'#f8f7ff' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
          <div>
            <p style={{ fontSize:16, fontWeight:700, color:'#1a1035' }}>
              Olá, <span style={{ color:'#6c47ff' }}>{userName}</span> 👋
            </p>
            <p style={{ fontSize:12, color:'#9ca3af', marginTop:2 }}>O que está em alta hoje?</p>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button className="icon-btn" onClick={() => navigate('/add')}
              style={{ width:38, height:38, borderRadius:12, border:'1.5px solid rgba(108,71,255,.15)', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:19, color:'#6b7280', cursor:'pointer', transition:'all .2s' }}>
              <i className="ti ti-plus"/>
            </button>
            <button className="icon-btn" onClick={logout}
              style={{ width:38, height:38, borderRadius:12, border:'1.5px solid rgba(108,71,255,.15)', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:19, color:'#6b7280', cursor:'pointer', transition:'all .2s' }}>
              <i className="ti ti-logout"/>
            </button>
          </div>
        </div>

        <div style={{ display:'flex', gap:10, marginBottom:14 }}>
          <div style={{ flex:1, display:'flex', alignItems:'center', gap:10, background:'#fff', border:'1.5px solid rgba(108,71,255,.15)', borderRadius:999, padding:'10px 16px' }}>
            <i className="ti ti-search" style={{ fontSize:18, color:'#9ca3af', flexShrink:0 }}/>
            <input value={q} onChange={handleSearch} placeholder="Buscar tendências…"
              style={{ flex:1, border:'none', outline:'none', background:'transparent', fontSize:14, fontFamily:'Inter,sans-serif', color:'#1a1035' }}/>
            {q && <button onClick={()=>{setQ('');setQD('')}} style={{ background:'none', border:'none', cursor:'pointer', color:'#9ca3af', fontSize:15, padding:0 }}>✕</button>}
          </div>
          <button onClick={() => navigate('/add')}
            style={{ width:46, height:46, borderRadius:14, background:'linear-gradient(135deg,#6c47ff,#9b77ff)', color:'#fff', border:'none', fontSize:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 4px 12px rgba(108,71,255,.35)' }}>
            <i className="ti ti-adjustments-horizontal"/>
          </button>
        </div>

        <div style={{ display:'flex', gap:8, overflowX:'auto', paddingBottom:4, marginBottom:4, scrollbarWidth:'none' }}>
          {CATS.map(c => (
            <button key={c} className="chip-btn" onClick={() => setCat(c)}
              style={{ whiteSpace:'nowrap', padding:'7px 16px', borderRadius:999, fontSize:13, fontWeight:500, border:'1.5px solid', flexShrink:0, cursor:'pointer', transition:'all .2s', fontFamily:'Inter,sans-serif',
                background: cat===c ? '#6c47ff' : '#fff',
                color:      cat===c ? '#fff'    : '#6b7280',
                borderColor:cat===c ? 'transparent' : 'rgba(108,71,255,.15)',
                boxShadow:  cat===c ? '0 2px 8px rgba(108,71,255,.25)' : 'none'
              }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'16px 20px 100px', scrollbarWidth:'none' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
          <p style={{ fontSize:14, fontWeight:600, color:'#1a1035' }}>{cat==='Todos'?'Todas as tendências':cat}</p>
          <p style={{ fontSize:12, color:'#9ca3af' }}>{trends.length} {trends.length===1?'tendência':'tendências'}</p>
        </div>

        {error && <div style={{ textAlign:'center', padding:'32px 16px', color:'#ef4444', fontSize:14 }}>{error}</div>}

        {loading ? (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {[...Array(4)].map((_,i) => (
              <div key={i} style={{ background:'#fff', borderRadius:20, overflow:'hidden' }}>
                <div style={{ height:140, background:'#f3f0ff' }}/>
                <div style={{ padding:'10px 12px 12px' }}>
                  <div style={{ height:10, background:'#f3f0ff', borderRadius:8, width:'50%', marginBottom:8 }}/>
                  <div style={{ height:12, background:'#f3f0ff', borderRadius:8, width:'80%' }}/>
                </div>
              </div>
            ))}
          </div>
        ) : trends.length === 0 ? (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'60px 16px', gap:12, textAlign:'center' }}>
            <span style={{ fontSize:48 }}>✦</span>
            <p style={{ fontWeight:600, color:'#1a1035', fontSize:15 }}>{q?'Nenhum resultado':'Sem tendências ainda'}</p>
            <p style={{ fontSize:13, color:'#6b7280', maxWidth:220, lineHeight:1.6 }}>
              {q?'Tente outra palavra-chave':'Adicione a primeira tendência usando o botão + abaixo'}
            </p>
            {!q && (
              <button onClick={() => navigate('/add')}
                style={{ marginTop:8, padding:'10px 24px', borderRadius:999, background:'linear-gradient(135deg,#6c47ff,#9b77ff)', color:'#fff', fontSize:14, fontWeight:600, border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:8, fontFamily:'Inter,sans-serif' }}>
                <i className="ti ti-plus"/> Adicionar tendência
              </button>
            )}
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {trends.map(t => (
              <TrendCard key={t.id} trend={t} isFav={favIds.has(t.id)} onToggleFav={toggleLike}/>
            ))}
          </div>
        )}
      </div>

      <button onClick={() => navigate('/add')}
        style={{ position:'absolute', bottom:88, right:20, width:52, height:52, borderRadius:'50%', background:'linear-gradient(135deg,#6c47ff,#9b77ff)', color:'#fff', fontSize:26, border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 24px rgba(108,71,255,.40)', zIndex:10 }}>
        <i className="ti ti-plus"/>
      </button>

      <div style={{ height:80, background:'#fff', borderTop:'1px solid rgba(108,71,255,.08)', display:'flex', alignItems:'center', justifyContent:'space-around', padding:'0 8px', flexShrink:0 }}>
        {[{icon:'ti-home',label:'Início',active:true},{icon:'ti-compass',label:'Explorar'},{icon:'ti-bookmark',label:'Salvos'},{icon:'ti-user-circle',label:'Perfil'}].map(({icon,label,active})=>(
          <button key={label} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3, padding:'8px 0', background:'none', border:'none', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
            <i className={`ti ${icon}`} style={{ fontSize:22, color: active?'#6c47ff':'#9ca3af' }}/>
            <span style={{ fontSize:10, fontWeight:500, color: active?'#6c47ff':'#9ca3af' }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
