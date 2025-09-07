import React, { useState } from 'react';

interface ResumeFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const ResumeForm: React.FC<ResumeFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      linkedIn: '',
      github: ''
    },
    skills: '',
    resumeLink: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('personalInfo.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        personalInfo: { ...prev.personalInfo, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const submitData = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
      };
      
      const response = await fetch('http://localhost:3001/api/student-resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(submitData)
      });
      
      if (response.ok) {
        onSuccess();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to submit resume');
      }
    } catch (error) {
      alert('Failed to submit resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Submit Resume</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="personalInfo.fullName"
              placeholder="Full Name"
              value={formData.personalInfo.fullName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="email"
              name="personalInfo.email"
              placeholder="Email"
              value={formData.personalInfo.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="tel"
              name="personalInfo.phone"
              placeholder="Phone"
              value={formData.personalInfo.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              name="personalInfo.address"
              placeholder="Address"
              value={formData.personalInfo.address}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="url"
              name="personalInfo.linkedIn"
              placeholder="LinkedIn Profile"
              value={formData.personalInfo.linkedIn}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="url"
              name="personalInfo.github"
              placeholder="GitHub Profile"
              value={formData.personalInfo.github}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <textarea
            name="skills"
            placeholder="Skills (comma separated)"
            value={formData.skills}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="url"
            name="resumeLink"
            placeholder="Resume Google Drive Link *"
            required
            value={formData.resumeLink}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

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
              {loading ? 'Submitting...' : 'Submit Resume'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};