import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { UniversityDashboard } from './components/University/UniversityDashboard';

const AppContent: React.FC = () => {
  const [showRegister, setShowRegister] = useState(false);
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return showRegister ? (
      <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <LoginForm onSwitchToRegister={() => setShowRegister(true)} />
    );
  }

  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  if (user?.role === 'university') {
    return <UniversityDashboard />;
  }

  return null;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;