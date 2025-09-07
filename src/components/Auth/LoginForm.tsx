import React, { useState } from 'react';
import { Eye, EyeOff, GraduationCap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onSwitchToStudentRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister, onSwitchToStudentRegister }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'university'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, adminLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let success = false;
      
      if (formData.role === 'admin') {
        success = await adminLogin(formData.password);
      } else {
        success = await login(formData.username, formData.password, formData.role);
      }

      if (!success) {
        setError('Invalid credentials or account not approved');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-indigo-600 p-3 rounded-full">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome to EduTrack</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account to continue
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Login as
              </label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              >
                <option value="university">University</option>
                <option value="student">Student</option>
                <option value="spoc">SPOC/HOD</option>
                <option value="faculty">Faculty</option>
                <option value="admin">System Administrator</option>
              </select>
            </div>

            {formData.role !== 'admin' && (
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  {formData.role === 'faculty' ? 'Faculty ID' : 'Username'}
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder={formData.role === 'faculty' ? 'Enter your Faculty ID' : 'Enter your username'}
                />
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {formData.role === 'admin' ? 'Admin Passcode' : 'Password'}
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder={formData.role === 'admin' ? 'Enter admin passcode' : 'Enter your password'}
                />
                {formData.role !== 'admin' && (
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>

          {formData.role !== 'admin' && (
            <div className="text-center space-y-2">
              {formData.role === 'university' && (
                <p className="text-sm text-gray-600">
                  New university?{' '}
                  <button
                    type="button"
                    onClick={onSwitchToRegister}
                    className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                  >
                    Register here
                  </button>
                </p>
              )}
              {formData.role === 'student' && (
                <p className="text-sm text-gray-600">
                  New student?{' '}
                  <button
                    type="button"
                    onClick={onSwitchToStudentRegister}
                    className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                  >
                    Register here
                  </button>
                </p>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};