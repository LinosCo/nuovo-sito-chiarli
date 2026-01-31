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

    // Debug: log full URL info
    console.log('[Auth] === INIT START ===');
    console.log('[Auth] Full URL:', window.location.href);
    console.log('[Auth] Search string:', window.location.search);
    console.log('[Auth] API_URL:', API_URL);

    try {
      // Parse URL params
      const params = new URLSearchParams(window.location.search);
      let btToken = params.get('bt_token');
      let btConnection = params.get('bt_connection');

      // FALLBACK: Controlla sessionStorage (i params potrebbero essere stati salvati dall'HTML)
      if (!btToken) {
        const savedToken = sessionStorage.getItem('sso_bt_token');
        const savedConnection = sessionStorage.getItem('sso_bt_connection');
        if (savedToken) {
          console.log('[Auth] Found SSO params in sessionStorage (fallback)');
          btToken = savedToken;
          btConnection = savedConnection;
          // Pulisci sessionStorage dopo averlo letto
          sessionStorage.removeItem('sso_bt_token');
          sessionStorage.removeItem('sso_bt_connection');
        }
      }

      console.log('[Auth] Parsed params:', {
        hasBtToken: !!btToken,
        btTokenLength: btToken?.length || 0,
        btConnection: btConnection
      });

      // STEP 1: Se ci sono i params SSO, validali PRIMA di tutto
      if (btToken) {
        console.log('[Auth] SSO params found, validating with backend...');

        try {
          const response = await fetch(`${API_URL}/api/auth/validate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bt_token: btToken, bt_connection: btConnection }),
            credentials: 'include'
          });

          console.log('[Auth] Validation response status:', response.status);

          const data = await response.json();
          console.log('[Auth] Validation response data:', data);

          if (response.ok && data.success) {
            console.log('[Auth] SSO validation successful!');
            setUser(data.user);

            // Store session token for API calls
            if (data.sessionToken) {
              localStorage.setItem('cms_session', data.sessionToken);
            }

            // Remove tokens from URL (security)
            window.history.replaceState({}, '', window.location.pathname);
            console.log('[Auth] URL cleaned, user authenticated');
            setIsLoading(false);
            return; // IMPORTANTE: esci qui
          } else {
            console.error('[Auth] SSO validation failed:', data.error);
            setError(data.error || 'Authentication failed');
            // Pulisci URL anche in caso di errore
            window.history.replaceState({}, '', window.location.pathname);
            setIsLoading(false);
            return;
          }
        } catch (fetchError: any) {
          console.error('[Auth] SSO fetch error:', fetchError.message);
          setError('Unable to validate session');
          setIsLoading(false);
          return;
        }
      }

      // STEP 2: Solo se non c'erano params SSO, controlla sessione esistente
      console.log('[Auth] No SSO params, checking existing session...');

      const sessionToken = localStorage.getItem('cms_session');
      console.log('[Auth] Local session token:', sessionToken ? 'present' : 'missing');

      try {
        const response = await fetch(`${API_URL}/api/auth/session`, {
          credentials: 'include',
          headers: sessionToken ? { 'Authorization': `Bearer ${sessionToken}` } : {}
        });

        const data = await response.json();
        console.log('[Auth] Session check response:', data);

        if (data.authenticated) {
          console.log('[Auth] Existing session found');
          setUser(data.user);
        } else {
          console.log('[Auth] No active session');
        }
      } catch (sessionError: any) {
        console.error('[Auth] Session check error:', sessionError.message);
      }
    } catch (err: any) {
      console.error('[Auth] Initialization error:', err);
      setError('Unable to connect to server');
    } finally {
      setIsLoading(false);
      console.log('[Auth] === INIT END ===');
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
