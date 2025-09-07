import React, { useState } from 'react';
import { X, FileText, Download } from 'lucide-react';

interface InstitutionalReportFormProps {
  onCancel: () => void;
}

export const InstitutionalReportForm: React.FC<InstitutionalReportFormProps> = ({ onCancel }) => {
  const [formData, setFormData] = useState({
    basicInfo: {
      institutionName: '',
      address: '',
      establishmentYear: '',
      type: 'public',
      affiliation: '',
      recognition: '',
      vision: '',
      mission: '',
      objectives: '',
      governanceStructure: ''
    },
    academicInfo: {
      programsOffered: '',
      curriculumDesign: '',
      studentStrength: {
        admissions: '',
        enrollment: '',
        dropoutRate: ''
      },
      facultyProfile: {
        totalFaculty: '',
        qualifications: '',
        avgExperience: '',
        studentFacultyRatio: ''
      },
      research: {
        projects: '',
        publications: '',
        patents: '',
        mous: ''
      }
    },
    infrastructure: {
      classrooms: '',
      labs: '',
      libraryFacilities: '',
      ictFacilities: '',
      hostelCapacity: '',
      sportsComplexes: '',
      culturalFacilities: '',
      healthFacilities: ''
    },
    finance: {
      budgetAllocation: '',
      budgetUtilization: '',
      fundingSources: {
        government: '',
        private: '',
        csr: '',
        projects: ''
      }
    },
    studentSupport: {
      scholarships: '',
      placementRate: '',
      entrepreneurshipCells: '',
      feedbackSystems: ''
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const report = await response.json();
        // Generate PDF
        const pdfResponse = await fetch(`/api/reports/${report._id}/pdf`, {
          credentials: 'include'
        });
        
        if (pdfResponse.ok) {
          const blob = await pdfResponse.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `institutional-report-${report._id}.pdf`;
          a.click();
          window.URL.revokeObjectURL(url);
        }
        
        onCancel();
      }
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateNestedField = (section: string, field: string, value: string, subField?: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: subField ? {
          ...prev[section as keyof typeof prev][field as keyof any],
          [subField]: value
        } : value
      }
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <FileText className="h-6 w-6 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold">Generate Institutional Report</h2>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Institution Name"
                value={formData.basicInfo.institutionName}
                onChange={(e) => updateNestedField('basicInfo', 'institutionName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="text"
                placeholder="Address"
                value={formData.basicInfo.address}
                onChange={(e) => updateNestedField('basicInfo', 'address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Establishment Year"
                value={formData.basicInfo.establishmentYear}
                onChange={(e) => updateNestedField('basicInfo', 'establishmentYear', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <select
                value={formData.basicInfo.type}
                onChange={(e) => updateNestedField('basicInfo', 'type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
            <textarea
              placeholder="Vision"
              value={formData.basicInfo.vision}
              onChange={(e) => updateNestedField('basicInfo', 'vision', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={2}
            />
            <textarea
              placeholder="Mission"
              value={formData.basicInfo.mission}
              onChange={(e) => updateNestedField('basicInfo', 'mission', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={2}
            />
          </div>

          {/* Academic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Academic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="number"
                placeholder="Total Admissions"
                value={formData.academicInfo.studentStrength.admissions}
                onChange={(e) => updateNestedField('academicInfo', 'studentStrength', e.target.value, 'admissions')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Current Enrollment"
                value={formData.academicInfo.studentStrength.enrollment}
                onChange={(e) => updateNestedField('academicInfo', 'studentStrength', e.target.value, 'enrollment')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Total Faculty"
                value={formData.academicInfo.facultyProfile.totalFaculty}
                onChange={(e) => updateNestedField('academicInfo', 'facultyProfile', e.target.value, 'totalFaculty')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="number"
                placeholder="Research Projects"
                value={formData.academicInfo.research.projects}
                onChange={(e) => updateNestedField('academicInfo', 'research', e.target.value, 'projects')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Publications"
                value={formData.academicInfo.research.publications}
                onChange={(e) => updateNestedField('academicInfo', 'research', e.target.value, 'publications')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Patents"
                value={formData.academicInfo.research.patents}
                onChange={(e) => updateNestedField('academicInfo', 'research', e.target.value, 'patents')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="MoUs"
                value={formData.academicInfo.research.mous}
                onChange={(e) => updateNestedField('academicInfo', 'research', e.target.value, 'mous')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Infrastructure */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Infrastructure</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="number"
                placeholder="Classrooms"
                value={formData.infrastructure.classrooms}
                onChange={(e) => updateNestedField('infrastructure', 'classrooms', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Laboratories"
                value={formData.infrastructure.labs}
                onChange={(e) => updateNestedField('infrastructure', 'labs', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Hostel Capacity"
                value={formData.infrastructure.hostelCapacity}
                onChange={(e) => updateNestedField('infrastructure', 'hostelCapacity', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Sports Complexes"
                value={formData.infrastructure.sportsComplexes}
                onChange={(e) => updateNestedField('infrastructure', 'sportsComplexes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Finance */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Financial Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Budget Allocation (₹)"
                value={formData.finance.budgetAllocation}
                onChange={(e) => updateNestedField('finance', 'budgetAllocation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Budget Utilization (₹)"
                value={formData.finance.budgetUtilization}
                onChange={(e) => updateNestedField('finance', 'budgetUtilization', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="number"
                placeholder="Government Funding (₹)"
                value={formData.finance.fundingSources.government}
                onChange={(e) => updateNestedField('finance', 'fundingSources', e.target.value, 'government')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Private Funding (₹)"
                value={formData.finance.fundingSources.private}
                onChange={(e) => updateNestedField('finance', 'fundingSources', e.target.value, 'private')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="CSR Funding (₹)"
                value={formData.finance.fundingSources.csr}
                onChange={(e) => updateNestedField('finance', 'fundingSources', e.target.value, 'csr')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Project Funding (₹)"
                value={formData.finance.fundingSources.projects}
                onChange={(e) => updateNestedField('finance', 'fundingSources', e.target.value, 'projects')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Student Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Student Support</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="number"
                placeholder="Scholarships Provided"
                value={formData.studentSupport.scholarships}
                onChange={(e) => updateNestedField('studentSupport', 'scholarships', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Placement Rate (%)"
                value={formData.studentSupport.placementRate}
                onChange={(e) => updateNestedField('studentSupport', 'placementRate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Entrepreneurship Cells"
                value={formData.studentSupport.entrepreneurshipCells}
                onChange={(e) => updateNestedField('studentSupport', 'entrepreneurshipCells', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
              <Download className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Generating...' : 'Generate PDF Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};