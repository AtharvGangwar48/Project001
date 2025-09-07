import React, { useState, useEffect } from 'react';
import { getSections } from '../../services/dataService';

interface SectionJoinFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const SectionJoinForm: React.FC<SectionJoinFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    sectionId: '',
    sectionRollNo: ''
  });
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      // Fetch all sections for now
      const data = await getSections();
      console.log('All sections fetched:', data);
      setSections(data);
    } catch (error) {
      console.error('Failed to fetch sections:', error);
      setSections([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:3001/api/section-students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      
      console.log('Section join response:', response.status);
      
      if (response.ok) {
        onSuccess();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to join section');
      }
    } catch (error) {
      alert('Failed to join section');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-md shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Join Section</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section *</label>
            <select
              name="sectionId"
              required
              value={formData.sectionId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select section</option>
              {sections.map((section: any) => (
                <option key={section._id} value={section._id}>
                  {section.name} - Year {section.year}, Semester {section.semester}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section Roll No *</label>
            <input
              type="text"
              name="sectionRollNo"
              required
              value={formData.sectionRollNo}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your section roll number"
            />
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
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Joining...' : 'Join Section'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};