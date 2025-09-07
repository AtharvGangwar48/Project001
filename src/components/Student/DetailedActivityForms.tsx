import React, { useState } from 'react';

interface FormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

// Academic Result Form
export const AcademicResultForm: React.FC<FormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    semester: '',
    cgpa: '',
    totalMarks: '',
    percentage: '',
    resultStatus: '',
    resultDate: '',
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
        body: JSON.stringify({ ...formData, type: 'result' })
      });
      
      if (response.ok) onSuccess();
      else alert('Failed to submit result');
    } catch (error) {
      alert('Failed to submit result');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Academic Result</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
          <input type="text" placeholder="Title *" required value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          
          <textarea placeholder="Description *" required value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />

          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Semester *" required value={formData.semester} onChange={(e) => setFormData(prev => ({ ...prev, semester: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <input type="text" placeholder="CGPA/GPA" value={formData.cgpa} onChange={(e) => setFormData(prev => ({ ...prev, cgpa: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Total Marks" value={formData.totalMarks} onChange={(e) => setFormData(prev => ({ ...prev, totalMarks: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <input type="text" placeholder="Percentage" value={formData.percentage} onChange={(e) => setFormData(prev => ({ ...prev, percentage: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select value={formData.resultStatus} onChange={(e) => setFormData(prev => ({ ...prev, resultStatus: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">Result Status</option>
              <option value="Pass">Pass</option>
              <option value="Fail">Fail</option>
              <option value="Withheld">Withheld</option>
            </select>
            <input type="date" placeholder="Result Date" value={formData.resultDate} onChange={(e) => setFormData(prev => ({ ...prev, resultDate: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>

          <input type="url" placeholder="Upload Marksheet (Google Drive Link) *" required value={formData.driveLink} onChange={(e) => setFormData(prev => ({ ...prev, driveLink: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 disabled:opacity-50">
              {loading ? 'Submitting...' : 'Submit Result'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ABC ID Form
export const ABCIDForm: React.FC<FormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: 'ABC ID Details',
    description: '',
    abcIdNumber: '',
    totalCredits: '',
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
        body: JSON.stringify({ ...formData, type: 'abc_id' })
      });
      
      if (response.ok) onSuccess();
      else alert('Failed to submit ABC ID');
    } catch (error) {
      alert('Failed to submit ABC ID');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">ABC ID (Academic Bank of Credits)</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />

          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="ABC ID Number *" required value={formData.abcIdNumber} onChange={(e) => setFormData(prev => ({ ...prev, abcIdNumber: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <input type="text" placeholder="Total Credits" value={formData.totalCredits} onChange={(e) => setFormData(prev => ({ ...prev, totalCredits: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>

          <input type="url" placeholder="Upload ABC ID Proof (Google Drive Link)" value={formData.driveLink} onChange={(e) => setFormData(prev => ({ ...prev, driveLink: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 disabled:opacity-50">
              {loading ? 'Submitting...' : 'Submit ABC ID'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Seminar Form
export const SeminarForm: React.FC<FormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    theme: '',
    startDate: '',
    endDate: '',
    organizedBy: '',
    location: '',
    role: '',
    certificateReceived: '',
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
        body: JSON.stringify({ ...formData, type: 'seminar' })
      });
      
      if (response.ok) onSuccess();
      else alert('Failed to submit seminar');
    } catch (error) {
      alert('Failed to submit seminar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Seminar Details</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
          <input type="text" placeholder="Title of Seminar *" required value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          
          <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />

          <input type="text" placeholder="Theme/Topic" value={formData.theme} onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />

          <div className="grid grid-cols-2 gap-4">
            <input type="date" placeholder="Start Date" value={formData.startDate} onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <input type="date" placeholder="End Date" value={formData.endDate} onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>

          <input type="text" placeholder="Organized by (Institution/Organization)" value={formData.organizedBy} onChange={(e) => setFormData(prev => ({ ...prev, organizedBy: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />

          <input type="text" placeholder="Location (Online/Offline - if offline, specify city)" value={formData.location} onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />

          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Role (Attendee/Speaker/Organizer)" value={formData.role} onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <select value={formData.certificateReceived} onChange={(e) => setFormData(prev => ({ ...prev, certificateReceived: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">Certificate Received?</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <input type="url" placeholder="Upload Certificate (Google Drive Link)" value={formData.driveLink} onChange={(e) => setFormData(prev => ({ ...prev, driveLink: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 disabled:opacity-50">
              {loading ? 'Submitting...' : 'Submit Seminar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};