import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
// Use Service Role key if available to bypass RLS, otherwise fallback to Anon Key
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false, // Server-side data fetching doesn't need to persist session
  }
});
