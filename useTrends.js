import { useCallback, useEffect, useState } from 'react'
import { fetchTrends, fetchMyFavorites, toggleLike } from './api'
import { useAuth } from './useAuth'

export function useTrends(category, search) {
  const { user }               = useAuth()
  const [trends,  setTrends]   = useState([])
  const [favIds,  setFavIds]   = useState(new Set())
  const [loading, setLoading]  = useState(true)
  const [error,   setError]    = useState(null)

  const load = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const [data, favs] = await Promise.all([
        fetchTrends({ category, search }),
        user ? fetchMyFavorites(user.id) : Promise.resolve([]),
      ])
      setTrends(data)
      setFavIds(new Set(favs))
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }, [category, search, user])

  useEffect(() => { load() }, [load])

  const handleToggleLike = useCallback(async (trendId) => {
    if (!user) return
    try {
      const result = await toggleLike(trendId, user.id)
      setFavIds(prev => { const n = new Set(prev); result.liked ? n.add(trendId) : n.delete(trendId); return n })
      setTrends(prev => prev.map(t => t.id === trendId ? { ...t, likes: t.likes + (result.liked ? 1 : -1) } : t))
    } catch (e) { console.error(e) }
  }, [user])

  return { trends, favIds, loading, error, refresh: load, toggleLike: handleToggleLike }
}
