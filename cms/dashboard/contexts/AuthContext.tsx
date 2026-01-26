import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  email: string;
  permissions: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_CMS_API_URL || '';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeAuth();
  }, []);

  async function initializeAuth() {
    setIsLoading(true);
    setError(null);

    try {
      // Check for BT token in URL (first access from Business Tuner)
      const params = new URLSearchParams(window.location.search);
      const btToken = params.get('bt_token');

      if (btToken) {
        console.log('[Auth] Found bt_token in URL, validating...');

        // Validate token with backend
        const response = await fetch(`${API_URL}/api/auth/validate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bt_token: btToken }),
          credentials: 'include'
        });

        const data = await response.json();

        if (response.ok && data.success) {
          console.log('[Auth] Token validated successfully');
          setUser(data.user);

          // Store session token for API calls
          localStorage.setItem('cms_session', data.sessionToken);

          // Remove token from URL (security)
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.delete('bt_token');
          newUrl.searchParams.delete('bt_connection');
          window.history.replaceState({}, '', newUrl.toString());
        } else {
          console.error('[Auth] Token validation failed:', data.error);
          setError(data.error || 'Authentication failed');
        }
      } else {
        // Check existing session
        console.log('[Auth] Checking existing session...');

        const response = await fetch(`${API_URL}/api/auth/session`, {
          credentials: 'include'
        });

        const data = await response.json();

        if (data.authenticated) {
          console.log('[Auth] Existing session found');
          setUser(data.user);
        } else {
          console.log('[Auth] No active session');
        }
      }
    } catch (err: any) {
      console.error('[Auth] Initialization error:', err);
      setError('Unable to connect to server');
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {
      console.error('[Auth] Logout error:', err);
    } finally {
      setUser(null);
      localStorage.removeItem('cms_session');
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      error,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
