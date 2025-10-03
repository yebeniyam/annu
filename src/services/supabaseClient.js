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
    storage: {
      getItem: (key) => {
        if (typeof window === 'undefined') return null;
        return window.localStorage.getItem(key);
      },
      setItem: (key, value) => {
        if (typeof window === 'undefined') return;
        window.localStorage.setItem(key, value);
      },
      removeItem: (key) => {
        if (typeof window === 'undefined') return;
        window.localStorage.removeItem(key);
      }
    }
  }
});

// Initialize auth state
const initializeAuth = async () => {
  if (typeof window === 'undefined') return;

  try {
    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Initial session:', session);

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(`Auth state changed: ${event}`, session?.user);
        
        // Handle specific auth events
        if (event === 'SIGNED_OUT') {
          window.localStorage.removeItem('supabase.auth.token');
        }
      }
    );

    // Cleanup on unmount
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  } catch (error) {
    console.error('Error initializing auth:', error);
  }
};

// Initialize auth when running in browser
if (typeof window !== 'undefined') {
  initializeAuth();
}

export default supabase;