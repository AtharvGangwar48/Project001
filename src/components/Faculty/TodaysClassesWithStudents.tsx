import React, { useState, useEffect } from 'react';

export const TodaysClassesWithStudents: React.FC = () => {
  const [classes, setClasses] = useState([]);
  const [expandedClass, setExpandedClass] = useState<string | null>(null);
  const [students, setStudents] = useState<{[key: string]: any[]}>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodaysClasses();
  }, []);

  const fetchTodaysClasses = async () => {
    try {
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      const response = await fetch(`http://localhost:3001/api/timetable/faculty?day=${today}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setClasses(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch today\'s classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async (sectionId: string, classId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/section-students/by-section/${sectionId}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setStudents(prev => ({ ...prev, [classId]: data.data }));
      }
    } catch (error) {
      console.error('Failed to fetch students:', error);
    }
  };

  const toggleStudentList = (classId: string, sectionId: string) => {
    if (expandedClass === classId) {
      setExpandedClass(null);
    } else {
      setExpandedClass(classId);
      if (!students[classId]) {
        fetchStudents(sectionId, classId);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading today's classes...</div>;
  }

  if (classes.length === 0) {
    return <div className="text-gray-500 text-center py-8">No classes scheduled for today</div>;
  }

  return (
    <div className="space-y-4">
      {classes.map((classItem: any) => (
        <div key={classItem._id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900">
                {classItem.courseId.name} ({classItem.courseId.code})
              </h3>
              <p className="text-sm text-gray-600">
                Section: {classItem.sectionId.name} - Year {classItem.sectionId.year}, Sem {classItem.sectionId.semester}
              </p>
              <p className="text-sm text-gray-600">
                Time: {classItem.startTime} - {classItem.endTime} | Room: {classItem.room}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => toggleStudentList(classItem._id, classItem.sectionId._id)}
                className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
              >
                {expandedClass === classItem._id ? 'Hide Students' : 'View Students'}
              </button>
              <button
                onClick={() => window.open(`/attendance/${classItem._id}`, '_blank')}
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Mark Attendance
              </button>
            </div>
          </div>
          
          {expandedClass === classItem._id && (
            <div className="mt-4 border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-2">Students in Section {classItem.sectionId.name}:</h4>
              {students[classItem._id] ? (
                students[classItem._id].length === 0 ? (
                  <p className="text-gray-500 text-sm">No students enrolled in this section</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {students[classItem._id].map((student: any) => (
                      <div key={student._id} className="bg-gray-50 p-2 rounded text-sm">
                        <p className="font-medium">{student.studentId?.fullName}</p>
                        <p className="text-gray-600">
                          Roll: {student.sectionRollNo} | Univ: {student.universityRollNo}
                        </p>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <div className="text-center py-2">Loading students...</div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};