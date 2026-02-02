import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AccessDenied } from './components/AccessDenied';
import { CMSDashboard } from './CMSDashboard';

function AppContent() {
  const { isAuthenticated, isLoading, error, user, logout } = useAuth();

  // Bypass auth in development for testing UI
  const isDev = import.meta.env.DEV;
  if (isDev) {
    return <CMSDashboard user={{ email: 'dev@test.com', permissions: 'full' }} onLogout={() => {}} />;
  }

  if (isLoading) {
    return <AccessDenied isLoading={true} />;
  }

  if (!isAuthenticated) {
    return <AccessDenied error={error} />;
  }

  return <CMSDashboard user={user} onLogout={logout} />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
