import React, { useState, useEffect } from 'react';

export const TodaysSchedule: React.FC = () => {
  const [schedule, setSchedule] = useState([]);
  const [selectedDay, setSelectedDay] = useState(() => {
    return new Date().toLocaleDateString('en-US', { weekday: 'long' });
  });
  const [loading, setLoading] = useState(true);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    fetchSchedule();
  }, [selectedDay]);

  const fetchSchedule = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/timetable/student?day=${selectedDay}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setSchedule(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading schedule...</div>;
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
        <div className="text-center py-4">Loading schedule...</div>
      ) : schedule.length === 0 ? (
        <div className="text-gray-500 text-center py-8">No classes scheduled for {selectedDay}</div>
      ) : (
        <div className="space-y-4">
      {schedule.map((classItem: any) => (
        <div key={classItem._id} className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900">
            {classItem.courseId.name} ({classItem.courseId.code})
          </h3>
          <p className="text-sm text-gray-600">
            Faculty: {classItem.facultyId.name}
          </p>
          <p className="text-sm text-gray-600">
            Time: {classItem.startTime} - {classItem.endTime} | Room: {classItem.room}
          </p>
        </div>
      ))}
        </div>
      )}
    </div>
  );
};