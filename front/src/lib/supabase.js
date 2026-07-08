import { createClient } from '@supabase/supabase-js'

// ⚠️ Supabase sozlamalari.
// Bu qiymatlarni Supabase loyihangizdan oling:
//   Project Settings → API → Project URL va anon public key.
// Yaxshiroq: .env faylida saqlang (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Supabase ulanganmi yoki yo'qmi — shu orqali tekshiramiz.
export const isSupabaseReady = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

export const supabase = isSupabaseReady
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null

// Storage bucket nomi (rasm uchun).
export const STORAGE_BUCKET = 'doctors'
