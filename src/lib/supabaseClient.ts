import { createClient } from '@supabase/supabase-js'

// Get the keys from your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a single, shared Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

