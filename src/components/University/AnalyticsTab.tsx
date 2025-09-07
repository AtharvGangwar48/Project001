import React, { useState, useEffect } from 'react';
import { Activity, BookOpen, Search, Building, Settings, Edit, TrendingUp } from 'lucide-react';
import { AnalyticsForm } from './AnalyticsForm';

export const AnalyticsTab: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/metrics/analytics', { credentials: 'include' });
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    fetchAnalytics();
  };

  if (loading) {
    return <div className="flex justify-center py-8">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Activity Breakdown & Analytics</h2>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <Edit className="h-4 w-4 mr-2" />
          Update Analytics
        </button>
      </div>

      {!analytics?._id ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data</h3>
          <p className="text-gray-600 mb-4">Add your university's activity analytics to get started</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <Activity className="h-4 w-4 mr-2" />
            Add Analytics
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Teaching-Learning Analytics */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center mb-4">
              <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold">Teaching-Learning</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Class Utilization:</span>
                <span className="font-medium">{analytics.teachingLearning?.classUtilization || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Student Engagement:</span>
                <span className="font-medium">{analytics.teachingLearning?.studentEngagement || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Attendance Rate:</span>
                <span className="font-medium">{analytics.teachingLearning?.attendanceRate || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Feedback Score:</span>
                <span className="font-medium">{analytics.teachingLearning?.feedbackScore || 0}/10</span>
              </div>
            </div>
          </div>

          {/* Research Analytics */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-6 w-6 text-purple-600 mr-2" />
              <h3 className="text-lg font-semibold">Research Analytics</h3>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-2 bg-purple-50 rounded">
                  <div className="font-medium text-purple-900">{analytics.research?.ongoingProjects || 0}</div>
                  <div className="text-purple-600">Ongoing</div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded">
                  <div className="font-medium text-green-900">{analytics.research?.completedProjects || 0}</div>
                  <div className="text-green-600">Completed</div>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fund Utilization:</span>
                <span className="font-medium">{analytics.research?.fundUtilization || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Publication Quality:</span>
                <span className="font-medium">{analytics.research?.publicationQuality || 0}/10</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Project Duration:</span>
                <span className="font-medium">{analytics.research?.avgProjectDuration || 0} months</span>
              </div>
            </div>
          </div>

          {/* Extension & Outreach */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center mb-4">
              <Search className="h-6 w-6 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold">Extension & Outreach</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Programs:</span>
                <span className="font-medium">{analytics.extensionOutreach?.totalPrograms || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Beneficiaries:</span>
                <span className="font-medium">{analytics.extensionOutreach?.beneficiaries?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Impact Score:</span>
                <span className="font-medium">{analytics.extensionOutreach?.impactScore || 0}/10</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Community Reach:</span>
                <span className="font-medium">{analytics.extensionOutreach?.communityReach?.toLocaleString() || 0}</span>
              </div>
            </div>
          </div>

          {/* Infrastructure Utilization */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center mb-4">
              <Building className="h-6 w-6 text-orange-600 mr-2" />
              <h3 className="text-lg font-semibold">Infrastructure Utilization</h3>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-2 bg-orange-50 rounded">
                  <div className="font-medium text-orange-900">{analytics.infrastructure?.labUtilization || 0}%</div>
                  <div className="text-orange-600">Labs</div>
                </div>
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="font-medium text-blue-900">{analytics.infrastructure?.libraryUsage || 0}%</div>
                  <div className="text-blue-600">Library</div>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ICT Resources:</span>
                <span className="font-medium">{analytics.infrastructure?.ictResourceUsage || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Facility Maintenance:</span>
                <span className="font-medium">{analytics.infrastructure?.facilityMaintenance || 0}%</span>
              </div>
            </div>
          </div>

          {/* Governance & Administration */}
          <div className="bg-white p-6 rounded-lg shadow-sm border lg:col-span-2">
            <div className="flex items-center mb-4">
              <Settings className="h-6 w-6 text-red-600 mr-2" />
              <h3 className="text-lg font-semibold">Governance & Administration</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-red-50 rounded">
                <div className="text-2xl font-bold text-red-900">{analytics.governance?.decisionTimeline || 0}</div>
                <div className="text-red-600 text-sm">Decision Timeline (days)</div>
              </div>
              <div className="text-center p-4 bg-indigo-50 rounded">
                <div className="text-2xl font-bold text-indigo-900">{analytics.governance?.policyImplementations || 0}</div>
                <div className="text-indigo-600 text-sm">Policy Implementations</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded">
                <div className="text-2xl font-bold text-green-900">{analytics.governance?.complianceRate || 0}%</div>
                <div className="text-green-600 text-sm">Compliance Rate</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded">
                <div className="text-2xl font-bold text-yellow-900">{analytics.governance?.stakeholderSatisfaction || 0}/10</div>
                <div className="text-yellow-600 text-sm">Stakeholder Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <AnalyticsForm
          onCancel={() => setShowForm(false)}
          onSuccess={handleSuccess}
          initialData={analytics}
        />
      )}
    </div>
  );
};