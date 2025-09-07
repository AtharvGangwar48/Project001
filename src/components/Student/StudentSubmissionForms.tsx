import React, { useState } from 'react';

interface FormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

// Resume Form
export const ResumeSubmissionForm: React.FC<FormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: 'My Resume',
    description: '',
    driveLink: '',
    personalInfo: { name: '', email: '', mobile: '', address: '' },
    academicDetails: [{ degree: '', institution: '', year: '', percentage: '' }],
    skills: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const submitData = {
        ...formData,
        type: 'resume',
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
      };
      
      const response = await fetch('http://localhost:3001/api/student-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(submitData)
      });
      
      if (response.ok) onSuccess();
      else alert('Failed to submit resume');
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
          <input
            type="text"
            placeholder="Description *"
            required
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name *"
              required
              value={formData.personalInfo.name}
              onChange={(e) => setFormData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, name: e.target.value } }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="email"
              placeholder="Email *"
              required
              value={formData.personalInfo.email}
              onChange={(e) => setFormData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, email: e.target.value } }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="tel"
              placeholder="Mobile *"
              required
              value={formData.personalInfo.mobile}
              onChange={(e) => setFormData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, mobile: e.target.value } }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Address *"
              required
              value={formData.personalInfo.address}
              onChange={(e) => setFormData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, address: e.target.value } }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            <input
              type="text"
              placeholder="Degree"
              value={formData.academicDetails[0].degree}
              onChange={(e) => setFormData(prev => ({ ...prev, academicDetails: [{ ...prev.academicDetails[0], degree: e.target.value }] }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Institution"
              value={formData.academicDetails[0].institution}
              onChange={(e) => setFormData(prev => ({ ...prev, academicDetails: [{ ...prev.academicDetails[0], institution: e.target.value }] }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Year"
              value={formData.academicDetails[0].year}
              onChange={(e) => setFormData(prev => ({ ...prev, academicDetails: [{ ...prev.academicDetails[0], year: e.target.value }] }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Percentage"
              value={formData.academicDetails[0].percentage}
              onChange={(e) => setFormData(prev => ({ ...prev, academicDetails: [{ ...prev.academicDetails[0], percentage: e.target.value }] }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <input
            type="text"
            placeholder="Skills (comma separated)"
            value={formData.skills}
            onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="url"
            placeholder="Google Drive Link *"
            required
            value={formData.driveLink}
            onChange={(e) => setFormData(prev => ({ ...prev, driveLink: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 disabled:opacity-50">
              {loading ? 'Submitting...' : 'Submit Resume'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Generic Activity Form
export const ActivitySubmissionForm: React.FC<FormProps & { type: string; typeName: string }> = ({ type, typeName, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    organization: '',
    startDate: '',
    endDate: '',
    duration: '',
    location: '',
    grade: '',
    credentialId: '',
    driveLink: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:3001/api/student-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...formData, type })
      });
      
      if (response.ok) onSuccess();
      else alert(`Failed to submit ${typeName}`);
    } catch (error) {
      alert(`Failed to submit ${typeName}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Submit {typeName}</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title *"
            required
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          
          <textarea
            placeholder="Description *"
            required
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Organization"
              value={formData.organization}
              onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Duration"
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              placeholder="Start Date"
              value={formData.startDate}
              onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="date"
              placeholder="End Date"
              value={formData.endDate}
              onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {type === 'result' && (
            <input
              type="text"
              placeholder="Grade/Percentage"
              value={formData.grade}
              onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          )}

          {(type === 'seminar' || type === 'conference') && (
            <input
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          )}

          {(type === 'certificate' || type === 'online_course') && (
            <input
              type="text"
              placeholder="Credential ID"
              value={formData.credentialId}
              onChange={(e) => setFormData(prev => ({ ...prev, credentialId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          )}

          <input
            type="url"
            placeholder="Google Drive Link *"
            required
            value={formData.driveLink}
            onChange={(e) => setFormData(prev => ({ ...prev, driveLink: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 disabled:opacity-50">
              {loading ? 'Submitting...' : `Submit ${typeName}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};