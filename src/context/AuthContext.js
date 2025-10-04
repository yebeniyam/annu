import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { supabase } from '../services/supabaseClient';
import { getCurrentUser } from '../services/auth';

export const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  // Function to update auth state
  const updateAuthState = useCallback(async () => {
    try {
      const user = await getCurrentUser();
      setAuthState({
        isAuthenticated: !!user,
        user: user,
        loading: false,
      });
      return user;
    } catch (error) {
      console.error('Error updating auth state:', error);
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
      return null;
    }
  }, []);

  // Check initial session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      await updateAuthState();
    };
    initializeAuth();
  }, [updateAuthState]);

  // Set up auth state change listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (process.env.NODE_ENV !== 'production') {
          console.debug('Auth state changed:', event, session?.user);
        }
        await updateAuthState();
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [updateAuthState]);

  const login = async (email, password) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      
      // First, try to sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        console.error('Supabase auth error:', error);
        throw new Error(error.message || 'Invalid email or password');
      }

      if (!data || !data.user) {
        throw new Error('No user data returned from authentication');
      }

      // Update auth state with the new user
      const user = await updateAuthState();
      
      if (!user) {
        throw new Error('Failed to load user data');
      }

      return { 
        success: true, 
        user 
      };
      
    } catch (error) {
      console.error('Login process error:', error);
      
      // Reset auth state on error
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
      
      return { 
        success: false, 
        error: error.message || 'An error occurred during login. Please try again.' 
      };
    }
  };

  const logout = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
      
      // Clear any remaining auth data
      window.localStorage.removeItem('supabase.auth.token');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
      }}
    >
      {!authState.loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
