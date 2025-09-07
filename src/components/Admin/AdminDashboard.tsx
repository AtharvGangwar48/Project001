import React, { useState, useEffect } from 'react';
import { Building2, Check, X, Eye, Calendar, Mail, Phone, Clock } from 'lucide-react';
import { University } from '../../types';
import { getUniversities, updateUniversityStatus } from '../../services/dataService';
import { Header } from '../Layout/Header';
import { Sidebar } from '../Layout/Sidebar';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [universities, setUniversities] = useState<University[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);

  useEffect(() => {
    setUniversities(getUniversities());
  }, []);

  const handleStatusUpdate = (id: string, status: 'approved' | 'rejected') => {
    updateUniversityStatus(id, status);
    setUniversities(getUniversities());
    setSelectedUniversity(null);
  };

  const filteredUniversities = universities.filter(u => {
    if (activeTab === 'pending') return u.status === 'pending';
    if (activeTab === 'approved') return u.status === 'approved';
    return true;
  });

  const stats = {
    pending: universities.filter(u => u.status === 'pending').length,
    approved: universities.filter(u => u.status === 'approved').length,
    rejected: universities.filter(u => u.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="flex-1 p-6">
          {activeTab === 'statistics' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-900">Platform Statistics</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <div className="bg-yellow-100 p-3 rounded-lg">
                      <Clock className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <Check className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Approved Universities</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <div className="bg-red-100 p-3 rounded-lg">
                      <X className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Rejected Applications</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'pending' || activeTab === 'approved') && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  {activeTab === 'pending' ? 'Pending Universities' : 'Approved Universities'}
                </h1>
                <div className="text-sm text-gray-600">
                  {filteredUniversities.length} {activeTab} {filteredUniversities.length === 1 ? 'university' : 'universities'}
                </div>
              </div>

              <div className="grid gap-6">
                {filteredUniversities.map((university) => (
                  <div key={university.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Building2 className="h-5 w-5 text-indigo-600" />
                          <h3 className="text-lg font-semibold text-gray-900">{university.name}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            university.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            university.status === 'approved' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {university.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4" />
                            <span>{university.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4" />
                            <span>{university.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>Applied: {new Date(university.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span className="font-medium">Type:</span> {university.type}
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedUniversity(university)}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </button>
                        
                        {university.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(university.id, 'approved')}
                              className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(university.id, 'rejected')}
                              className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {filteredUniversities.length === 0 && (
                  <div className="text-center py-12">
                    <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No {activeTab} universities
                    </h3>
                    <p className="text-gray-600">
                      {activeTab === 'pending' 
                        ? 'There are no pending university registrations at the moment.'
                        : 'No universities have been approved yet.'
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* University Details Modal */}
      {selectedUniversity && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">University Details</h3>
              <button
                onClick={() => setSelectedUniversity(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">University Name</label>
                  <p className="text-sm text-gray-900">{selectedUniversity.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <p className="text-sm text-gray-900">{selectedUniversity.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Affiliation</label>
                  <p className="text-sm text-gray-900">{selectedUniversity.affiliation}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Website</label>
                  <p className="text-sm text-gray-900">{selectedUniversity.website || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <p className="text-sm text-gray-900">{selectedUniversity.address}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Admin Name</label>
                  <p className="text-sm text-gray-900">{selectedUniversity.adminName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Admin Designation</label>
                  <p className="text-sm text-gray-900">{selectedUniversity.adminDesignation}</p>
                </div>
              </div>

              {selectedUniversity.documents.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Uploaded Documents</label>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {selectedUniversity.documents.map((doc, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <span>📄</span>
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {selectedUniversity.status === 'pending' && (
              <div className="flex space-x-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleStatusUpdate(selectedUniversity.id, 'approved')}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Approve University
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedUniversity.id, 'rejected')}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Reject Application
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};