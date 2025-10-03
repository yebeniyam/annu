import { supabase } from './supabaseClient';

export const getAuthToken = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
};

export const setAuthToken = (token) => {
  // In Supabase, the token is managed automatically
  // This function is kept for compatibility
  console.warn('Supabase manages tokens automatically. No manual token setting required.');
};

export const removeAuthToken = async () => {
  await supabase.auth.signOut();
};

export const isAuthenticated = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting session:', error);
    return false;
  }
  return !!session;
};

export const getCurrentUser = async () => {
  try {
    // First, get the current session
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

      if (!profileError && userProfile) {
        // If we have additional user data, merge it with auth data
        userData = { ...userData, ...userProfile };
      } else {
        // If no user data found, create a basic profile
        console.log('No user profile found, creating one...');
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert([
            {
              id: user.id,
              email: user.email,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ])
          .select()
          .single();

        if (!createError && newUser) {
          userData = { ...userData, ...newUser };
        }
      }
    } catch (error) {
      console.error('Error in user profile handling:', error);
      // Continue with just the auth data if there's an error
    }

    return userData;
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
};

export const hasRole = async (role) => {
  const user = await getCurrentUser();
  // In Supabase, we need to get user role from a custom user table
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
