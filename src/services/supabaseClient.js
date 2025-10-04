import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing required Supabase environment variables.');
  console.log('Please check your .env file or deployment environment variables.');
  console.log('Required variables:');
  console.log('- REACT_APP_SUPABASE_URL');
  console.log('- REACT_APP_SUPABASE_ANON_KEY');
  
  // In development, show more detailed error
  if (process.env.NODE_ENV === 'development') {
    console.log('\nCurrent environment:');
    console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`REACT_APP_SUPABASE_URL: ${process.env.REACT_APP_SUPABASE_URL ? 'Set' : 'Not set'}`);
    console.log(`REACT_APP_SUPABASE_ANON_KEY: ${process.env.REACT_APP_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}`);
  }
}

// Initialize Supabase client
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

// Initialize auth state when in browser
const initializeAuth = async () => {
  if (typeof window === 'undefined') return;
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    // Set initial auth state
    if (session) {
      console.log('User session found:', session.user?.email);
    } else {
      console.log('No active session found');
    }
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(`Auth state changed: ${event}`);
        if (event === 'SIGNED_IN') {
          console.log('User signed in:', session?.user?.email);
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
        }
      }
    );
    
    // Cleanup subscription on unmount
    return () => {
      if (subscription?.unsubscribe) {
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