import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { StudentRegister } from './components/Student/StudentRegister';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { UniversityDashboard } from './components/University/UniversityDashboard';
import { StudentDashboard } from './components/Student/StudentDashboard';
import { SPOCDashboard } from './components/SPOC/SPOCDashboard';
import { FacultyDashboard } from './components/Faculty/FacultyDashboard';

const AppContent: React.FC = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [showStudentRegister, setShowStudentRegister] = useState(false);
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    if (showStudentRegister) {
      return <StudentRegister onSwitchToLogin={() => setShowStudentRegister(false)} />;
    }
    
    return showRegister ? (
      <RegisterForm onSwitchToLogin={() => setShowRegister(false)} onSwitchToStudentRegister={() => {
        setShowRegister(false);
        setShowStudentRegister(true);
      }} />
    ) : (
      <LoginForm 
        onSwitchToRegister={() => setShowRegister(true)} 
        onSwitchToStudentRegister={() => setShowStudentRegister(true)}
      />
    );
  }

  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  if (user?.role === 'university') {
    return <UniversityDashboard />;
  }

  if (user?.role === 'student') {
    return <StudentDashboard />;
  }

  if (user?.role === 'spoc') {
    return <SPOCDashboard />;
  }

  if (user?.role === 'faculty') {
    return <FacultyDashboard />;
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