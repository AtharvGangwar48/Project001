import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export const ClassCoordinatorSections: React.FC = () => {
  const [coordinatorSections, setCoordinatorSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchCoordinatorSections();
  }, []);

  const fetchCoordinatorSections = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/sections/coordinator/${user?.id}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setCoordinatorSections(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch coordinator sections:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading coordinator sections...</div>;
  }

  if (coordinatorSections.length === 0) {
    return <div className="text-gray-500 text-center py-8">No sections assigned as class coordinator</div>;
  }

  return (
    <div className="space-y-4">
      {coordinatorSections.map((section: any) => (
        <div key={section._id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900">
                Section {section.name} - Year {section.year}, Semester {section.semester}
              </h3>
              <p className="text-sm text-gray-600">
                Program: {section.programId?.name}
              </p>
              <p className="text-sm text-gray-600">
                Students: {section.studentCount || 0}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => window.open(`/coordinator/approvals/${section._id}`, '_blank')}
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                View Approvals
              </button>
              <button
                onClick={() => window.open(`/coordinator/students/${section._id}`, '_blank')}
                className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
              >
                Manage Students
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};