import React, { useState, useEffect } from 'react';
import { Plus, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';

const API_BASE = process.env.NODE_ENV === 'development' && typeof window !== 'undefined'
  ? `https://${window.location.hostname}:3001/api`
  : 'http://localhost:3001/api';

interface Activity {
  _id: string;
  type: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvalDate?: string;
  approvedBy?: any;
  driveLink: string;
}

const activityTypes = [
  { value: 'result', label: 'Academic Result' },
  { value: 'certificate', label: 'Certificate' },
  { value: 'seminar', label: 'Seminar Participation' },
  { value: 'conference', label: 'Conference Participation' },
  { value: 'online_course', label: 'Online Course' },
  { value: 'internship', label: 'Internship' },
  { value: 'extracurricular', label: 'Extracurricular Activity' },
  { value: 'abc_id', label: 'ABC ID Certificate' }
];

export const ActivitySubmission: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    driveLink: '',
    startDate: '',
    endDate: '',
    organization: '',
    grade: '',
    duration: '',
    location: ''
  });

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch(`${API_BASE}/student-details/my-submissions`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setActivities(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`${API_BASE}/student-details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Activity submitted successfully! It will be reviewed by your class coordinator.');
        setShowForm(false);
        setFormData({
          type: '',
          title: '',
          description: '',
          driveLink: '',
          startDate: '',
          endDate: '',
          organization: '',
          grade: '',
          duration: '',
          location: ''
        });
        fetchActivities();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to submit activity');
      }
    } catch (error) {
      alert('Network error: Failed to submit activity');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Loading activities...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">My Activities & Submissions</h2>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Submit Activity</span>
        </button>
      </div>

      {/* Activities List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Submitted Activities ({activities.length})
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {activities.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No activities submitted yet. Click "Submit Activity" to get started.
            </div>
          ) : (
            activities.map(activity => (
              <div key={activity._id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                        {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Type: {activityTypes.find(t => t.value === activity.type)?.label || activity.type}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Submitted: {new Date(activity.createdAt).toLocaleDateString()}
                      {activity.approvalDate && (
                        <span> | Approved: {new Date(activity.approvalDate).toLocaleDateString()}</span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(activity.status)}
                    <a 
                      href={activity.driveLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      View Document
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Submit Activity Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Submit New Activity
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Activity Type
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Activity Type</option>
                  {activityTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Activity title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your activity"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Google Drive Link (Certificate/Proof)
                </label>
                <input
                  type="url"
                  required
                  value={formData.driveLink}
                  onChange={(e) => setFormData({...formData, driveLink: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://drive.google.com/..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization/Institution (Optional)
                </label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => setFormData({...formData, organization: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Organization name"
                />
              </div>

              {formData.type === 'result' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grade/CGPA
                  </label>
                  <input
                    type="text"
                    value={formData.grade}
                    onChange={(e) => setFormData({...formData, grade: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Grade or CGPA"
                  />
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Activity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};