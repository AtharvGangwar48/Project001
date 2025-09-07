import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, User, University } from '../types';
import { getUniversities } from '../services/dataService';

interface AuthContextType extends AuthState {
  login: (username: string, password: string, role?: string) => Promise<boolean>;
  logout: () => void;
  adminLogin: (passcode: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    university: null,
  });

  useEffect(() => {
    const storedAuth = localStorage.getItem('authState');
    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth);
        setAuthState(parsed);
      } catch (error) {
        console.error('Error parsing stored auth state:', error);
      }
    }
  }, []);

  const login = async (username: string, password: string, role?: string): Promise<boolean> => {
    // Admin login
    if (role === 'admin' && username === 'admin' && password === 'ADMIN2025') {
      const user: User = {
        id: 'admin',
        username: 'admin',
        password: '',
        role: 'admin',
      };
      
      const newAuthState = {
        isAuthenticated: true,
        user,
        university: null,
      };
      
      setAuthState(newAuthState);
      localStorage.setItem('authState', JSON.stringify(newAuthState));
      return true;
    }

    // University login
    const universities = getUniversities();
    const university = universities.find(
      u => u.username === username && u.password === password && u.status === 'approved'
    );

    if (university) {
      const user: User = {
        id: university.id,
        username: university.username,
        password: '',
        role: 'university',
        universityId: university.id,
      };

      const newAuthState = {
        isAuthenticated: true,
        user,
        university,
      };

      setAuthState(newAuthState);
      localStorage.setItem('authState', JSON.stringify(newAuthState));
      return true;
    }

    return false;
  };

  const adminLogin = (passcode: string): boolean => {
    if (passcode === 'ADMIN2025') {
      const user: User = {
        id: 'admin',
        username: 'admin',
        password: '',
        role: 'admin',
      };
      
      const newAuthState = {
        isAuthenticated: true,
        user,
        university: null,
      };
      
      setAuthState(newAuthState);
      localStorage.setItem('authState', JSON.stringify(newAuthState));
      return true;
    }
    return false;
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      university: null,
    });
    localStorage.removeItem('authState');
  };

  const contextValue: AuthContextType = {
    ...authState,
    login,
    logout,
    adminLogin,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};