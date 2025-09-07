import React, { useState, useEffect } from 'react';
import { BookOpen, Users, BarChart3, Plus } from 'lucide-react';
import { Program, SPOC } from '../../types';
import { getPrograms, getSPOCs } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import { Header } from '../Layout/Header';
import { ProgramForm } from './ProgramForm';
import { SPOCForm } from './SPOCForm';
import { InstitutionalReportForm } from './InstitutionalReportForm';
import { NAACReportForm } from './NAACReportForm';
import { NIRFReportForm } from './NIRFReportForm';
import { MetricsTab } from './MetricsTab';
import { AnalyticsTab } from './AnalyticsTab';

export const UniversityDashboard: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [spocs, setSPOCs] = useState<SPOC[]>([]);
  const [showProgramForm, setShowProgramForm] = useState(false);
  const [showSPOCForm, setShowSPOCForm] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [showNAACForm, setShowNAACForm] = useState(false);
  const [showNIRFForm, setShowNIRFForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { university } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [programsData, spocsData] = await Promise.all([
        getPrograms(),
        getSPOCs()
      ]);
      setPrograms(programsData);
      setSPOCs(spocsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const handleProgramSuccess = async () => {
    setShowProgramForm(false);
    await fetchData();
  };

  const handleSPOCSuccess = async () => {
    setShowSPOCForm(false);
    await fetchData();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">University Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your programs and SPOCs</p>
          
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
                onClick={() => setActiveTab('metrics')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'metrics'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Performance Metrics
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Activity Analytics
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'metrics' ? (
          <MetricsTab />
        ) : activeTab === 'analytics' ? (
          <AnalyticsTab />
        ) : (
          <>
        {/* Action Buttons */}
        <div className="mb-6 flex space-x-4">
          <button
            onClick={() => setShowProgramForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Program
          </button>
          <button
            onClick={() => setShowSPOCForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add SPOC/HOD
          </button>
          <button
            onClick={() => setShowReportForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Generate Report
          </button>
          <button
            onClick={() => setShowNAACForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            NAAC Report
          </button>
          <button
            onClick={() => setShowNIRFForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            NIRF Report
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Programs</p>
                <p className="text-2xl font-bold text-gray-900">{programs.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total SPOCs</p>
                <p className="text-2xl font-bold text-gray-900">{spocs.length}</p>
              </div>
            </div>
          </div>
        </div>
          </>
        )}

        {/* Programs List */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Programs</h2>
          </div>
          <div className="p-6">
            {programs.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No programs added yet. Click "Add Program" to get started.</p>
            ) : (
              <div className="grid gap-4">
                {programs.map((program) => (
                  <div key={program._id || program.id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900">{program.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{program.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {program.degreeLevel}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {program.studyMode}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {program.department}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SPOCs List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">SPOCs/HODs</h2>
          </div>
          <div className="p-6">
            {spocs.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No SPOCs added yet. Click "Add SPOC/HOD" to get started.</p>
            ) : (
              <div className="grid gap-4">
                {spocs.map((spoc) => {
                  const assignedProgram = programs.find(p => {
                    const programId = p._id || p.id;
                    // Handle both ObjectId and string comparison
                    const spocProgId = spoc.programId?._id || spoc.programId;
                    const match = String(programId) === String(spocProgId);
                    console.log('Finding program for SPOC:', { 
                      spocProgramId: spoc.programId, 
                      spocProgId,
                      programId, 
                      match 
                    });
                    return match;
                  });
                  return (
                    <div key={spoc._id || spoc.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{spoc.name}</h3>
                          <p className="text-sm text-gray-600">{spoc.designation}</p>
                          <div className="mt-2 text-sm text-gray-600">
                            <p>📧 {spoc.email}</p>
                            <p>📞 {spoc.phone}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-1">Assigned to:</p>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {assignedProgram ? assignedProgram.name : 'Program not found'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Forms */}
      {activeTab === 'overview' && showProgramForm && (
        <ProgramForm
          onSuccess={handleProgramSuccess}
          onCancel={() => setShowProgramForm(false)}
        />
      )}
      
      {activeTab === 'overview' && showSPOCForm && (
        <SPOCForm
          programs={programs}
          onSuccess={handleSPOCSuccess}
          onCancel={() => setShowSPOCForm(false)}
        />
      )}
      
      {activeTab === 'overview' && showReportForm && (
        <InstitutionalReportForm
          onCancel={() => setShowReportForm(false)}
        />
      )}
      
      {activeTab === 'overview' && showNAACForm && (
        <NAACReportForm
          onCancel={() => setShowNAACForm(false)}
        />
      )}
      
      {activeTab === 'overview' && showNIRFForm && (
        <NIRFReportForm
          onCancel={() => setShowNIRFForm(false)}
        />
      )}
    </div>
  );
};