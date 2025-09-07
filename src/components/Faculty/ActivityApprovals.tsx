import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, Clock, Filter } from 'lucide-react';

const API_BASE = process.env.NODE_ENV === 'development' && typeof window !== 'undefined'
  ? `https://${window.location.hostname}:3001/api`
  : 'http://localhost:3001/api';

interface PendingActivity {
  _id: string;
  type: string;
  title: string;
  description: string;
  studentId: {
    _id: string;
    fullName: string;
    universityRollNo: string;
  };
  driveLink: string;
  createdAt: string;
  startDate?: string;
  endDate?: string;
  organization?: string;
  status: 'pending' | 'approved' | 'rejected';
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

export const ActivityApprovals: React.FC = () => {
  const [activities, setActivities] = useState<PendingActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState('all');
  const [selectedActivity, setSelectedActivity] = useState<PendingActivity | null>(null);

  useEffect(() => {
    fetchPendingActivities();
  }, []);

  const fetchPendingActivities = async () => {
    try {
      const response = await fetch(`${API_BASE}/student-details/pending`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setActivities(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch pending activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (activityId: string, status: 'approved' | 'rejected') => {
    setProcessingId(activityId);
    
    try {
      const response = await fetch(`${API_BASE}/student-details/${activityId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        const action = status === 'approved' ? 'approved' : 'rejected';
        alert(`Activity ${action} successfully!`);
        fetchPendingActivities(); // Refresh the list
      } else {
        const error = await response.json();
        alert(error.message || `Failed to ${status} activity`);
      }
    } catch (error) {
      alert(`Network error: Failed to ${status} activity`);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredActivities = filterType === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === filterType);

  const getActivityTypeLabel = (type: string) => {
    return activityTypes.find(t => t.value === type)?.label || type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Loading pending activities...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Filter */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-orange-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Activity Approvals ({filteredActivities.length})
          </h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            {activityTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Activities List */}
      <div className="bg-white rounded-lg shadow">
        {filteredActivities.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            {filterType === 'all' 
              ? 'No pending activities to review' 
              : `No pending ${getActivityTypeLabel(filterType).toLowerCase()} activities`}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredActivities.map(activity => (
              <div key={activity._id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </h4>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getActivityTypeLabel(activity.type)}
                      </span>
                    </div>
                    
                    <div className="mt-1 space-y-1">
                      <p className="text-sm text-gray-600">
                        <strong>Student:</strong> {activity.studentId.fullName} ({activity.studentId.universityRollNo})
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Description:</strong> {activity.description}
                      </p>
                      {activity.organization && (
                        <p className="text-sm text-gray-600">
                          <strong>Organization:</strong> {activity.organization}
                        </p>
                      )}
                      {activity.startDate && (
                        <p className="text-sm text-gray-600">
                          <strong>Date:</strong> {new Date(activity.startDate).toLocaleDateString()}
                          {activity.endDate && activity.endDate !== activity.startDate && (
                            <span> - {new Date(activity.endDate).toLocaleDateString()}</span>
                          )}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        Submitted: {new Date(activity.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => setSelectedActivity(activity)}
                      className="flex items-center space-x-1 px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View</span>
                    </button>
                    
                    <button
                      onClick={() => handleApproval(activity._id, 'approved')}
                      disabled={processingId === activity._id}
                      className="flex items-center space-x-1 px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      <CheckCircle className="w-3 h-3" />
                      <span>Approve</span>
                    </button>
                    
                    <button
                      onClick={() => handleApproval(activity._id, 'rejected')}
                      disabled={processingId === activity._id}
                      className="flex items-center space-x-1 px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                    >
                      <XCircle className="w-3 h-3" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Activity Details
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <p className="text-sm text-gray-900">{getActivityTypeLabel(selectedActivity.type)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <p className="text-sm text-gray-900">{selectedActivity.title}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Student</label>
                <p className="text-sm text-gray-900">
                  {selectedActivity.studentId.fullName} ({selectedActivity.studentId.universityRollNo})
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <p className="text-sm text-gray-900">{selectedActivity.description}</p>
              </div>
              
              {selectedActivity.organization && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Organization</label>
                  <p className="text-sm text-gray-900">{selectedActivity.organization}</p>
                </div>
              )}
              
              {selectedActivity.startDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedActivity.startDate).toLocaleDateString()}
                    {selectedActivity.endDate && selectedActivity.endDate !== selectedActivity.startDate && (
                      <span> - {new Date(selectedActivity.endDate).toLocaleDateString()}</span>
                    )}
                  </p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Proof Document</label>
                <a 
                  href={selectedActivity.driveLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Document</span>
                </a>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Submitted On</label>
                <p className="text-sm text-gray-900">
                  {new Date(selectedActivity.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <button
                onClick={() => setSelectedActivity(null)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleApproval(selectedActivity._id, 'rejected');
                  setSelectedActivity(null);
                }}
                disabled={processingId === selectedActivity._id}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                Reject
              </button>
              <button
                onClick={() => {
                  handleApproval(selectedActivity._id, 'approved');
                  setSelectedActivity(null);
                }}
                disabled={processingId === selectedActivity._id}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};