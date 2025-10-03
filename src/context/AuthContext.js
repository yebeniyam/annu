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
        console.log('Auth state changed:', event, session?.user);
        
        switch (event) {
          case 'INITIAL_SESSION':
          case 'SIGNED_IN':
          case 'TOKEN_REFRESHED':
            await updateAuthState();
            break;
            
          case 'SIGNED_OUT':
            // Clear any stored session data
            window.localStorage.removeItem('supabase.auth.token');
            setAuthState({
              isAuthenticated: false,
              user: null,
              loading: false,
            });
            break;
            
          case 'USER_UPDATED':
            // Update user data if needed
            if (session?.user) {
              setAuthState(prev => ({
                ...prev,
                user: { ...prev.user, ...session.user }
              }));
            }
            break;
            
          default:
            console.log('Unhandled auth event:', event);
        }
      }
    );

    // Initial check for existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await updateAuthState();
      } else {
        setAuthState(prev => ({
          ...prev,
          loading: false
        }));
      }
    };
    
    checkSession();

    // Cleanup subscription on unmount
    return () => {
      if (subscription?.unsubscribe) {
        subscription.unsubscribe();
      }
    };
  }, [updateAuthState]);

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      const user = await updateAuthState();
      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
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
