import { createClient } from '@supabase/supabase-js';

// Handle process/browser polyfill for Vercel
if (typeof window !== 'undefined') {
  window.process = window.process || { env: {} };
  window.process.browser = true;
}

// Create a single supabase client for use throughout the application
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(
  supabaseUrl || 'http://localhost:54321',
  supabaseAnonKey || '123456789',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    }
  }
);

export default supabase;