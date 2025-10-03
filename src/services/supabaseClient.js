import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client with proper configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY.');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {}
    }
  }
});

// Log auth state changes for debugging
if (typeof window !== 'undefined') {
  const { data: { subscription } = supabase.auth.onAuthStateChange((event, session) => {
    console.log(`Supabase auth event: ${event}`, session?.user);
  });
  
  // Cleanup subscription on unmount
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      subscription?.unsubscribe();
    });
  }
}

export default supabase;