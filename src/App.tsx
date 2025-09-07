import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { StudentRegister } from './components/Student/StudentRegister';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { UniversityDashboard } from './components/University/UniversityDashboard';
import { StudentDashboard } from './components/Student/StudentDashboard';
import { SPOCDashboard } from './components/SPOC/SPOCDashboard';
import { FacultyDashboard } from './components/Faculty/FacultyDashboard';
import { AttendanceForm } from './components/Faculty/AttendanceForm';

const AppContent: React.FC = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [showStudentRegister, setShowStudentRegister] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const getDashboardComponent = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'university':
        return <UniversityDashboard />;
      case 'student':
        return <StudentDashboard />;
      case 'spoc':
        return <SPOCDashboard />;
      case 'faculty':
        return <FacultyDashboard />;
      default:
        return null;
    }
  };

  return (
    <Router>
      <Routes>
        {/* Attendance route for faculty */}
        <Route path="/attendance/:timetableId" element={
          isAuthenticated && user?.role === 'faculty' ? 
            <AttendanceForm /> : 
            <Navigate to="/" replace />
        } />
        
        {/* Main application routes */}
        <Route path="/" element={
          !isAuthenticated ? (
            showStudentRegister ? (
              <StudentRegister onSwitchToLogin={() => setShowStudentRegister(false)} />
            ) : showRegister ? (
              <RegisterForm onSwitchToLogin={() => setShowRegister(false)} onSwitchToStudentRegister={() => {
                setShowRegister(false);
                setShowStudentRegister(true);
              }} />
            ) : (
              <LoginForm 
                onSwitchToRegister={() => setShowRegister(true)} 
                onSwitchToStudentRegister={() => setShowStudentRegister(true)}
              />
            )
          ) : (
            getDashboardComponent()
          )
        } />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;