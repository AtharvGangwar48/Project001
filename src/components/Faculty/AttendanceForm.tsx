import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const API_BASE = process.env.NODE_ENV === 'development' && typeof window !== 'undefined'
  ? `https://${window.location.hostname}:3001/api`
  : 'http://localhost:3001/api';

export const AttendanceForm: React.FC = () => {
  const { timetableId } = useParams<{ timetableId: string }>();
  const [classData, setClassData] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchClassData();
  }, [timetableId, selectedDate]);

  const fetchClassData = async () => {
    try {
      const response = await fetch(`${API_BASE}/attendance/${timetableId}?date=${selectedDate}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setClassData(data.data);
        
        // Initialize attendance data
        const initialAttendance: {[key: string]: string} = {};
        if (data.data.attendance) {
          data.data.attendance.students.forEach((student: any) => {
            initialAttendance[student.studentId] = student.status;
          });
        } else {
          // Default all students to present
          data.data.students.forEach((sectionStudent: any) => {
            initialAttendance[sectionStudent.studentId._id] = 'present';
          });
        }
        setAttendanceData(initialAttendance);
      }
    } catch (error) {
      console.error('Failed to fetch class data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (studentId: string, status: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const students = classData.students.map((sectionStudent: any) => ({
        studentId: sectionStudent.studentId._id,
        universityRollNo: sectionStudent.universityRollNo,
        status: attendanceData[sectionStudent.studentId._id] || 'absent'
      }));

      const response = await fetch(`${API_BASE}/attendance/${timetableId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          date: selectedDate,
          students
        })
      });

      if (response.ok) {
        alert('Attendance marked successfully!');
        fetchClassData(); // Refresh data
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to mark attendance');
      }
    } catch (error) {
      alert('Network error: Failed to mark attendance');
    } finally {
      setSaving(false);
    }
  };

  const presentCount = Object.values(attendanceData).filter(status => status === 'present').length;
  const totalStudents = classData?.students?.length || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium text-gray-900">Loading class data...</div>
        </div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium text-gray-900">Class not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Mark Attendance</h1>
            <div className="mt-2 text-sm text-gray-600">
              <p><strong>Course:</strong> {classData.timetable.courseId.name} ({classData.timetable.courseId.code})</p>
              <p><strong>Section:</strong> {classData.timetable.sectionId.name} - Year {classData.timetable.sectionId.year}, Semester {classData.timetable.sectionId.semester}</p>
              <p><strong>Faculty:</strong> {classData.timetable.facultyId.name}</p>
              <p><strong>Time:</strong> {classData.timetable.startTime} - {classData.timetable.endTime}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Students</h2>
                <div className="text-sm text-gray-600">
                  Present: {presentCount} / {totalStudents}
                </div>
              </div>

              <div className="space-y-3">
                {classData.students.map((sectionStudent: any) => (
                  <div key={sectionStudent._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">
                        {sectionStudent.studentId.fullName}
                      </div>
                      <div className="text-sm text-gray-600">
                        Roll: {sectionStudent.sectionRollNo} | University: {sectionStudent.universityRollNo}
                      </div>
                    </div>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={`attendance-${sectionStudent.studentId._id}`}
                          value="present"
                          checked={attendanceData[sectionStudent.studentId._id] === 'present'}
                          onChange={() => handleAttendanceChange(sectionStudent.studentId._id, 'present')}
                          className="mr-2"
                        />
                        <span className="text-green-600">Present</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={`attendance-${sectionStudent.studentId._id}`}
                          value="absent"
                          checked={attendanceData[sectionStudent.studentId._id] === 'absent'}
                          onChange={() => handleAttendanceChange(sectionStudent.studentId._id, 'absent')}
                          className="mr-2"
                        />
                        <span className="text-red-600">Absent</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => window.close()}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Mark Attendance'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};