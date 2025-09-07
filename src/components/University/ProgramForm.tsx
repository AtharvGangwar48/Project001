import React, { useState } from 'react';
import { Program } from '../../types';
import { saveProgram } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';

interface ProgramFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const ProgramForm: React.FC<ProgramFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    degreeLevel: 'UG' as Program['degreeLevel'],
    description: '',
    department: '',
    duration: '',
    studyMode: 'Online' as Program['studyMode'],
  });

  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check authentication status first
    try {
      const authCheck = await fetch('http://localhost:3001/api/auth/me', {
        credentials: 'include'
      });
      
      if (!authCheck.ok) {
        alert('Session expired. Please login again.');
        window.location.reload();
        return;
      }
    } catch (error) {
      alert('Authentication check failed. Please login again.');
      window.location.reload();
      return;
    }
    
    const universityId = user?.universityId;
    if (!universityId) {
      alert('University ID not found. Please login again.');
      return;
    }

    setLoading(true);

    const program = {
      universityId,
      ...formData,
    };

    try {
      console.log('Creating program:', program);
      console.log('User context:', user);
      await saveProgram(program);
      onSuccess();
    } catch (error) {
      console.error('Program creation error:', error);
      alert(`Failed to create program: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Add New Program</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">×</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Program Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Program Name *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Computer Science Engineering"
            />
          </div>

          {/* Degree Level & Study Mode */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Degree Level *</label>
              <select
                name="degreeLevel"
                required
                value={formData.degreeLevel}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="UG">Undergraduate (UG)</option>
                <option value="PG">Postgraduate (PG)</option>
                <option value="Doctoral">Doctoral</option>
                <option value="Certificate">Certificate</option>
                <option value="Diploma">Diploma</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Study Mode *</label>
              <select
                name="studyMode"
                required
                value={formData.studyMode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          {/* Department & Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department/Faculty *</label>
              <input
                type="text"
                name="department"
                required
                value={formData.department}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Engineering, Arts, Science"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
              <input
                type="text"
                name="duration"
                required
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., 4 years, 2 years"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Program Description *</label>
            <textarea
              name="description"
              required
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="A short summary of what the program is about..."
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Program'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
