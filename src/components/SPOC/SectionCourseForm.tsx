import React, { useState, useEffect } from 'react';
import { getCourses, getSections, getFaculty } from '../../services/dataService';

interface SectionCourseFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const SectionCourseForm: React.FC<SectionCourseFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    sectionId: '',
    courseId: '',
    assignedFaculty: ''
  });
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesData, sectionsData, facultyData] = await Promise.all([
        getCourses(),
        getSections(),
        getFaculty()
      ]);
      setCourses(coursesData);
      setSections(sectionsData);
      setFaculty(facultyData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:3001/api/section-courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        onSuccess();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to assign course to section');
      }
    } catch (error) {
      alert('Failed to assign course to section');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Assign Course to Section</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section *</label>
            <select
              name="sectionId"
              required
              value={formData.sectionId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select section</option>
              {sections.map((section: any) => (
                <option key={section._id} value={section._id}>
                  {section.name} - Year {section.year}, Semester {section.semester}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course *</label>
            <select
              name="courseId"
              required
              value={formData.courseId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select course</option>
              {courses.map((course: any) => (
                <option key={course._id} value={course._id}>
                  {course.name} ({course.code}) - {course.credits} credits
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Faculty</label>
            <select
              name="assignedFaculty"
              value={formData.assignedFaculty}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select faculty (optional)</option>
              {faculty.map((member: any) => (
                <option key={member._id} value={member._id}>
                  {member.name} ({member.designation})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Assigning...' : 'Assign Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};