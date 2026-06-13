import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './useAuth'
import LoginPage from './LoginPage'
import HomePage  from './HomePage'
import AddPage   from './AddPage'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f8f7ff' }}>
      <div style={{ width:32, height:32, border:'4px solid #6c47ff', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <div style={{ minHeight:'100vh', background:'#e8e4f8', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
      <div style={{ width:'390px', minHeight:'844px', background:'#f8f7ff', borderRadius:'40px', overflow:'hidden', boxShadow:'0 30px 80px rgba(0,0,0,.25)', display:'flex', flexDirection:'column', position:'relative' }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/add" element={<PrivateRoute><AddPage /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  )
}
