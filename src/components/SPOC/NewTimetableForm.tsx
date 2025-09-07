import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

interface NewTimetableFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  courses: any[];
  sections: any[];
  faculty: any[];
}

export const NewTimetableForm: React.FC<NewTimetableFormProps> = ({ 
  onSuccess, onCancel, courses, sections, faculty 
}) => {
  const [formData, setFormData] = useState({
    programId: '',
    sectionName: '',
    courseName: '',
    courseCode: '',
    facultyId: '',
    facultyName: '',
    dayOfWeek: '',
    startTime: '',
    endTime: '',
    room: '',
    year: '',
    semester: ''
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSection = sections.find(s => s.name === e.target.value);
    setFormData(prev => ({
      ...prev,
      sectionName: e.target.value,
      year: selectedSection?.year || '',
      semester: selectedSection?.semester || ''
    }));
  };

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCourse = courses.find(c => c.name === e.target.value);
    setFormData(prev => ({
      ...prev,
      courseName: e.target.value,
      courseCode: selectedCourse?.code || ''
    }));
  };

  const handleFacultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFaculty = faculty.find(f => f.name === e.target.value);
    setFormData(prev => ({
      ...prev,
      facultyName: e.target.value,
      facultyId: selectedFaculty?.facultyId || selectedFaculty?._id || ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/class-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          universityId: user?.universityId,
          createdBy: user?.id || 'spoc'
        })
      });
      
      if (response.ok) {
        onSuccess();
        alert('Class scheduled successfully!');
      } else {
        const text = await response.text();
        let errorMessage = 'Failed to schedule class';
        try {
          const error = JSON.parse(text);
          errorMessage = error.message || errorMessage;
        } catch (e) {
          errorMessage = text || errorMessage;
        }
        alert(`Failed to schedule class: ${errorMessage}`);
      }
    } catch (error) {
      alert(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Schedule Class</h3>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Program ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Program ID *</label>
            <input
              type="text"
              name="programId"
              required
              value={formData.programId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter program ID"
            />
          </div>

          {/* Section and Course */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section *</label>
              <select
                name="sectionName"
                required
                value={formData.sectionName}
                onChange={handleSectionChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Section</option>
                {sections.map((section: any) => (
                  <option key={section._id} value={section.name}>
                    {section.name} - Year {section.year}, Sem {section.semester}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course *</label>
              <select
                name="courseName"
                required
                value={formData.courseName}
                onChange={handleCourseChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Course</option>
                {courses.map((course: any) => (
                  <option key={course._id} value={course.name}>
                    {course.name} ({course.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Faculty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Faculty *</label>
            <select
              name="facultyName"
              required
              value={formData.facultyName}
              onChange={handleFacultyChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Faculty</option>
              {faculty.map((member: any) => (
                <option key={member._id} value={member.name}>
                  {member.name} ({member.facultyId || 'No ID'})
                </option>
              ))}
            </select>
          </div>

          {/* Schedule Details */}
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Day *</label>
              <select
                name="dayOfWeek"
                required
                value={formData.dayOfWeek}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Day</option>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
              <input
                type="time"
                name="startTime"
                required
                value={formData.startTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
              <input
                type="time"
                name="endTime"
                required
                value={formData.endTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room *</label>
              <input
                type="text"
                name="room"
                required
                value={formData.room}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Room 101"
              />
            </div>
          </div>

          {/* Academic Info (Auto-filled from section) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
              <input
                type="number"
                name="semester"
                value={formData.semester}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Scheduling...' : 'Schedule Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};