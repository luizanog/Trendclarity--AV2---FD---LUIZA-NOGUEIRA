const GRADIENTS = [
  'linear-gradient(135deg,#a78bfa,#7c3aed)',
  'linear-gradient(135deg,#60a5fa,#2563eb)',
  'linear-gradient(135deg,#fb923c,#ef4444)',
  'linear-gradient(135deg,#34d399,#0d9488)',
  'linear-gradient(135deg,#fde68a,#f59e0b)',
  'linear-gradient(135deg,#f9a8d4,#ec4899)',
  'linear-gradient(135deg,#1e1b4b,#312e81)',
  'linear-gradient(135deg,#fdba74,#fb923c)',
]
const EMOJIS = ['🌀','⚡','🎨','🔮','🧊','✦','🔥','⭐','🎭','🌑']

function hash(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0
  return Math.abs(h)
}

function timeAgo(ts) {
  const m = Math.floor((Date.now() - new Date(ts)) / 60000)
  if (m < 1) return 'agora'
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  return `${Math.floor(h / 24)}d`
}

export default function TrendCard({ trend, isFav, onToggleFav }) {
  const h  = hash(trend.id)
  const bg = GRADIENTS[h % GRADIENTS.length]
  const em = EMOJIS[h % EMOJIS.length]

  return (
    <div style={{ background:'#fff', borderRadius:20, overflow:'hidden', border:'1px solid rgba(108,71,255,.08)', transition:'transform .2s,box-shadow .2s', cursor:'pointer', position:'relative' }}
      onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 8px 24px rgba(108,71,255,.15)'}}
      onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow=''}}>

      {/* Image */}
      {trend.image_url ? (
        <img src={trend.image_url} alt={trend.title} style={{ width:'100%', height:140, objectFit:'cover', display:'block' }}/>
      ) : (
        <div style={{ height:140, background:bg, display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', inset:0, opacity:.12, backgroundImage:'radial-gradient(circle,white 1px,transparent 1px)', backgroundSize:'20px 20px' }}/>
          <span style={{ fontSize:40, zIndex:1 }}>{em}</span>
        </div>
      )}

      {/* Fav button */}
      <button onClick={e=>{e.stopPropagation();onToggleFav(trend.id)}}
        style={{ position:'absolute', top:10, right:10, width:28, height:28, borderRadius:'50%', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, transition:'all .2s',
          background: isFav ? '#ff6b6b' : 'rgba(255,255,255,.28)',
          backdropFilter: isFav ? 'none' : 'blur(6px)',
          color: '#fff',
          boxShadow: isFav ? '0 2px 8px rgba(255,107,107,.4)' : 'none'
        }}>
        <i className={`ti ${isFav ? 'ti-heart-filled' : 'ti-heart'}`}/>
      </button>

      {/* Info */}
      <div style={{ padding:'10px 12px 12px' }}>
        <p style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'.07em', color:'#6c47ff', marginBottom:4 }}>{trend.category}</p>
        <p style={{ fontSize:13, fontWeight:600, color:'#1a1035', lineHeight:1.3, marginBottom:8, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{trend.title}</p>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span style={{ fontSize:11, color:'#9ca3af', display:'flex', alignItems:'center', gap:3 }}>
            <i className="ti ti-heart" style={{ fontSize:12 }}/> {trend.likes}
          </span>
          <span style={{ fontSize:10, color:'#9ca3af' }}>{timeAgo(trend.created_at)}</span>
        </div>
      </div>
    </div>
  )
}
