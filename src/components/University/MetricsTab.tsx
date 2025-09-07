import React, { useState, useEffect } from 'react';
import { BarChart3, Users, GraduationCap, Award, Edit, TrendingUp } from 'lucide-react';
import { MetricsForm } from './MetricsForm';

export const MetricsTab: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/metrics', { credentials: 'include' });
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    fetchMetrics();
  };

  if (loading) {
    return <div className="flex justify-center py-8">Loading metrics...</div>;
  }

  const totalEnrollment = metrics?.enrollment ? 
    (metrics.enrollment.byGender?.male || 0) + 
    (metrics.enrollment.byGender?.female || 0) + 
    (metrics.enrollment.byGender?.other || 0) : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Performance Metrics & Statistics</h2>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <Edit className="h-4 w-4 mr-2" />
          Update Metrics
        </button>
      </div>

      {!metrics?._id ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Metrics Data</h3>
          <p className="text-gray-600 mb-4">Add your university's performance metrics to get started</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Add Metrics
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Enrollment Statistics */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center mb-4">
              <Users className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold">Enrollment Statistics</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Students:</span>
                <span className="font-medium">{totalEnrollment.toLocaleString()}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="font-medium text-blue-900">{metrics.enrollment?.byGender?.male || 0}</div>
                  <div className="text-blue-600">Male</div>
                </div>
                <div className="text-center p-2 bg-pink-50 rounded">
                  <div className="font-medium text-pink-900">{metrics.enrollment?.byGender?.female || 0}</div>
                  <div className="text-pink-600">Female</div>
                </div>
                <div className="text-center p-2 bg-purple-50 rounded">
                  <div className="font-medium text-purple-900">{metrics.enrollment?.byGender?.other || 0}</div>
                  <div className="text-purple-600">Other</div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-medium">{metrics.enrollment?.byCategory?.general || 0}</div>
                  <div className="text-gray-600">General</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-medium">{metrics.enrollment?.byCategory?.obc || 0}</div>
                  <div className="text-gray-600">OBC</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-medium">{metrics.enrollment?.byCategory?.sc || 0}</div>
                  <div className="text-gray-600">SC</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-medium">{metrics.enrollment?.byCategory?.st || 0}</div>
                  <div className="text-gray-600">ST</div>
                </div>
              </div>
            </div>
          </div>

          {/* Faculty Statistics */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center mb-4">
              <GraduationCap className="h-6 w-6 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold">Faculty Profile</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Faculty:</span>
                <span className="font-medium">{metrics.faculty?.totalFaculty || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">PhD Qualified:</span>
                <span className="font-medium">{metrics.faculty?.phdQualified || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Student-Faculty Ratio:</span>
                <span className="font-medium">{metrics.faculty?.studentFacultyRatio || 0}:1</span>
              </div>
            </div>
          </div>

          {/* Research Metrics */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-6 w-6 text-purple-600 mr-2" />
              <h3 className="text-lg font-semibold">Research Output</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Research Funding:</span>
                <span className="font-medium">₹{metrics.research?.funding?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Publications:</span>
                <span className="font-medium">{metrics.research?.publications || 0}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-2 bg-purple-50 rounded">
                  <div className="font-medium text-purple-900">{metrics.research?.scopusCitations || 0}</div>
                  <div className="text-purple-600">Scopus Citations</div>
                </div>
                <div className="text-center p-2 bg-indigo-50 rounded">
                  <div className="font-medium text-indigo-900">{metrics.research?.wosCitations || 0}</div>
                  <div className="text-indigo-600">WoS Citations</div>
                </div>
              </div>
            </div>
          </div>

          {/* Placement Statistics */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center mb-4">
              <Award className="h-6 w-6 text-orange-600 mr-2" />
              <h3 className="text-lg font-semibold">Career Outcomes</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Placement Rate:</span>
                <span className="font-medium">{metrics.placements?.placementRate || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average Salary:</span>
                <span className="font-medium">₹{metrics.placements?.avgSalary?.toLocaleString() || 0}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-2 bg-orange-50 rounded">
                  <div className="font-medium text-orange-900">{metrics.placements?.internships || 0}</div>
                  <div className="text-orange-600">Internships</div>
                </div>
                <div className="text-center p-2 bg-yellow-50 rounded">
                  <div className="font-medium text-yellow-900">{metrics.placements?.entrepreneurshipVentures || 0}</div>
                  <div className="text-yellow-600">Startups</div>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Performance */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center mb-4">
              <BarChart3 className="h-6 w-6 text-red-600 mr-2" />
              <h3 className="text-lg font-semibold">Academic Performance</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Exam Pass Rate:</span>
                <span className="font-medium">{metrics.academics?.examPassRate || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Higher Studies:</span>
                <span className="font-medium">{metrics.academics?.higherStudiesProgression || 0}%</span>
              </div>
            </div>
          </div>

          {/* Accreditation Status */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center mb-4">
              <Award className="h-6 w-6 text-yellow-600 mr-2" />
              <h3 className="text-lg font-semibold">Rankings & Accreditation</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">NAAC Grade:</span>
                <span className="font-medium">{metrics.accreditation?.naacGrade || 'Not Available'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">NIRF Rank:</span>
                <span className="font-medium">{metrics.accreditation?.nirfRank || 'Not Ranked'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <MetricsForm
          onCancel={() => setShowForm(false)}
          onSuccess={handleSuccess}
          initialData={metrics}
        />
      )}
    </div>
  );
};