import React, { useState } from 'react';
import { X, Award, Download } from 'lucide-react';

interface NAACReportFormProps {
  onCancel: () => void;
}

export const NAACReportForm: React.FC<NAACReportFormProps> = ({ onCancel }) => {
  const [formData, setFormData] = useState({
    curricularAspects: {
      curriculumDesign: '',
      cbcsImplementation: '',
      stakeholderFeedback: '',
      curriculumRevision: ''
    },
    teachingLearning: {
      studentTeacherRatio: '',
      learningOutcomes: '',
      mentoringSystem: '',
      evaluationReforms: '',
      assessmentOutcomes: ''
    },
    research: {
      researchFunding: '',
      publications: '',
      iprGenerated: '',
      collaborations: '',
      outreachActivities: '',
      extensionPrograms: ''
    },
    infrastructure: {
      libraryUsage: '',
      ictEnabledTeaching: '',
      physicalInfrastructure: '',
      learningResources: ''
    },
    studentSupport: {
      placementRate: '',
      higherStudies: '',
      scholarships: '',
      eventParticipation: '',
      alumniContributions: ''
    },
    governance: {
      visionMissionAlignment: '',
      iqacReports: '',
      leadershipQuality: '',
      managementSystems: ''
    },
    institutionalValues: {
      genderEquity: '',
      environmentalSustainability: '',
      inclusivityInitiatives: '',
      bestPractices: ''
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reports/naac', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const report = await response.json();
        const pdfResponse = await fetch(`/api/reports/naac/${report._id}/pdf`, {
          credentials: 'include'
        });
        
        if (pdfResponse.ok) {
          const blob = await pdfResponse.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `naac-report-${report._id}.pdf`;
          a.click();
          window.URL.revokeObjectURL(url);
        }
        
        onCancel();
      }
    } catch (error) {
      console.error('Error generating NAAC report:', error);
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
            <Award className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold">Generate NAAC Assessment Report</h2>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Criterion 1: Curricular Aspects */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-blue-900 border-b border-blue-200 pb-2">Criterion 1: Curricular Aspects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <textarea
                placeholder="Curriculum Design Process"
                value={formData.curricularAspects.curriculumDesign}
                onChange={(e) => updateField('curricularAspects', 'curriculumDesign', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
              />
              <textarea
                placeholder="CBCS Implementation"
                value={formData.curricularAspects.cbcsImplementation}
                onChange={(e) => updateField('curricularAspects', 'cbcsImplementation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
              />
            </div>
          </div>

          {/* Criterion 2: Teaching-Learning */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-blue-900 border-b border-blue-200 pb-2">Criterion 2: Teaching-Learning and Evaluation</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="number"
                placeholder="Student-Teacher Ratio"
                value={formData.teachingLearning.studentTeacherRatio}
                onChange={(e) => updateField('teachingLearning', 'studentTeacherRatio', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <textarea
                placeholder="Learning Outcomes"
                value={formData.teachingLearning.learningOutcomes}
                onChange={(e) => updateField('teachingLearning', 'learningOutcomes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={2}
              />
              <textarea
                placeholder="Mentoring System"
                value={formData.teachingLearning.mentoringSystem}
                onChange={(e) => updateField('teachingLearning', 'mentoringSystem', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={2}
              />
            </div>
          </div>

          {/* Criterion 3: Research */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-blue-900 border-b border-blue-200 pb-2">Criterion 3: Research, Innovations & Extension</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="number"
                placeholder="Research Funding (₹)"
                value={formData.research.researchFunding}
                onChange={(e) => updateField('research', 'researchFunding', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Publications"
                value={formData.research.publications}
                onChange={(e) => updateField('research', 'publications', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="IPR Generated"
                value={formData.research.iprGenerated}
                onChange={(e) => updateField('research', 'iprGenerated', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Collaborations"
                value={formData.research.collaborations}
                onChange={(e) => updateField('research', 'collaborations', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Criterion 4: Infrastructure */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-blue-900 border-b border-blue-200 pb-2">Criterion 4: Infrastructure & Learning Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <textarea
                placeholder="Library Usage Statistics"
                value={formData.infrastructure.libraryUsage}
                onChange={(e) => updateField('infrastructure', 'libraryUsage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={2}
              />
              <textarea
                placeholder="ICT-Enabled Teaching"
                value={formData.infrastructure.ictEnabledTeaching}
                onChange={(e) => updateField('infrastructure', 'ictEnabledTeaching', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={2}
              />
            </div>
          </div>

          {/* Criterion 5: Student Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-blue-900 border-b border-blue-200 pb-2">Criterion 5: Student Support & Progression</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="number"
                placeholder="Placement Rate (%)"
                value={formData.studentSupport.placementRate}
                onChange={(e) => updateField('studentSupport', 'placementRate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Higher Studies (%)"
                value={formData.studentSupport.higherStudies}
                onChange={(e) => updateField('studentSupport', 'higherStudies', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Scholarships"
                value={formData.studentSupport.scholarships}
                onChange={(e) => updateField('studentSupport', 'scholarships', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Criterion 6: Governance */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-blue-900 border-b border-blue-200 pb-2">Criterion 6: Governance, Leadership & Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <textarea
                placeholder="Vision-Mission Alignment"
                value={formData.governance.visionMissionAlignment}
                onChange={(e) => updateField('governance', 'visionMissionAlignment', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={2}
              />
              <textarea
                placeholder="IQAC Reports & Activities"
                value={formData.governance.iqacReports}
                onChange={(e) => updateField('governance', 'iqacReports', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={2}
              />
            </div>
          </div>

          {/* Criterion 7: Institutional Values */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-blue-900 border-b border-blue-200 pb-2">Criterion 7: Institutional Values & Best Practices</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <textarea
                placeholder="Gender Equity Initiatives"
                value={formData.institutionalValues.genderEquity}
                onChange={(e) => updateField('institutionalValues', 'genderEquity', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={2}
              />
              <textarea
                placeholder="Environmental Sustainability"
                value={formData.institutionalValues.environmentalSustainability}
                onChange={(e) => updateField('institutionalValues', 'environmentalSustainability', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={2}
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
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              <Download className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Generating...' : 'Generate NAAC Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};