import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, BookOpen } from 'lucide-react';

export const TimetableView: React.FC = () => {
  const [timetable, setTimetable] = useState([]);
  const [selectedDay, setSelectedDay] = useState('');
  const [loading, setLoading] = useState(true);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    fetchTimetable();
  }, [selectedDay]);

  const fetchTimetable = async () => {
    try {
      const url = selectedDay ? `/api/timetable/spoc?day=${selectedDay}` : '/api/timetable/spoc';
      const response = await fetch(url, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setTimetable(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch timetable:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupByDay = (classes: any[]) => {
    return classes.reduce((acc, cls) => {
      const day = cls.dayOfWeek;
      if (!acc[day]) acc[day] = [];
      acc[day].push(cls);
      return acc;
    }, {});
  };

  const groupedTimetable = selectedDay ? 
    { [selectedDay]: timetable } : 
    groupByDay(timetable);

  if (loading) {
    return <div className="flex justify-center py-8">Loading timetable...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Class Schedule</h2>
        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">All Days</option>
          {days.map(day => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>
      </div>

      {Object.keys(groupedTimetable).length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Classes Scheduled</h3>
          <p className="text-gray-600">Schedule classes to see them here</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedTimetable).map(([day, classes]: [string, any[]]) => (
            <div key={day} className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
                  {day}
                </h3>
              </div>
              <div className="p-6">
                {classes.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No classes scheduled for {day}</p>
                ) : (
                  <div className="grid gap-4">
                    {classes.map((cls: any) => (
                      <div key={cls._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
                              <h4 className="font-semibold text-gray-900">
                                {cls.courseId?.name} ({cls.courseId?.code})
                              </h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-1" />
                                Section: {cls.sectionId?.name}
                              </div>
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-1" />
                                Faculty: {cls.facultyId?.name}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                Room: {cls.room}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                            <Clock className="h-4 w-4 mr-1" />
                            {cls.startTime} - {cls.endTime}
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          Year {cls.sectionId?.year} | Semester {cls.sectionId?.semester}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};