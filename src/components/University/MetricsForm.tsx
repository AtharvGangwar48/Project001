import React, { useState } from 'react';
import { X, BarChart3, Save } from 'lucide-react';

interface MetricsFormProps {
  onCancel: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export const MetricsForm: React.FC<MetricsFormProps> = ({ onCancel, onSuccess, initialData }) => {
  const [formData, setFormData] = useState({
    enrollment: {
      byGender: {
        male: initialData?.enrollment?.byGender?.male || '',
        female: initialData?.enrollment?.byGender?.female || '',
        other: initialData?.enrollment?.byGender?.other || ''
      },
      byCategory: {
        general: initialData?.enrollment?.byCategory?.general || '',
        obc: initialData?.enrollment?.byCategory?.obc || '',
        sc: initialData?.enrollment?.byCategory?.sc || '',
        st: initialData?.enrollment?.byCategory?.st || ''
      }
    },
    faculty: {
      totalFaculty: initialData?.faculty?.totalFaculty || '',
      phdQualified: initialData?.faculty?.phdQualified || '',
      studentFacultyRatio: initialData?.faculty?.studentFacultyRatio || ''
    },
    research: {
      funding: initialData?.research?.funding || '',
      publications: initialData?.research?.publications || '',
      scopusCitations: initialData?.research?.scopusCitations || '',
      wosCitations: initialData?.research?.wosCitations || ''
    },
    placements: {
      placementRate: initialData?.placements?.placementRate || '',
      internships: initialData?.placements?.internships || '',
      entrepreneurshipVentures: initialData?.placements?.entrepreneurshipVentures || '',
      avgSalary: initialData?.placements?.avgSalary || ''
    },
    academics: {
      examPassRate: initialData?.academics?.examPassRate || '',
      higherStudiesProgression: initialData?.academics?.higherStudiesProgression || ''
    },
    accreditation: {
      naacGrade: initialData?.accreditation?.naacGrade || '',
      nirfRank: initialData?.accreditation?.nirfRank || '',
      affiliatedColleges: initialData?.accreditation?.affiliatedColleges || '',
      accreditedColleges: initialData?.accreditation?.accreditedColleges || ''
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error updating metrics:', error);
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
            <BarChart3 className="h-6 w-6 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold">Update Performance Metrics</h2>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Enrollment */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Enrollment Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="number"
                placeholder="Male Students"
                value={formData.enrollment.byGender.male}
                onChange={(e) => updateNestedField('enrollment', 'byGender', e.target.value, 'male')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Female Students"
                value={formData.enrollment.byGender.female}
                onChange={(e) => updateNestedField('enrollment', 'byGender', e.target.value, 'female')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Other Gender"
                value={formData.enrollment.byGender.other}
                onChange={(e) => updateNestedField('enrollment', 'byGender', e.target.value, 'other')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="number"
                placeholder="General Category"
                value={formData.enrollment.byCategory.general}
                onChange={(e) => updateNestedField('enrollment', 'byCategory', e.target.value, 'general')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="OBC Students"
                value={formData.enrollment.byCategory.obc}
                onChange={(e) => updateNestedField('enrollment', 'byCategory', e.target.value, 'obc')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="SC Students"
                value={formData.enrollment.byCategory.sc}
                onChange={(e) => updateNestedField('enrollment', 'byCategory', e.target.value, 'sc')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="ST Students"
                value={formData.enrollment.byCategory.st}
                onChange={(e) => updateNestedField('enrollment', 'byCategory', e.target.value, 'st')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Faculty */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Faculty Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="number"
                placeholder="Total Faculty"
                value={formData.faculty.totalFaculty}
                onChange={(e) => updateNestedField('faculty', 'totalFaculty', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="PhD Qualified"
                value={formData.faculty.phdQualified}
                onChange={(e) => updateNestedField('faculty', 'phdQualified', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Student-Faculty Ratio"
                value={formData.faculty.studentFacultyRatio}
                onChange={(e) => updateNestedField('faculty', 'studentFacultyRatio', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Research */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Research Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="number"
                placeholder="Research Funding (₹)"
                value={formData.research.funding}
                onChange={(e) => updateNestedField('research', 'funding', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Publications"
                value={formData.research.publications}
                onChange={(e) => updateNestedField('research', 'publications', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Scopus Citations"
                value={formData.research.scopusCitations}
                onChange={(e) => updateNestedField('research', 'scopusCitations', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="WoS Citations"
                value={formData.research.wosCitations}
                onChange={(e) => updateNestedField('research', 'wosCitations', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Placements */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Placement & Career Outcomes</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="number"
                placeholder="Placement Rate (%)"
                value={formData.placements.placementRate}
                onChange={(e) => updateNestedField('placements', 'placementRate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Internships"
                value={formData.placements.internships}
                onChange={(e) => updateNestedField('placements', 'internships', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Startups/Ventures"
                value={formData.placements.entrepreneurshipVentures}
                onChange={(e) => updateNestedField('placements', 'entrepreneurshipVentures', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Average Salary (₹)"
                value={formData.placements.avgSalary}
                onChange={(e) => updateNestedField('placements', 'avgSalary', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Academics & Accreditation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Academic Performance</h3>
              <input
                type="number"
                placeholder="Exam Pass Rate (%)"
                value={formData.academics.examPassRate}
                onChange={(e) => updateNestedField('academics', 'examPassRate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Higher Studies (%)"
                value={formData.academics.higherStudiesProgression}
                onChange={(e) => updateNestedField('academics', 'higherStudiesProgression', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Accreditation Status</h3>
              <input
                type="text"
                placeholder="NAAC Grade (A++, A+, A, B++, etc.)"
                value={formData.accreditation.naacGrade}
                onChange={(e) => updateNestedField('accreditation', 'naacGrade', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="NIRF Rank"
                value={formData.accreditation.nirfRank}
                onChange={(e) => updateNestedField('accreditation', 'nirfRank', e.target.value)}
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
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Saving...' : 'Save Metrics'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};