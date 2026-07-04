import { createClient } from '@supabase/supabase-js';

// Pull the secret keys from your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Export the connection so the rest of the app can use it
export const supabase = createClient(supabaseUrl, supabaseAnonKey);