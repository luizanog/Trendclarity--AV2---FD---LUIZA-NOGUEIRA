import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './useAuth'
import { createTrend, uploadTrendImage, generateBriefing } from './api'

const CATS = ['UI & Interfaces','Motion','Tipografia','Cor','3D','Branding']
const inp = { width:'100%', padding:'13px 14px', border:'1.5px solid #e5e7eb', borderRadius:14, fontSize:14, fontFamily:'Inter,sans-serif', color:'#1a1035', background:'#fff', outline:'none', boxSizing:'border-box' }

export default function AddPage() {
  const navigate       = useNavigate()
  const { user }       = useAuth()
  const fileRef        = useRef(null)
  const [title,   setTitle]   = useState('')
  const [desc,    setDesc]    = useState('')
  const [cat,     setCat]     = useState('')
  const [imgFile, setImgFile] = useState(null)
  const [imgPrev, setImgPrev] = useState(null)
  const [aiProm,  setAiProm]  = useState('')
  const [aiRes,   setAiRes]   = useState(null)
  const [saving,  setSaving]  = useState(false)
  const [aiLoad,  setAiLoad]  = useState(false)
  const [error,   setError]   = useState('')
  const [toast,   setToast]   = useState('')

  function showToast(msg) { setToast(msg); setTimeout(()=>setToast(''), 2600) }
  function handleImg(e) {
    const file = e.target.files[0]; if(!file) return
    setImgFile(file); setImgPrev(URL.createObjectURL(file))
  }
  async function handleAI() {
    if (!aiProm.trim()) { showToast('Descreva o tema primeiro'); return }
    setAiLoad(true)
    try { const r = await generateBriefing(aiProm); setAiRes(r); showToast('Briefing gerado ✦') }
    catch { showToast('Erro na IA.') }
    finally { setAiLoad(false) }
  }
  function useAI() { if(!aiRes) return; setTitle(aiRes.title); setDesc(aiRes.briefing); showToast('Campos preenchidos ✓') }
  async function publish() {
    setError('')
    if (!title.trim()) { setError('Nome obrigatório.'); return }
    if (!cat) { setError('Selecione uma categoria.'); return }
    setSaving(true)
    try {
      let imageUrl = null
      if (imgFile) imageUrl = await uploadTrendImage(imgFile, user.id)
      await createTrend({ title: title.trim(), description: desc.trim()||null, category: cat, image_url: imageUrl, ai_briefing: aiRes?.briefing??null, userId: user.id })
      navigate('/')
    } catch(e) { setError(e.message||'Erro ao publicar.') }
    finally { setSaving(false) }
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', flex:1, overflow:'hidden' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} input:focus,textarea:focus{border-color:#6c47ff!important;box-shadow:0 0 0 3px rgba(108,71,255,.10)!important}`}</style>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 24px 4px', fontSize:12, fontWeight:600, color:'#1a1035', flexShrink:0 }}>
        <span>9:41</span>
        <div style={{display:'flex',gap:5}}><i className="ti ti-wifi" style={{fontSize:14}}/><i className="ti ti-battery" style={{fontSize:14}}/></div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:12, padding:'8px 20px 14px', background:'#fff', borderBottom:'1px solid rgba(108,71,255,.08)', flexShrink:0 }}>
        <button onClick={()=>navigate('/')} style={{ width:36, height:36, borderRadius:12, border:'1.5px solid rgba(108,71,255,.15)', background:'transparent', display:'flex', alignItems:'center', justifyContent:'center', fontSize:19, color:'#1a1035', cursor:'pointer' }}>
          <i className="ti ti-arrow-left"/>
        </button>
        <p style={{ fontSize:16, fontWeight:700, color:'#1a1035' }}>Nova tendência</p>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'20px 20px 0', scrollbarWidth:'none', display:'flex', flexDirection:'column', gap:18 }}>
        <div>
          <span style={{ fontSize:11, fontWeight:600, color:'#6b7280', textTransform:'uppercase', letterSpacing:'.06em', display:'block', marginBottom:8 }}>Imagem de capa</span>
          <div onClick={()=>fileRef.current.click()} style={{ height:130, borderRadius:20, border:'2px dashed rgba(108,71,255,.25)', background:'#ede9ff', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8, cursor:'pointer', overflow:'hidden', position:'relative' }}>
            {imgPrev ? <img src={imgPrev} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }}/> : <><i className="ti ti-photo-up" style={{fontSize:32,color:'#6c47ff',opacity:.6}}/><p style={{fontSize:13,color:'#6c47ff',fontWeight:500,opacity:.7}}>Toque para adicionar imagem</p></>}
            <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleImg}/>
          </div>
        </div>
        <div>
          <span style={{ fontSize:11, fontWeight:600, color:'#6b7280', textTransform:'uppercase', letterSpacing:'.06em', display:'block', marginBottom:8 }}>Nome da tendência *</span>
          <input style={inp} placeholder="Ex: Glassmorphism…" value={title} onChange={e=>setTitle(e.target.value)}/>
        </div>
        <div>
          <span style={{ fontSize:11, fontWeight:600, color:'#6b7280', textTransform:'uppercase', letterSpacing:'.06em', display:'block', marginBottom:8 }}>Categoria *</span>
          <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
            {CATS.map(c=>(
              <button key={c} onClick={()=>setCat(c)} style={{ padding:'7px 14px', borderRadius:999, fontSize:12, fontWeight:500, border:'1.5px solid', cursor:'pointer', fontFamily:'Inter,sans-serif', background:cat===c?'#6c47ff':'#fff', color:cat===c?'#fff':'#6b7280', borderColor:cat===c?'transparent':'#e5e7eb' }}>{c}</button>
            ))}
          </div>
        </div>
        <div>
          <span style={{ fontSize:11, fontWeight:600, color:'#6b7280', textTransform:'uppercase', letterSpacing:'.06em', display:'block', marginBottom:8 }}>Descrição</span>
          <textarea style={{...inp,resize:'none',height:88}} placeholder="Descreva essa tendência…" value={desc} onChange={e=>setDesc(e.target.value)}/>
        </div>
        <div style={{ background:'linear-gradient(135deg,#f3f0ff,#eef4ff)', border:'1.5px solid rgba(108,71,255,.20)', borderRadius:20, padding:16, marginBottom:4 }}>
          <p style={{ fontSize:13, fontWeight:600, color:'#6c47ff', display:'flex', alignItems:'center', gap:6, marginBottom:12 }}><i className="ti ti-sparkles" style={{fontSize:15}}/> Gerar briefing com IA</p>
          <textarea style={{...inp,resize:'none',height:66,background:'rgba(255,255,255,.7)',border:'1.5px solid rgba(108,71,255,.20)'}} placeholder="Ex: Interfaces com textura de barro…" value={aiProm} onChange={e=>setAiProm(e.target.value)}/>
          <button onClick={handleAI} disabled={aiLoad} style={{ width:'100%', marginTop:10, padding:'11px', borderRadius:999, background:'linear-gradient(135deg,#6c47ff,#9b77ff)', color:'#fff', fontSize:13, fontWeight:600, fontFamily:'Inter,sans-serif', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, opacity:aiLoad?.6:1 }}>
            {aiLoad ? <><span style={{width:14,height:14,border:'2px solid rgba(255,255,255,.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin .65s linear infinite'}}/>Gerando…</> : <><i className="ti ti-wand" style={{fontSize:15}}/>Gerar briefing</>}
          </button>
          {aiRes && (
            <div style={{ marginTop:12, background:'rgba(255,255,255,.85)', border:'1px solid rgba(108,71,255,.18)', borderRadius:14, padding:12 }}>
              <p style={{fontSize:13,fontWeight:700,color:'#6c47ff',marginBottom:6}}>{aiRes.title}</p>
              <p style={{fontSize:12,color:'#6b7280',lineHeight:1.55}}>{aiRes.briefing}</p>
              <button onClick={useAI} style={{ marginTop:10, width:'100%', padding:'8px', borderRadius:12, background:'transparent', border:'1.5px solid rgba(108,71,255,.25)', color:'#6c47ff', fontSize:12, fontWeight:600, fontFamily:'Inter,sans-serif', cursor:'pointer' }}>Usar nos campos acima →</button>
            </div>
          )}
        </div>
        {error && <p style={{fontSize:12,color:'#ef4444',textAlign:'center',marginTop:-8}}>{error}</p>}
        <div style={{height:20}}/>
      </div>
      <div style={{ padding:'12px 20px 20px', background:'#fff', borderTop:'1px solid rgba(108,71,255,.08)', flexShrink:0 }}>
        <button onClick={publish} disabled={saving} style={{ width:'100%', padding:'15px', borderRadius:999, background:'linear-gradient(135deg,#6c47ff,#9b77ff)', color:'#fff', fontSize:15, fontWeight:600, fontFamily:'Inter,sans-serif', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, opacity:saving?.6:1 }}>
          {saving ? <><span style={{width:16,height:16,border:'2px solid rgba(255,255,255,.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin .65s linear infinite'}}/>Publicando…</> : <><i className="ti ti-send" style={{fontSize:17}}/>Publicar tendência</>}
        </button>
      </div>
      {toast && <div style={{ position:'absolute', bottom:110, left:'50%', transform:'translateX(-50%)', background:'#1a1035', color:'#fff', fontSize:13, fontWeight:500, padding:'11px 20px', borderRadius:999, whiteSpace:'nowrap', zIndex:50 }}>{toast}</div>}
    </div>
  )
}
