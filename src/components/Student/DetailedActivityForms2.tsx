import React, { useState } from 'react';

interface FormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

// Conference Form
export const ConferenceForm: React.FC<FormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subjectArea: '',
    startDate: '',
    endDate: '',
    organizingBody: '',
    location: '',
    role: '',
    paperPresented: '',
    paperTitle: '',
    published: '',
    journalName: '',
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
        body: JSON.stringify({ ...formData, type: 'conference' })
      });
      
      if (response.ok) onSuccess();
      else alert('Failed to submit conference');
    } catch (error) {
      alert('Failed to submit conference');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Conference Details</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
          <input type="text" placeholder="Title of Conference *" required value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          
          <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />

          <input type="text" placeholder="Theme/Subject Area" value={formData.subjectArea} onChange={(e) => setFormData(prev => ({ ...prev, subjectArea: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />

          <div className="grid grid-cols-2 gap-4">
            <input type="date" placeholder="Start Date" value={formData.startDate} onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <input type="date" placeholder="End Date" value={formData.endDate} onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>

          <input type="text" placeholder="Organizing Body" value={formData.organizingBody} onChange={(e) => setFormData(prev => ({ ...prev, organizingBody: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />

          <input type="text" placeholder="Location (Online/Offline)" value={formData.location} onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />

          <input type="text" placeholder="Role (Participant/Presenter/Panelist/Volunteer)" value={formData.role} onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />

          <select value={formData.paperPresented} onChange={(e) => setFormData(prev => ({ ...prev, paperPresented: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">Was a Paper Presented?</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>

          {formData.paperPresented === 'Yes' && (
            <>
              <input type="text" placeholder="Paper Title" value={formData.paperTitle} onChange={(e) => setFormData(prev => ({ ...prev, paperTitle: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              
              <div className="grid grid-cols-2 gap-4">
                <select value={formData.published} onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Published?</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                {formData.published === 'Yes' && (
                  <input type="text" placeholder="Journal Name" value={formData.journalName} onChange={(e) => setFormData(prev => ({ ...prev, journalName: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                )}
              </div>
            </>
          )}

          <input type="url" placeholder="Upload Certificate/Paper Proof (Google Drive Link)" value={formData.driveLink} onChange={(e) => setFormData(prev => ({ ...prev, driveLink: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 disabled:opacity-50">
              {loading ? 'Submitting...' : 'Submit Conference'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Online Course Form
export const OnlineCourseForm: React.FC<FormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    platform: '',
    institution: '',
    startDate: '',
    endDate: '',
    completed: '',
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
        body: JSON.stringify({ ...formData, type: 'online_course' })
      });
      
      if (response.ok) onSuccess();
      else alert('Failed to submit online course');
    } catch (error) {
      alert('Failed to submit online course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Online Course Details</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Course Title *" required value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          
          <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />

          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Platform (Coursera, NPTEL, Udemy, Other)" value={formData.platform} onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <input type="text" placeholder="Institution Offering the Course" value={formData.institution} onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input type="date" placeholder="Start Date" value={formData.startDate} onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <input type="date" placeholder="End Date" value={formData.endDate} onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select value={formData.completed} onChange={(e) => setFormData(prev => ({ ...prev, completed: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">Completed?</option>
              <option value="Yes">Yes</option>
              <option value="Ongoing">Ongoing</option>
            </select>
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
              {loading ? 'Submitting...' : 'Submit Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Internship Form
export const InternshipForm: React.FC<FormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company: '',
    position: '',
    internshipMode: '',
    startDate: '',
    endDate: '',
    duration: '',
    department: '',
    supervisorName: '',
    supervisorContact: '',
    stipendReceived: '',
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
        body: JSON.stringify({ ...formData, type: 'internship' })
      });
      
      if (response.ok) onSuccess();
      else alert('Failed to submit internship');
    } catch (error) {
      alert('Failed to submit internship');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Internship Details</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
          <input type="text" placeholder="Internship Title *" required value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          
          <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />

          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Company/Organization Name *" required value={formData.company} onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <input type="text" placeholder="Position/Title" value={formData.position} onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>

          <select value={formData.internshipMode} onChange={(e) => setFormData(prev => ({ ...prev, internshipMode: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">Internship Mode</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
            <option value="Hybrid">Hybrid</option>
          </select>

          <div className="grid grid-cols-3 gap-4">
            <input type="date" placeholder="Start Date" value={formData.startDate} onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <input type="date" placeholder="End Date" value={formData.endDate} onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <input type="text" placeholder="Duration (weeks/months)" value={formData.duration} onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>

          <input type="text" placeholder="Department/Field" value={formData.department} onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />

          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Supervisor's Name" value={formData.supervisorName} onChange={(e) => setFormData(prev => ({ ...prev, supervisorName: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <input type="text" placeholder="Supervisor's Contact" value={formData.supervisorContact} onChange={(e) => setFormData(prev => ({ ...prev, supervisorContact: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>

          <select value={formData.stipendReceived} onChange={(e) => setFormData(prev => ({ ...prev, stipendReceived: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">Stipend Received?</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>

          <input type="url" placeholder="Upload Internship Certificate/Letter (Google Drive Link) *" required value={formData.driveLink} onChange={(e) => setFormData(prev => ({ ...prev, driveLink: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 disabled:opacity-50">
              {loading ? 'Submitting...' : 'Submit Internship'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Extra-Curricular Form
export const ExtraCurricularForm: React.FC<FormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    activityType: '',
    eventName: '',
    participationType: '',
    organizedBy: '',
    startDate: '',
    endDate: '',
    achievement: '',
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
        body: JSON.stringify({ ...formData, type: 'extracurricular' })
      });
      
      if (response.ok) onSuccess();
      else alert('Failed to submit activity');
    } catch (error) {
      alert('Failed to submit activity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Extra-Curricular Activity</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Activity Title *" required value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          
          <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />

          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Activity Type (Sports, Cultural, Technical, etc.)" value={formData.activityType} onChange={(e) => setFormData(prev => ({ ...prev, activityType: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <input type="text" placeholder="Name of Event/Activity" value={formData.eventName} onChange={(e) => setFormData(prev => ({ ...prev, eventName: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Your Role/Participation Type" value={formData.participationType} onChange={(e) => setFormData(prev => ({ ...prev, participationType: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <input type="text" placeholder="Organized By" value={formData.organizedBy} onChange={(e) => setFormData(prev => ({ ...prev, organizedBy: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input type="date" placeholder="Start Date" value={formData.startDate} onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <input type="date" placeholder="End Date" value={formData.endDate} onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>

          <input type="text" placeholder="Achievement/Recognition (if any)" value={formData.achievement} onChange={(e) => setFormData(prev => ({ ...prev, achievement: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />

          <input type="url" placeholder="Upload Proof/Certificate/Photos (Google Drive Link)" value={formData.driveLink} onChange={(e) => setFormData(prev => ({ ...prev, driveLink: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 disabled:opacity-50">
              {loading ? 'Submitting...' : 'Submit Activity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};