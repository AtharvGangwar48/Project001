import React, { useState, useEffect } from 'react';
import { BookOpen, Users, Plus, GraduationCap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Header } from '../Layout/Header';
import { CourseForm } from './CourseForm';
import { SectionForm } from './SectionForm';
import { FacultyForm } from './FacultyForm';
import { SectionCourseForm } from './SectionCourseForm';
import { TimetableForm } from './TimetableForm';
import { TimetableView } from './TimetableView';
import { NewTimetableForm } from './NewTimetableForm';
import { getCourses, getSections, getFaculty } from '../../services/dataService';

export const SPOCDashboard: React.FC = () => {
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [showFacultyForm, setShowFacultyForm] = useState(false);
  const [showSectionCourseForm, setShowSectionCourseForm] = useState(false);
  const [showTimetableForm, setShowTimetableForm] = useState(false);
  const [showNewTimetableForm, setShowNewTimetableForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();

  useEffect(() => {
    // Fetch SPOC data
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, SPOC!</h1>
          <p className="mt-2 text-gray-600">You are assigned for your program</p>
          <div className="mt-4 flex space-x-6">
            <div className="bg-blue-50 px-4 py-2 rounded-lg">
              <span className="text-sm text-blue-600 font-medium">University ID:</span>
              <span className="ml-2 text-sm font-mono text-blue-800">{user?.universityId || 'N/A'}</span>
            </div>
            <div className="bg-green-50 px-4 py-2 rounded-lg">
              <span className="text-sm text-green-600 font-medium">Program ID:</span>
              <span className="ml-2 text-sm font-mono text-green-800">{user?.programId || 'N/A'}</span>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="mt-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('timetable')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'timetable'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Class Schedule
              </button>
            </nav>
          </div>
          

        </div>

        {activeTab === 'timetable' ? (
          <TimetableView />
        ) : (
          <>
        {/* Action Buttons */}
        <div className="mb-6 flex space-x-4">
          <button
            onClick={() => setShowCourseForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </button>
          <button
            onClick={() => setShowSectionForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Section
          </button>
          <button
            onClick={() => setShowFacultyForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Faculty
          </button>
          <button
            onClick={() => setShowSectionCourseForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Assign Course to Section
          </button>
          <button
            onClick={() => setShowNewTimetableForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Schedule Class
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Sections</p>
                <p className="text-2xl font-bold text-gray-900">{sections.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Faculty</p>
                <p className="text-2xl font-bold text-gray-900">{faculty.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Courses List */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Courses</h2>
          </div>
          <div className="p-6">
            {courses.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No courses added yet. Click "Add Course" to get started.</p>
            ) : (
              <div className="grid gap-4">
                {courses.map((course: any) => (
                  <div key={course._id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900">{course.name}</h3>
                    <p className="text-sm text-gray-600">Code: {course.code} | Credits: {course.credits}</p>
                    <div className="mt-2 flex gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Year {course.year}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Semester {course.semester}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sections List */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Sections</h2>
          </div>
          <div className="p-6">
            {sections.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No sections added yet. Click "Add Section" to get started.</p>
            ) : (
              <div className="grid gap-4">
                {sections.map((section: any) => (
                  <div key={section._id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900">Section {section.name}</h3>
                    <p className="text-sm text-gray-600">Year {section.year} | Semester {section.semester}</p>
                    {section.classCoordinator ? (
                      <p className="text-sm text-green-600">Class Coordinator: {section.classCoordinator.name}</p>
                    ) : (
                      <p className="text-sm text-gray-500">No Class Coordinator assigned</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Faculty List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Faculty</h2>
          </div>
          <div className="p-6">
            {faculty.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No faculty added yet. Click "Add Faculty" to get started.</p>
            ) : (
              <div className="grid gap-4">
                {faculty.map((member: any) => (
                  <div key={member._id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.designation} | {member.department}</p>
                    <p className="text-sm text-gray-600">📧 {member.email} | 📞 {member.phone}</p>
                    {member.specialization && (
                      <p className="text-sm text-gray-600">Specialization: {member.specialization}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
          </>
        )}
      </main>

      {/* Forms */}
      {activeTab === 'overview' && showCourseForm && (
        <CourseForm
          onSuccess={() => {
            setShowCourseForm(false);
            fetchData();
          }}
          onCancel={() => setShowCourseForm(false)}
        />
      )}
      
      {activeTab === 'overview' && showSectionForm && (
        <SectionForm
          faculty={faculty}
          onSuccess={() => {
            setShowSectionForm(false);
            fetchData();
          }}
          onCancel={() => setShowSectionForm(false)}
        />
      )}
      
      {activeTab === 'overview' && showFacultyForm && (
        <FacultyForm
          courses={courses}
          onSuccess={() => {
            setShowFacultyForm(false);
            fetchData();
          }}
          onCancel={() => setShowFacultyForm(false)}
        />
      )}
      
      {activeTab === 'overview' && showSectionCourseForm && (
        <SectionCourseForm
          onSuccess={() => {
            setShowSectionCourseForm(false);
            fetchData();
          }}
          onCancel={() => setShowSectionCourseForm(false)}
        />
      )}
      
      {activeTab === 'overview' && showTimetableForm && (
        <TimetableForm
          onSuccess={() => {
            setShowTimetableForm(false);
            fetchData();
          }}
          onCancel={() => setShowTimetableForm(false)}
        />
      )}
      
      {showNewTimetableForm && (
        <NewTimetableForm
          courses={courses}
          sections={sections}
          faculty={faculty}
          onSuccess={() => {
            setShowNewTimetableForm(false);
            fetchData();
          }}
          onCancel={() => setShowNewTimetableForm(false)}
        />
      )}
    </div>
  );
};