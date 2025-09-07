import React, { useState } from 'react';
import { X, Activity, Save } from 'lucide-react';

interface AnalyticsFormProps {
  onCancel: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export const AnalyticsForm: React.FC<AnalyticsFormProps> = ({ onCancel, onSuccess, initialData }) => {
  const [formData, setFormData] = useState({
    teachingLearning: {
      classUtilization: initialData?.teachingLearning?.classUtilization || '',
      studentEngagement: initialData?.teachingLearning?.studentEngagement || '',
      attendanceRate: initialData?.teachingLearning?.attendanceRate || '',
      feedbackScore: initialData?.teachingLearning?.feedbackScore || ''
    },
    research: {
      ongoingProjects: initialData?.research?.ongoingProjects || '',
      completedProjects: initialData?.research?.completedProjects || '',
      fundUtilization: initialData?.research?.fundUtilization || '',
      publicationQuality: initialData?.research?.publicationQuality || '',
      avgProjectDuration: initialData?.research?.avgProjectDuration || ''
    },
    extensionOutreach: {
      totalPrograms: initialData?.extensionOutreach?.totalPrograms || '',
      beneficiaries: initialData?.extensionOutreach?.beneficiaries || '',
      impactScore: initialData?.extensionOutreach?.impactScore || '',
      communityReach: initialData?.extensionOutreach?.communityReach || ''
    },
    infrastructure: {
      labUtilization: initialData?.infrastructure?.labUtilization || '',
      libraryUsage: initialData?.infrastructure?.libraryUsage || '',
      ictResourceUsage: initialData?.infrastructure?.ictResourceUsage || '',
      facilityMaintenance: initialData?.infrastructure?.facilityMaintenance || ''
    },
    governance: {
      decisionTimeline: initialData?.governance?.decisionTimeline || '',
      policyImplementations: initialData?.governance?.policyImplementations || '',
      complianceRate: initialData?.governance?.complianceRate || '',
      stakeholderSatisfaction: initialData?.governance?.stakeholderSatisfaction || ''
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/metrics/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error updating analytics:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (section: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <Activity className="h-6 w-6 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold">Update Activity Analytics</h2>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Teaching-Learning */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Teaching-Learning Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="number"
                placeholder="Class Utilization (%)"
                value={formData.teachingLearning.classUtilization}
                onChange={(e) => updateField('teachingLearning', 'classUtilization', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                max="100"
              />
              <input
                type="number"
                placeholder="Student Engagement (%)"
                value={formData.teachingLearning.studentEngagement}
                onChange={(e) => updateField('teachingLearning', 'studentEngagement', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                max="100"
              />
              <input
                type="number"
                placeholder="Attendance Rate (%)"
                value={formData.teachingLearning.attendanceRate}
                onChange={(e) => updateField('teachingLearning', 'attendanceRate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                max="100"
              />
              <input
                type="number"
                placeholder="Feedback Score (1-10)"
                value={formData.teachingLearning.feedbackScore}
                onChange={(e) => updateField('teachingLearning', 'feedbackScore', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                max="10"
              />
            </div>
          </div>

          {/* Research */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Research Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="number"
                placeholder="Ongoing Projects"
                value={formData.research.ongoingProjects}
                onChange={(e) => updateField('research', 'ongoingProjects', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Completed Projects"
                value={formData.research.completedProjects}
                onChange={(e) => updateField('research', 'completedProjects', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Fund Utilization (%)"
                value={formData.research.fundUtilization}
                onChange={(e) => updateField('research', 'fundUtilization', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                max="100"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Publication Quality Score (1-10)"
                value={formData.research.publicationQuality}
                onChange={(e) => updateField('research', 'publicationQuality', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                max="10"
              />
              <input
                type="number"
                placeholder="Avg Project Duration (months)"
                value={formData.research.avgProjectDuration}
                onChange={(e) => updateField('research', 'avgProjectDuration', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Extension & Outreach */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Extension & Outreach</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="number"
                placeholder="Total Programs"
                value={formData.extensionOutreach.totalPrograms}
                onChange={(e) => updateField('extensionOutreach', 'totalPrograms', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Beneficiaries"
                value={formData.extensionOutreach.beneficiaries}
                onChange={(e) => updateField('extensionOutreach', 'beneficiaries', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Impact Score (1-10)"
                value={formData.extensionOutreach.impactScore}
                onChange={(e) => updateField('extensionOutreach', 'impactScore', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                max="10"
              />
              <input
                type="number"
                placeholder="Community Reach"
                value={formData.extensionOutreach.communityReach}
                onChange={(e) => updateField('extensionOutreach', 'communityReach', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Infrastructure */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Infrastructure Utilization</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="number"
                placeholder="Lab Utilization (%)"
                value={formData.infrastructure.labUtilization}
                onChange={(e) => updateField('infrastructure', 'labUtilization', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                max="100"
              />
              <input
                type="number"
                placeholder="Library Usage (%)"
                value={formData.infrastructure.libraryUsage}
                onChange={(e) => updateField('infrastructure', 'libraryUsage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                max="100"
              />
              <input
                type="number"
                placeholder="ICT Resource Usage (%)"
                value={formData.infrastructure.ictResourceUsage}
                onChange={(e) => updateField('infrastructure', 'ictResourceUsage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                max="100"
              />
              <input
                type="number"
                placeholder="Facility Maintenance (%)"
                value={formData.infrastructure.facilityMaintenance}
                onChange={(e) => updateField('infrastructure', 'facilityMaintenance', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                max="100"
              />
            </div>
          </div>

          {/* Governance */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Governance & Administration</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="number"
                placeholder="Decision Timeline (days)"
                value={formData.governance.decisionTimeline}
                onChange={(e) => updateField('governance', 'decisionTimeline', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Policy Implementations"
                value={formData.governance.policyImplementations}
                onChange={(e) => updateField('governance', 'policyImplementations', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Compliance Rate (%)"
                value={formData.governance.complianceRate}
                onChange={(e) => updateField('governance', 'complianceRate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                max="100"
              />
              <input
                type="number"
                placeholder="Stakeholder Satisfaction (1-10)"
                value={formData.governance.stakeholderSatisfaction}
                onChange={(e) => updateField('governance', 'stakeholderSatisfaction', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                max="10"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Saving...' : 'Save Analytics'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};