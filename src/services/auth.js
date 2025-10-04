import { supabase } from './supabaseClient';

// Get current session token
export const getAuthToken = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session?.access_token || null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// For compatibility with existing code
export const setAuthToken = (token) => {
  console.warn('Supabase manages tokens automatically. No manual token setting required.');
};

// Sign out user
export const removeAuthToken = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    // Clear any remaining auth data
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('sb-access-token');
      window.localStorage.removeItem('sb-refresh-token');
    }
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Check if user is authenticated
export const isAuthenticated = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return !!session?.user;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

// Get current user with extended profile data
export const getCurrentUser = async () => {
  try {
    // First get the current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.log('No active session:', sessionError?.message || 'No session found');
      return null;
    }

    // Then get the user data from auth
    const { data: { user }, error: userError } = await supabase.auth.getUser(session.access_token);
    
    if (userError || !user) {
      console.error('Error getting auth user:', userError?.message || 'No user found');
      return null;
    }

    // Initialize user data with auth data
    let userData = { ...user };

    try {
      // Try to get additional user data from the users table
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
      }

      if (userProfile) {
        // If we have additional user data, merge it with auth data
        userData = { ...userData, ...userProfile };
      } else {
        // If no user data found, create a basic profile
        console.log('No user profile found, creating one...');
        const newUserData = {
          id: user.id,
          email: user.email,
          // Required fields from schema
          password_hash: 'external_auth', // Placeholder since auth is handled by Supabase Auth
          name: user.email.split('@')[0] || 'User', // Generate a basic name from email
          role: 'user', // Default role
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        console.log('Creating user with data:', newUserData);
        
        // Try to create user using direct insert first
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert(newUserData)
          .select()
          .single();

        if (createError) {
          console.error('Error creating user profile with direct insert:', createError);
          
          // Fallback to RPC if direct insert fails
          console.log('Trying RPC method for user creation...');
          const { data: rpcResult, error: rpcError } = await supabase.rpc('create_user_profile', {
            p_user_id: newUserData.id,
            p_email: newUserData.email,
            p_name: newUserData.name,
            p_role: newUserData.role
          });
          
          if (rpcError) {
            console.error('RPC method also failed:', rpcError);
            throw rpcError;
          }
          
          console.log('User profile created via RPC:', rpcResult);
          userData = { ...userData, ...rpcResult.data };
        } else if (newUser) {
          console.log('Successfully created user profile with direct insert:', newUser);
          userData = { ...userData, ...newUser };
        }
      }
    } catch (error) {
      console.error('Unexpected error in user profile handling:', error);
      // Continue with just the auth data
    }

    return userData;
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
};

// Sign in with email and password
export const signInWithEmail = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return { user: data.user, error: null };
  } catch (error) {
    console.error('Error signing in:', error);
    return { user: null, error };
  }
};

export const hasRole = async (role) => {
  const user = await getCurrentUser();
  if (!user) return false;
  
  // Get user role from our users table
  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();
  
  if (error) {
    console.error('Error getting user role:', error);
    return false;
  }
  
  return data && data.role === role;
};

export const hasAnyRole = async (roles = []) => {
  const user = await getCurrentUser();
  if (!user) return false;
  
  // Get user role from our users table
  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();
  
  if (error) {
    console.error('Error getting user role:', error);
    return false;
  }
  
  return data && roles.includes(data.role);
};
  }
  
  return data && roles.includes(data.role);
};
