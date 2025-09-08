import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, User, University } from '../types';


interface AuthContextType extends AuthState {
  login: (username: string, password: string, role?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  adminLogin: (passcode: string) => Promise<boolean>;
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
    try {
      const loginData = {
        role,
        password,
        passcode: password,
        ...(role === 'faculty' ? { facultyId: username } : { username })
      };
      
      const API_BASE = process.env.NODE_ENV === 'development' && typeof window !== 'undefined'
        ? `https://${window.location.hostname}:3001/api`
        : 'http://localhost:3001/api';
      
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      
      if (data.success) {
        let university = null;
        
        // If user is university role, fetch university data
        if (data.user.role === 'university') {
          try {
            const univResponse = await fetch(`${API_BASE}/universities`, {
              credentials: 'include'
            });
            if (univResponse.ok) {
              const univData = await univResponse.json();
              university = univData.data.find((u: any) => u._id === data.user.universityId);
            }
          } catch (error) {
            console.error('Failed to fetch university data:', error);
          }
        }
        
        const newAuthState = {
          isAuthenticated: true,
          user: data.user,
          university,
        };
        
        setAuthState(newAuthState);
        localStorage.setItem('authState', JSON.stringify(newAuthState));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const adminLogin = async (passcode: string): Promise<boolean> => {
    if (passcode === 'ADMIN2025') {
      const newAuthState = {
        isAuthenticated: true,
        user: { role: 'admin', username: 'admin' },
        university: null,
      };
      setAuthState(newAuthState);
      localStorage.setItem('authState', JSON.stringify(newAuthState));
      return true;
    }
    return false;
  };

  const logout = async () => {
    try {
      const API_BASE = process.env.NODE_ENV === 'development' && typeof window !== 'undefined'
        ? `https://${window.location.hostname}:3001/api`
        : 'http://localhost:3001/api';
      
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    
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