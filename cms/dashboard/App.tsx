import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AccessDenied } from './components/AccessDenied';
import { CMSDashboard } from './CMSDashboard';

function AppContent() {
  const { isAuthenticated, isLoading, error, user, logout } = useAuth();

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
