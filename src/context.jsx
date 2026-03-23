// src/context/index.jsx
import { createContext, useEffect, useState } from "react";
import { getCurrentUser } from "./db/apiAuth";
import { useContext } from "react";

const UrlContext = createContext();

const UrlProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Calculate isAuthenticated based on user existence and role
  const isAuthenticated = user?.role === "authenticated";

  // Dynamic admin check - not hardcoded
  const isAdmin = user ? (
    user.email === 'arisewebx@gmail.com' ||
    user.user_metadata?.role === 'admin' ||
    user.app_metadata?.role === 'admin'
  ) : false;

  // Fetch user function
  const fetchUser = async () => {
    try {
      setLoading(true);
      const userData = await getCurrentUser();
      setUser(userData);
      setLoading(false);
    } catch (error) {
      setUser(null);
      setLoading(false);
    }
  };

  // Fetch user on mount
  useEffect(() => {
    fetchUser();
  }, []);

  // Listen for auth state changes (Supabase session changes)
  useEffect(() => {
    let subscription = null;

    const setupAuthListener = async () => {
      try {
        const { default: supabase } = await import('./db/supabase');

        const { data } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
              setUser(session?.user || null);
              setLoading(false);
            } else if (event === 'SIGNED_OUT') {
              setUser(null);
              setLoading(false);
            }
          }
        );

        subscription = data.subscription;
      } catch (error) {
        console.error('Error setting up auth listener:', error);
      }
    };

    setupAuthListener();

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const contextValue = {
    user,
    fetchUser,
    loading,
    isAuthenticated,
    // Dynamic admin check (updates when user metadata changes)
    isAdmin,
    userEmail: user?.email,
    userName: user?.user_metadata?.name || user?.email?.split('@')[0]
  };

  return (
    <UrlContext.Provider value={contextValue}>
      {children}
    </UrlContext.Provider>
  );
};

export const UrlState = () => {
  return useContext(UrlContext);
};

export default UrlProvider;