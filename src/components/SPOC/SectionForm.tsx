import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { saveSection } from '../../services/dataService';

interface SectionFormProps {
  faculty: any[];
  onSuccess: () => void;
  onCancel: () => void;
}

export const SectionForm: React.FC<SectionFormProps> = ({ faculty, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    programId: '',
    name: '',
    year: 1,
    semester: 1,
    classCoordinator: '',
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check authentication
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
    
    setLoading(true);
    
    try {
      console.log('Creating section with data:', formData);
      console.log('ProgramId from secret code:', formData.programId);
      await saveSection(formData);
      onSuccess();
    } catch (error) {
      console.error('Section creation error:', error);
      alert(`Failed to create section: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Add New Section</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Secret Code *</label>
            <input
              type="text"
              name="programId"
              required
              value={formData.programId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter program secret code"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Section A"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
              <select
                name="year"
                required
                value={formData.year}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={1}>1st Year</option>
                <option value={2}>2nd Year</option>
                <option value={3}>3rd Year</option>
                <option value={4}>4th Year</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semester *</label>
              <select
                name="semester"
                required
                value={formData.semester}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {[1,2,3,4,5,6,7,8].map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class Coordinator</label>
            <select
              name="classCoordinator"
              value={formData.classCoordinator}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select class coordinator (optional)</option>
              {faculty.map((member) => (
                <option key={member._id || member.id} value={member._id || member.id}>
                  {member.name} ({member.designation})
                </option>
              ))}
            </select>
          </div>

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
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Section'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};