import React, { useState } from 'react';
import { X, Save, Calendar } from 'lucide-react';
import { Program } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { saveProgram } from '../../services/dataService';

interface ProgramFormProps {
  program?: Program | null;
  onClose: () => void;
}

export const ProgramForm: React.FC<ProgramFormProps> = ({ program, onClose }) => {
  const { university } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: program?.name || '',
    type: program?.type || 'UG',
    faculty: program?.faculty || '',
    code: program?.code || '',
    accreditationStatus: program?.accreditationStatus || '',
    duration: program?.duration || '',
    seats: program?.seats || 0,
    deliveryMode: program?.deliveryMode || 'Offline',
    startDate: program?.startDate || '',
    specializations: program?.specializations?.join(', ') || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!university?.id) return;
    
    setLoading(true);
    
    const specializationsArray = formData.specializations
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const programData: Program = {
      id: program?.id || Date.now().toString(),
      universityId: university.id,
      name: formData.name,
      type: formData.type as Program['type'],
      faculty: formData.faculty,
      code: formData.code,
      accreditationStatus: formData.accreditationStatus,
      duration: formData.duration,
      seats: formData.seats,
      deliveryMode: formData.deliveryMode as Program['deliveryMode'],
      startDate: formData.startDate,
      specializations: specializationsArray,
      createdAt: program?.createdAt || new Date().toISOString(),
    };

    try {
      saveProgram(programData);
      onClose();
    } catch (error) {
      console.error('Error saving program:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-3xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {program ? 'Edit Program' : 'Create New Program'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Program Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Bachelor of Computer Science"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Program Type *
              </label>
              <select
                name="type"
                required
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="UG">Undergraduate (UG)</option>
                <option value="PG">Postgraduate (PG)</option>
                <option value="Doctoral">Doctoral</option>
                <option value="Certificate">Certificate</option>
                <option value="Diploma">Diploma</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Faculty/Department *
              </label>
              <input
                type="text"
                name="faculty"
                required
                value={formData.faculty}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Computer Science & Engineering"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Program Code *
              </label>
              <input
                type="text"
                name="code"
                required
                value={formData.code}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="CSE001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Accreditation Status
              </label>
              <input
                type="text"
                name="accreditationStatus"
                value={formData.accreditationStatus}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="NAAC A+, NBA Accredited"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration *
              </label>
              <input
                type="text"
                name="duration"
                required
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="4 years"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Seats *
              </label>
              <input
                type="number"
                name="seats"
                required
                min="1"
                value={formData.seats}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="60"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Mode *
              </label>
              <select
                name="deliveryMode"
                required
                value={formData.deliveryMode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                required
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Specializations (comma-separated)
            </label>
            <input
              type="text"
              name="specializations"
              value={formData.specializations}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Artificial Intelligence, Data Science, Cybersecurity"
            />
            <p className="text-xs text-gray-500 mt-1">Separate multiple specializations with commas</p>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : program ? 'Update Program' : 'Create Program'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};