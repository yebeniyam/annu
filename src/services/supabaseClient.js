import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallbacks
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

// Validate environment variables
const validateEnv = () => {
  const isLocal = process.env.NODE_ENV === 'development';
  const isMissingVars = !supabaseUrl || !supabaseAnonKey;
  
  if (isMissingVars) {
    const message = 'Missing required Supabase environment variables. ' + 
      (isLocal 
        ? 'Please check your .env file.' 
        : 'Please configure them in your deployment environment.');
    
    console.error('\n❌', message);
    console.log('\nRequired environment variables:');
    console.log('- REACT_APP_SUPABASE_URL');
    console.log('- REACT_APP_SUPABASE_ANON_KEY');
    
    if (isLocal) {
      console.log('\nCreate a .env file in the root directory with these variables.');
    } else {
      console.log('\nPlease set these variables in your deployment environment.');
    }
    
    return false;
  }
  
  return true;
};

// Only validate in browser environment
if (typeof window !== 'undefined') {
  validateEnv();
}

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