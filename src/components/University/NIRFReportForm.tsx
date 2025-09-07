import React, { useState } from 'react';
import { X, Trophy, Download } from 'lucide-react';

interface NIRFReportFormProps {
  onCancel: () => void;
}

export const NIRFReportForm: React.FC<NIRFReportFormProps> = ({ onCancel }) => {
  const [formData, setFormData] = useState({
    teachingLearning: {
      facultyStudentRatio: '',
      facultyQualification: '',
      studentStrength: '',
      financialResources: '',
      resourceUtilization: ''
    },
    research: {
      publications: '',
      patents: '',
      projects: '',
      citations: '',
      iprs: '',
      collaborations: ''
    },
    graduationOutcomes: {
      placementRate: '',
      higherEducation: '',
      entrepreneurship: '',
      examResults: '',
      avgSalaryPackage: ''
    },
    outreachInclusivity: {
      regionalDiversity: '',
      genderDiversity: '',
      disadvantagedGroups: '',
      outreachPrograms: '',
      socialResponsibility: ''
    },
    perception: {
      employerSurvey: '',
      academicPeerSurvey: '',
      publicPerception: ''
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reports/nirf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const report = await response.json();
        const pdfResponse = await fetch(`/api/reports/nirf/${report._id}/pdf`, {
          credentials: 'include'
        });
        
        if (pdfResponse.ok) {
          const blob = await pdfResponse.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `nirf-report-${report._id}.pdf`;
          a.click();
          window.URL.revokeObjectURL(url);
        }
        
        onCancel();
      }
    } catch (error) {
      console.error('Error generating NIRF report:', error);
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
            <Trophy className="h-6 w-6 text-red-600 mr-2" />
            <h2 className="text-xl font-semibold">Generate NIRF Ranking Data Report</h2>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Teaching, Learning & Resources (30%) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-red-900 border-b border-red-200 pb-2">Teaching, Learning & Resources</h3>
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">30%</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="number"
                placeholder="Faculty-Student Ratio"
                value={formData.teachingLearning.facultyStudentRatio}
                onChange={(e) => updateField('teachingLearning', 'facultyStudentRatio', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Student Strength"
                value={formData.teachingLearning.studentStrength}
                onChange={(e) => updateField('teachingLearning', 'studentStrength', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Financial Resources (₹)"
                value={formData.teachingLearning.financialResources}
                onChange={(e) => updateField('teachingLearning', 'financialResources', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Research & Professional Practice (30%) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-red-900 border-b border-red-200 pb-2">Research & Professional Practice</h3>
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">30%</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="number"
                placeholder="Publications"
                value={formData.research.publications}
                onChange={(e) => updateField('research', 'publications', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Patents"
                value={formData.research.patents}
                onChange={(e) => updateField('research', 'patents', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Research Projects"
                value={formData.research.projects}
                onChange={(e) => updateField('research', 'projects', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="number"
                placeholder="Citations"
                value={formData.research.citations}
                onChange={(e) => updateField('research', 'citations', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="IPRs"
                value={formData.research.iprs}
                onChange={(e) => updateField('research', 'iprs', e.target.value)}
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

          {/* Graduation Outcomes (20%) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-red-900 border-b border-red-200 pb-2">Graduation Outcomes</h3>
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">20%</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="number"
                placeholder="Placement Rate (%)"
                value={formData.graduationOutcomes.placementRate}
                onChange={(e) => updateField('graduationOutcomes', 'placementRate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Higher Education (%)"
                value={formData.graduationOutcomes.higherEducation}
                onChange={(e) => updateField('graduationOutcomes', 'higherEducation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Entrepreneurship (%)"
                value={formData.graduationOutcomes.entrepreneurship}
                onChange={(e) => updateField('graduationOutcomes', 'entrepreneurship', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Exam Results (%)"
                value={formData.graduationOutcomes.examResults}
                onChange={(e) => updateField('graduationOutcomes', 'examResults', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Average Salary Package (₹)"
                value={formData.graduationOutcomes.avgSalaryPackage}
                onChange={(e) => updateField('graduationOutcomes', 'avgSalaryPackage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Outreach & Inclusivity (10%) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-red-900 border-b border-red-200 pb-2">Outreach & Inclusivity</h3>
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">10%</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="number"
                placeholder="Regional Diversity (%)"
                value={formData.outreachInclusivity.regionalDiversity}
                onChange={(e) => updateField('outreachInclusivity', 'regionalDiversity', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Gender Diversity (%)"
                value={formData.outreachInclusivity.genderDiversity}
                onChange={(e) => updateField('outreachInclusivity', 'genderDiversity', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Disadvantaged Groups (%)"
                value={formData.outreachInclusivity.disadvantagedGroups}
                onChange={(e) => updateField('outreachInclusivity', 'disadvantagedGroups', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Perception (10%) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-red-900 border-b border-red-200 pb-2">Perception</h3>
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">10%</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="number"
                placeholder="Employer Survey (0-100)"
                value={formData.perception.employerSurvey}
                onChange={(e) => updateField('perception', 'employerSurvey', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                max="100"
              />
              <input
                type="number"
                placeholder="Academic Peer Survey (0-100)"
                value={formData.perception.academicPeerSurvey}
                onChange={(e) => updateField('perception', 'academicPeerSurvey', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                max="100"
              />
              <input
                type="number"
                placeholder="Public Perception (0-100)"
                value={formData.perception.publicPerception}
                onChange={(e) => updateField('perception', 'publicPerception', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                max="100"
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
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              <Download className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Generating...' : 'Generate NIRF Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};