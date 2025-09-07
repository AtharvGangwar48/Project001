import React, { useState } from 'react';
import { Plus, Edit3, UserCheck, Mail, Phone, Building } from 'lucide-react';
import { Program, SPOC } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { SPOCForm } from './SPOCForm';

interface SPOCsTabProps {
  programs: Program[];
  spocs: SPOC[];
  onRefresh: () => void;
}

export const SPOCsTab: React.FC<SPOCsTabProps> = ({ programs, spocs, onRefresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingSPOC, setEditingSPOC] = useState<SPOC | null>(null);
  const { university } = useAuth();

  const handleEdit = (spoc: SPOC) => {
    setEditingSPOC(spoc);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingSPOC(null);
    onRefresh();
  };

  const getProgramName = (programId: string) => {
    const program = programs.find(p => p.id === programId);
    return program ? program.name : 'Unknown Program';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SPOC Management</h1>
          <p className="text-gray-600 mt-1">Manage Single Point of Contact for your programs</p>
        </div>
        {programs.length > 0 && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New SPOC
          </button>
        )}
      </div>

      {programs.length === 0 ? (
        <div className="text-center py-12">
          <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Programs Available</h3>
          <p className="text-gray-600">
            You need to create at least one program before adding SPOCs
          </p>
        </div>
      ) : spocs.length > 0 ? (
        <div className="grid gap-6">
          {spocs.map((spoc) => (
            <div key={spoc.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                      <UserCheck className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{spoc.name}</h3>
                      <p className="text-sm text-gray-600">{spoc.designation}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>{spoc.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>{spoc.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4" />
                      <span>{getProgramName(spoc.programId)}</span>
                    </div>
                    <div>
                      <span className="font-medium">Username:</span> {spoc.username}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(spoc)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <Edit3 className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No SPOCs Created</h3>
          <p className="text-gray-600 mb-4">
            Create SPOC accounts to manage your programs effectively
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create First SPOC
          </button>
        </div>
      )}

      {showForm && (
        <SPOCForm
          programs={programs}
          spoc={editingSPOC}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};