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
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error getting user:', error);
    return null;
  }
  return user;
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
