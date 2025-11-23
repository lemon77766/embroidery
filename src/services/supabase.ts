import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rrllyueeclyybjlkautq.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJybGx5dWVlY2x5eWJqbGthdXRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MDg5MzUsImV4cCI6MjA3NTk4NDkzNX0.JK0hwFdD_8405ZMiLctrKVZm19mQ6sxPgD5BEieB-Rs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})
