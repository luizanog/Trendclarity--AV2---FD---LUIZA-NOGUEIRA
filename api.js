import { supabase } from './supabase'

export async function signUp(email, password, name) {
  const { data, error } = await supabase.auth.signUp({
    email, password,
    options: { data: { full_name: name } },
  })
  if (error) throw error
  return data
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  })
  if (error) throw error
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function fetchTrends({ category = null, search = null } = {}) {
  let query = supabase
    .from('trends')
    .select('*, profiles(name, avatar_url)')
    .order('created_at', { ascending: false })
  if (category && category !== 'Todos') query = query.eq('category', category)
  if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function createTrend({ title, description, category, image_url, ai_briefing, userId }) {
  const { data, error } = await supabase
    .from('trends')
    .insert({ title, description, category, image_url: image_url ?? null, ai_briefing: ai_briefing ?? null, user_id: userId })
    .select().single()
  if (error) throw error
  return data
}

export async function fetchMyFavorites(userId) {
  const { data, error } = await supabase
    .from('favorites').select('trend_id').eq('user_id', userId)
  if (error) throw error
  return data.map(r => r.trend_id)
}

export async function toggleLike(trendId, userId) {
  const { data, error } = await supabase.rpc('toggle_like', {
    p_trend_id: trendId, p_user_id: userId,
  })
  if (error) throw error
  return data
}

export async function uploadTrendImage(file, userId) {
  const ext  = file.name.split('.').pop()
  const path = `${userId}/${Date.now()}.${ext}`
  const { error: upErr } = await supabase.storage.from('trend-images').upload(path, file, { upsert: true })
  if (upErr) throw upErr
  const { data } = supabase.storage.from('trend-images').getPublicUrl(path)
  return data.publicUrl
}

export async function generateBriefing(prompt) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: `Você é especialista em tendências de design. Gere um briefing profissional.
Responda APENAS com JSON válido, sem backticks:
{"title":"Nome curto (máx 5 palavras)","briefing":"3 frases: o que é, por que está em alta, como aplicar."}`,
      messages: [{ role: 'user', content: `Tendência: ${prompt}` }],
    }),
  })
  const json = await response.json()
  const text = json.content.map(b => b.text || '').join('')
  return JSON.parse(text.replace(/```json|```/g, '').trim())
}
