import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Calendar, Users, MapPin } from 'lucide-react';
import { Program } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { ProgramForm } from './ProgramForm';

interface ProgramsTabProps {
  programs: Program[];
  onRefresh: () => void;
}

export const ProgramsTab: React.FC<ProgramsTabProps> = ({ programs, onRefresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const { university } = useAuth();

  const handleEdit = (program: Program) => {
    setEditingProgram(program);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProgram(null);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Program Management</h1>
          <p className="text-gray-600 mt-1">Create and manage your academic programs</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Program
        </button>
      </div>

      {programs.length > 0 ? (
        <div className="grid gap-6">
          {programs.map((program) => (
            <div key={program.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{program.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      program.type === 'UG' ? 'bg-blue-100 text-blue-800' :
                      program.type === 'PG' ? 'bg-green-100 text-green-800' :
                      program.type === 'Doctoral' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {program.type}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Code: {program.code}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>{program.seats} seats</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{program.deliveryMode}</span>
                    </div>
                    <div className="col-span-2 lg:col-span-3">
                      <span className="font-medium">Faculty:</span> {program.faculty}
                    </div>
                    <div className="col-span-2 lg:col-span-3">
                      <span className="font-medium">Duration:</span> {program.duration}
                    </div>
                    {program.specializations.length > 0 && (
                      <div className="col-span-2 lg:col-span-3">
                        <span className="font-medium">Specializations:</span> {program.specializations.join(', ')}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(program)}
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
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Programs Yet</h3>
          <p className="text-gray-600 mb-4">
            Start by creating your first academic program
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create First Program
          </button>
        </div>
      )}

      {showForm && (
        <ProgramForm
          program={editingProgram}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};