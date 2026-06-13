import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signIn, signUp, signInWithGoogle } from './api'

export default function LoginPage() {
  const navigate            = useNavigate()
  const [mode, setMode]     = useState('login')
  const [email, setEmail]   = useState('')
  const [pass,  setPass]    = useState('')
  const [name,  setName]    = useState('')
  const [error, setError]   = useState('')
  const [load,  setLoad]    = useState(false)

  async function handleSubmit(e) {
    e.preventDefault(); setError('')
    if (!email || !pass) { setError('Preencha e-mail e senha.'); return }
    if (mode === 'signup' && !name) { setError('Informe seu nome.'); return }
    setLoad(true)
    try {
      mode === 'login' ? await signIn(email, pass) : await signUp(email, pass, name)
      navigate('/')
    } catch(err) { setError(err.message || 'Erro ao autenticar.') }
    finally { setLoad(false) }
  }

  async function handleGoogle() {
    try { await signInWithGoogle() } catch(err) { setError(err.message) }
  }

  const inp = { width:'100%', padding:'14px 14px 14px 44px', border:'1.5px solid #e5e7eb', borderRadius:16, fontSize:14, fontFamily:'Inter,sans-serif', color:'#1a1035', background:'#fff', outline:'none', boxSizing:'border-box' }

  return (
    <div style={{ display:'flex', flexDirection:'column', flex:1 }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} input:focus{border-color:#6c47ff!important;box-shadow:0 0 0 3px rgba(108,71,255,.12)!important}`}</style>
      <div style={{ height:280, background:'linear-gradient(160deg,#6c47ff 0%,#9b77ff 60%,#c4b0ff 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-end', paddingBottom:40, position:'relative', overflow:'hidden', flexShrink:0 }}>
        <div style={{ position:'absolute', width:260, height:260, borderRadius:'50%', background:'rgba(255,255,255,.08)', top:-80, right:-50 }}/>
        <div style={{ position:'absolute', width:180, height:180, borderRadius:'50%', background:'rgba(255,255,255,.05)', bottom:-40, left:-40 }}/>
        <p style={{ fontSize:32, fontWeight:700, color:'#fff', letterSpacing:'-0.5px', zIndex:1 }}>Trendly <span style={{color:'#ffd166'}}>✦</span></p>
        <p style={{ fontSize:14, color:'rgba(255,255,255,.72)', marginTop:6, zIndex:1 }}>Tendências de design, na palma da mão</p>
      </div>
      <div style={{ flex:1, padding:'28px 28px 24px', display:'flex', flexDirection:'column', gap:14, overflowY:'auto' }}>
        <div>
          <p style={{ fontSize:22, fontWeight:700, color:'#1a1035', marginBottom:2 }}>{mode==='login'?'Bem-vinda de volta 👋':'Criar conta grátis'}</p>
          <p style={{ fontSize:14, color:'#6b7280' }}>{mode==='login'?'Entre na sua conta para continuar':'Comece a compartilhar tendências'}</p>
        </div>
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:12}}>
          {mode==='signup' && (
            <div style={{position:'relative'}}>
              <i className="ti ti-user" style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',fontSize:18,color:'#9ca3af'}}/>
              <input style={inp} type="text" placeholder="Seu nome" value={name} onChange={e=>setName(e.target.value)}/>
            </div>
          )}
          <div style={{position:'relative'}}>
            <i className="ti ti-mail" style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',fontSize:18,color:'#9ca3af'}}/>
            <input style={inp} type="email" placeholder="seu@email.com" value={email} onChange={e=>setEmail(e.target.value)}/>
          </div>
          <div style={{position:'relative'}}>
            <i className="ti ti-lock" style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',fontSize:18,color:'#9ca3af'}}/>
            <input style={inp} type="password" placeholder="Senha (mín. 6 caracteres)" value={pass} onChange={e=>setPass(e.target.value)}/>
          </div>
          {error && <p style={{fontSize:12,color:'#ef4444',paddingLeft:4}}>{error}</p>}
          <button type="submit" disabled={load} style={{width:'100%',padding:'15px',borderRadius:999,background:'linear-gradient(135deg,#6c47ff,#9b77ff)',color:'#fff',fontSize:15,fontWeight:600,fontFamily:'Inter,sans-serif',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,opacity:load?.55:1,marginTop:4}}>
            {load ? <span style={{width:16,height:16,border:'2px solid rgba(255,255,255,.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin .65s linear infinite'}}/> : <><i className="ti ti-arrow-right" style={{fontSize:17}}/>{mode==='login'?'Entrar':'Criar conta'}</>}
          </button>
        </form>
        <div style={{display:'flex',alignItems:'center',gap:12,color:'#9ca3af',fontSize:13}}>
          <div style={{flex:1,height:1,background:'#f3f4f6'}}/><span>ou</span><div style={{flex:1,height:1,background:'#f3f4f6'}}/>
        </div>
        <button onClick={handleGoogle} style={{width:'100%',padding:'14px',borderRadius:999,background:'transparent',color:'#374151',border:'1.5px solid #e5e7eb',fontSize:14,fontWeight:500,fontFamily:'Inter,sans-serif',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:10}}>
          <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/></svg>
          Continuar com Google
        </button>
        <p style={{textAlign:'center',fontSize:13,color:'#6b7280',marginTop:'auto'}}>
          {mode==='login'?'Não tem conta? ':'Já tem conta? '}
          <button style={{color:'#6c47ff',fontWeight:600,background:'none',border:'none',cursor:'pointer',fontFamily:'Inter,sans-serif',fontSize:13}} onClick={()=>{setMode(mode==='login'?'signup':'login');setError('')}}>
            {mode==='login'?'Criar conta grátis':'Entrar'}
          </button>
        </p>
      </div>
    </div>
  )
}
