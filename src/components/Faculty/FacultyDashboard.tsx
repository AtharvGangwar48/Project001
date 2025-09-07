import React, { useState, useEffect } from 'react';
import { BookOpen, Building } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Header } from '../Layout/Header';
import { getCourses, getSections } from '../../services/dataService';
import { TodaysClasses } from './TodaysClasses';
import { TodaysClassesWithStudents } from './TodaysClassesWithStudents';
import { ClassCoordinatorSections } from './ClassCoordinatorSections';

export const FacultyDashboard: React.FC = () => {
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [university, setUniversity] = useState<any>(null);
  const [program, setProgram] = useState<any>(null);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [sectionCourses, setSectionCourses] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [facultyResponse, approvalsResponse, sectionCoursesResponse] = await Promise.all([
        fetch(`http://localhost:3001/api/faculty/details/${user?.id}`, {
          credentials: 'include'
        }),
        fetch('http://localhost:3001/api/student-details/pending', {
          credentials: 'include'
        }),
        fetch('http://localhost:3001/api/section-courses', {
          credentials: 'include'
        })
      ]);
      
      if (facultyResponse.ok) {
        const facultyData = await facultyResponse.json();
        const faculty = facultyData.data;
        
        setCourses(faculty.assignedCourses || []);
        setUniversity(faculty.university);
        setProgram(faculty.program);
        setSections(faculty.sections || []);
      }
      
      if (approvalsResponse.ok) {
        const approvalsData = await approvalsResponse.json();
        setPendingApprovals(approvalsData.data || []);
      }
      
      if (sectionCoursesResponse.ok) {
        const sectionCoursesData = await sectionCoursesResponse.json();
        setSectionCourses(sectionCoursesData.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const handleApproval = async (id: string, status: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/student-details/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        fetchData(); // Refresh data
      } else {
        alert('Failed to update approval status');
      }
    } catch (error) {
      alert('Failed to update approval status');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name || 'Faculty'}!</h1>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="space-y-3">
              <div className="flex items-center">
                <Building className="h-5 w-5 text-blue-600 mr-2" />
                <p className="text-gray-700">
                  University: <span className="font-semibold">{university?.name || 'Loading...'}</span>
                </p>
              </div>
              
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 text-purple-600 mr-2" />
                <p className="text-gray-700">
                  Program: <span className="font-semibold">{program?.name || 'Loading...'}</span>
                </p>
              </div>
              
              <div>
                <p className="text-gray-700 mb-2 font-medium">Course-Section Assignments:</p>
                {courses.length === 0 ? (
                  <p className="text-gray-500 italic ml-4">No courses assigned yet</p>
                ) : (
                  <ul className="space-y-2 ml-4">
                    {courses.map((assignment: any, index: number) => (
                      <li key={index} className="text-gray-700 bg-gray-50 p-2 rounded">
                        <div className="font-medium">
                          {assignment.courseId?.name} ({assignment.courseId?.code})
                        </div>
                        <div className="text-sm text-gray-600">
                          Section: {assignment.sectionId?.name} - Year {assignment.sectionId?.year}, Sem {assignment.sectionId?.semester}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Class Coordinator Sections */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">My Class Coordinator Sections</h2>
          </div>
          <div className="p-6">
            <ClassCoordinatorSections />
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Pending Approvals ({pendingApprovals.length})</h2>
          </div>
          <div className="p-6">
            {pendingApprovals.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No pending approvals</p>
            ) : (
              <div className="space-y-4">
                {pendingApprovals.map((item: any) => (
                  <div key={item._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900 capitalize">
                          {item.type.replace('_', ' ')} - {item.title}
                        </h3>
                        <p className="text-sm text-gray-600">Student: {item.studentId?.fullName}</p>
                        <p className="text-sm text-gray-600">Roll No: {item.universityRollNo}</p>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApproval(item._id, 'approved')}
                          className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleApproval(item._id, 'rejected')}
                          className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Reject
                        </button>
                        <a 
                          href={item.driveLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          View
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Today's Classes with Students */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Today's Classes</h2>
          </div>
          <div className="p-6">
            <TodaysClassesWithStudents />
          </div>
        </div>

        {/* Weekly Schedule */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Weekly Schedule</h2>
          </div>
          <div className="p-6">
            <TodaysClasses />
          </div>
        </div>

        {/* Section-Course Assignments */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">My Section-Course Assignments</h2>
          </div>
          <div className="p-6">
            {sectionCourses.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No assignments yet</p>
            ) : (
              <div className="grid gap-4">
                {sectionCourses.filter(sc => sc.assignedFaculty?._id === user?.id).map((assignment: any) => (
                  <div key={assignment._id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900">
                      {assignment.courseId?.name} ({assignment.courseId?.code})
                    </h3>
                    <p className="text-sm text-gray-600">
                      Section: {assignment.sectionId?.name} - Year {assignment.sectionId?.year}, Semester {assignment.sectionId?.semester}
                    </p>
                    <p className="text-sm text-gray-600">Credits: {assignment.courseId?.credits}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};