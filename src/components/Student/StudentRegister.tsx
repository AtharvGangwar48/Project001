import React, { useState, useEffect } from 'react';
import { GraduationCap, ArrowLeft } from 'lucide-react';
import { University, Program } from '../../types';
import { getUniversitiesForStudent, getProgramsByUniversity, getSectionsByProgram, registerStudent } from '../../services/dataService';

interface StudentRegisterProps {
  onSwitchToLogin: () => void;
}

export const StudentRegister: React.FC<StudentRegisterProps> = ({ onSwitchToLogin }) => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [formData, setFormData] = useState({
    fullName: '',
    studentId: '',
    universityRollNo: '',
    universityId: '',
    programId: '',
    email: '',
    phone: '',
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const data = await getUniversitiesForStudent();
        setUniversities(data);
      } catch (error) {
        console.error('Failed to fetch universities:', error);
      }
    };
    fetchUniversities();
  }, []);

  useEffect(() => {
    if (formData.universityId) {
      const fetchPrograms = async () => {
        try {
          const data = await getProgramsByUniversity(formData.universityId);
          setPrograms(data);
        } catch (error) {
          console.error('Failed to fetch programs:', error);
        }
      };
      fetchPrograms();
    } else {
      setPrograms([]);
    }
  }, [formData.universityId]);



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await registerStudent(formData);
      setSuccess(true);
    } catch (error) {
      alert('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-4">
              <GraduationCap className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your student account has been created successfully. You can now login with your credentials.
            </p>
            <button
              onClick={onSwitchToLogin}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-indigo-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <GraduationCap className="h-6 w-6 text-white" />
                <h2 className="text-xl font-semibold text-white">Student Registration</h2>
              </div>
              <button
                onClick={onSwitchToLogin}
                className="text-indigo-200 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student ID *</label>
                <input
                  type="text"
                  name="studentId"
                  required
                  value={formData.studentId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="STU2024001"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">University Roll No *</label>
              <input
                type="text"
                name="universityRollNo"
                required
                value={formData.universityRollNo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="2024CSE001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">University *</label>
              <select
                name="universityId"
                required
                value={formData.universityId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select your university</option>
                {universities.map((university) => (
                  <option key={university._id || university.id} value={university._id || university.id}>
                    {university.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Program *</label>
              <select
                name="programId"
                required
                value={formData.programId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={!formData.universityId}
              >
                <option value="">Select your program</option>
                {programs.map((program) => (
                  <option key={program._id || program.id} value={program._id || program.id}>
                    {program.name} ({program.degreeLevel})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="+91 9876543210"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="john.doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Create a password"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Registering...' : 'Register as Student'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};