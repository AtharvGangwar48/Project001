import React, { useState, useEffect } from 'react';

const API_BASE = process.env.NODE_ENV === 'development' && typeof window !== 'undefined'
  ? `https://${window.location.hostname}:3001/api`
  : 'http://localhost:3001/api';

export const TodaysClasses: React.FC = () => {
  const [classes, setClasses] = useState([]);
  const [selectedDay, setSelectedDay] = useState(() => {
    return new Date().toLocaleDateString('en-US', { weekday: 'long' });
  });
  const [loading, setLoading] = useState(true);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    fetchClasses();
  }, [selectedDay]);

  const fetchClasses = async () => {
    try {
      const response = await fetch(`${API_BASE}/timetable/faculty?day=${selectedDay}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setClasses(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch classes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading classes...</div>;
  }

  return (
    <div>
      {/* Day Tabs */}
      <div className="flex space-x-1 mb-4 border-b">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
              selectedDay === day
                ? 'bg-indigo-100 text-indigo-700 border-b-2 border-indigo-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-4">Loading classes...</div>
      ) : classes.length === 0 ? (
        <div className="text-gray-500 text-center py-8">No classes scheduled for {selectedDay}</div>
      ) : (
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
            <button
              onClick={() => window.open(`/attendance/${classItem._id}`, '_blank')}
              className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Mark Attendance
            </button>
          </div>
        </div>
      ))}
        </div>
      )}
    </div>
  );
};