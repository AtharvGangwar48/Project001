import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, BookOpen, Building2, GraduationCap, Plus, Users } from 'lucide-react';
import { getStudentData } from '../../services/dataService';
import { Header } from '../Layout/Header';
import { SectionJoinForm } from './SectionJoinForm';
import { ResumeSubmissionForm } from './StudentSubmissionForms';
import { AcademicResultForm, ABCIDForm, SeminarForm } from './DetailedActivityForms';
import { ConferenceForm, OnlineCourseForm, InternshipForm, ExtraCurricularForm } from './DetailedActivityForms2';
import { TodaysSchedule } from './TodaysSchedule';

export const StudentDashboard: React.FC = () => {
  const [studentData, setStudentData] = useState<any>(null);
  const [submittedData, setSubmittedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [showResumeForm, setShowResumeForm] = useState(false);
  const [showActivityForm, setShowActivityForm] = useState({ show: false, type: '', name: '' });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [studentInfo, submissions, sectionInfo] = await Promise.all([
        getStudentData(),
        fetch('http://localhost:3001/api/student-details/my-submissions', {
          credentials: 'include'
        }).then(res => res.json()),
        fetch('http://localhost:3001/api/section-students/my-section', {
          credentials: 'include'
        }).then(res => res.json())
      ]);
      
      setStudentData({
        ...studentInfo,
        sectionInfo: sectionInfo.success ? sectionInfo.data : null
      });
      setSubmittedData(submissions.success ? submissions.data : []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      if (error.message.includes('403')) {
        window.location.href = '/';
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load student data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {studentData.fullName}!
          </h1>
          <p className="mt-2 text-gray-600">Student Dashboard</p>
          
          <div className="mt-4 flex space-x-4">
            <button
              onClick={() => setShowSectionForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Users className="h-4 w-4 mr-2" />
              Join Section
            </button>
            <button
              onClick={() => setShowResumeForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Submit Resume
            </button>
          </div>
          
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
            <button onClick={() => setShowActivityForm({ show: true, type: 'result', name: 'Academic Result' })} className="px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">Academic Result</button>
            <button onClick={() => setShowActivityForm({ show: true, type: 'abc_id', name: 'ABC ID' })} className="px-3 py-2 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-md">ABC ID</button>
            <button onClick={() => setShowActivityForm({ show: true, type: 'seminar', name: 'Seminar' })} className="px-3 py-2 text-xs font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md">Seminar</button>
            <button onClick={() => setShowActivityForm({ show: true, type: 'conference', name: 'Conference' })} className="px-3 py-2 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-md">Conference</button>
            <button onClick={() => setShowActivityForm({ show: true, type: 'online_course', name: 'Online Course' })} className="px-3 py-2 text-xs font-medium text-white bg-yellow-600 hover:bg-yellow-700 rounded-md">Online Course</button>
            <button onClick={() => setShowActivityForm({ show: true, type: 'internship', name: 'Internship' })} className="px-3 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md">Internship</button>
            <button onClick={() => setShowActivityForm({ show: true, type: 'extracurricular', name: 'Extra-curricular' })} className="px-3 py-2 text-xs font-medium text-white bg-pink-600 hover:bg-pink-700 rounded-md">Extra-curricular</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Student Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <User className="h-5 w-5 text-indigo-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Student Information</h2>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <p className="text-sm text-gray-900">{studentData.fullName}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Student ID</label>
                <p className="text-sm text-gray-900">{studentData.studentId}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">University Roll No</label>
                <p className="text-sm text-gray-900">{studentData.universityRollNo}</p>
              </div>
              
              {studentData.sectionInfo && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Section</label>
                  <p className="text-sm text-gray-900">
                    {studentData.sectionInfo.sectionId?.name} (Roll No: {studentData.sectionInfo.sectionRollNo})
                  </p>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-900">{studentData.email}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-900">{studentData.phone}</span>
              </div>
            </div>
          </div>

          {/* University & Program Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Building2 className="h-5 w-5 text-indigo-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Academic Information</h2>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">University</label>
                <p className="text-sm text-gray-900">{studentData.universityId?.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Program</label>
                <p className="text-sm text-gray-900">
                  {studentData.programId?.name} ({studentData.programId?.degreeLevel})
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <p className="text-sm text-gray-900">{studentData.programId?.department}</p>
              </div>
            </div>
          </div>

          {/* SPOC Information */}
          {studentData.spoc && (
            <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
              <div className="flex items-center mb-4">
                <GraduationCap className="h-5 w-5 text-indigo-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Your SPOC/HOD Details</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="text-sm text-gray-900">{studentData.spoc.name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Designation</label>
                  <p className="text-sm text-gray-900">{studentData.spoc.designation}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact</label>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{studentData.spoc.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{studentData.spoc.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submitted Information */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">My Submissions</h2>
          </div>
          <div className="p-6">
            {submittedData.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No submissions yet</p>
            ) : (
              <div className="space-y-4">
                {submittedData.map((item: any) => (
                  <div key={item._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 capitalize">
                          {item.type.replace('_', ' ')} - {item.title}
                        </h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.status === 'approved' ? 'bg-green-100 text-green-800' :
                          item.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.status}
                        </span>
                        <a 
                          href={item.driveLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-800 text-sm"
                        >
                          📄 View
                        </a>
                      </div>
                    </div>
                    
                    {item.organization && (
                      <p className="text-sm text-gray-600">Organization: {item.organization}</p>
                    )}
                    
                    {item.duration && (
                      <p className="text-sm text-gray-600">Duration: {item.duration}</p>
                    )}
                    
                    {item.grade && (
                      <p className="text-sm text-gray-600">Grade: {item.grade}</p>
                    )}
                    
                    <p className="text-xs text-gray-500 mt-2">
                      Submitted: {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Today's Classes</h2>
          </div>
          <div className="p-6">
            <TodaysSchedule />
          </div>
        </div>
      </main>
      
      {showSectionForm && (
        <SectionJoinForm
          onSuccess={() => {
            setShowSectionForm(false);
            // Refresh data
          }}
          onCancel={() => setShowSectionForm(false)}
        />
      )}
      
      {showResumeForm && (
        <ResumeSubmissionForm
          onSuccess={() => {
            setShowResumeForm(false);
            fetchAllData();
          }}
          onCancel={() => setShowResumeForm(false)}
        />
      )}
      
      {showActivityForm.show && (
        <>
          {showActivityForm.type === 'result' && (
            <AcademicResultForm
              onSuccess={() => { setShowActivityForm({ show: false, type: '', name: '' }); fetchAllData(); }}
              onCancel={() => setShowActivityForm({ show: false, type: '', name: '' })}
            />
          )}
          {showActivityForm.type === 'abc_id' && (
            <ABCIDForm
              onSuccess={() => { setShowActivityForm({ show: false, type: '', name: '' }); fetchAllData(); }}
              onCancel={() => setShowActivityForm({ show: false, type: '', name: '' })}
            />
          )}
          {showActivityForm.type === 'seminar' && (
            <SeminarForm
              onSuccess={() => { setShowActivityForm({ show: false, type: '', name: '' }); fetchAllData(); }}
              onCancel={() => setShowActivityForm({ show: false, type: '', name: '' })}
            />
          )}
          {showActivityForm.type === 'conference' && (
            <ConferenceForm
              onSuccess={() => { setShowActivityForm({ show: false, type: '', name: '' }); fetchAllData(); }}
              onCancel={() => setShowActivityForm({ show: false, type: '', name: '' })}
            />
          )}
          {showActivityForm.type === 'online_course' && (
            <OnlineCourseForm
              onSuccess={() => { setShowActivityForm({ show: false, type: '', name: '' }); fetchAllData(); }}
              onCancel={() => setShowActivityForm({ show: false, type: '', name: '' })}
            />
          )}
          {showActivityForm.type === 'internship' && (
            <InternshipForm
              onSuccess={() => { setShowActivityForm({ show: false, type: '', name: '' }); fetchAllData(); }}
              onCancel={() => setShowActivityForm({ show: false, type: '', name: '' })}
            />
          )}
          {showActivityForm.type === 'extracurricular' && (
            <ExtraCurricularForm
              onSuccess={() => { setShowActivityForm({ show: false, type: '', name: '' }); fetchAllData(); }}
              onCancel={() => setShowActivityForm({ show: false, type: '', name: '' })}
            />
          )}
        </>
      )}
    </div>
  );
};