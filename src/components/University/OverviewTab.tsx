import React from 'react';
import { BookOpen, Users, GraduationCap, Calendar, TrendingUp, Award } from 'lucide-react';
import { Program, SPOC } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface OverviewTabProps {
  programs: Program[];
  spocs: SPOC[];
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ programs, spocs }) => {
  const { university } = useAuth();

  const stats = {
    totalPrograms: programs.length,
    totalSPOCs: spocs.length,
    totalSeats: programs.reduce((sum, program) => sum + program.seats, 0),
    upcomingPrograms: programs.filter(p => new Date(p.startDate) > new Date()).length,
  };

  const programsByType = programs.reduce((acc, program) => {
    acc[program.type] = (acc[program.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const programsByDelivery = programs.reduce((acc, program) => {
    acc[program.deliveryMode] = (acc[program.deliveryMode] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">University Overview</h1>
          <p className="text-gray-600 mt-1">Welcome back, {university?.name}</p>
        </div>
        <div className="text-sm text-gray-500">
          Member since {university?.createdAt ? new Date(university.createdAt).toLocaleDateString() : 'N/A'}
        </div>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <BookOpen className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Programs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPrograms}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active SPOCs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSPOCs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <GraduationCap className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Seats</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSeats}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming Programs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.upcomingPrograms}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Program Types Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" />
            Programs by Type
          </h3>
          
          {Object.keys(programsByType).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(programsByType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{type}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full" 
                        style={{ width: `${(count / stats.totalPrograms) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No programs created yet</p>
          )}
        </div>

        {/* Delivery Mode Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Award className="h-5 w-5 mr-2 text-green-600" />
            Programs by Delivery Mode
          </h3>
          
          {Object.keys(programsByDelivery).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(programsByDelivery).map(([mode, count]) => (
                <div key={mode} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{mode}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(count / stats.totalPrograms) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No programs created yet</p>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <BookOpen className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Create New Program</h4>
                <p className="text-sm text-gray-600">Add a new academic program to your university</p>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Manage SPOCs</h4>
                <p className="text-sm text-gray-600">Create and manage SPOC accounts</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Programs */}
      {programs.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Programs</h3>
          
          <div className="space-y-3">
            {programs.slice(0, 3).map((program) => (
              <div key={program.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{program.name}</h4>
                  <p className="text-sm text-gray-600">{program.type} • {program.faculty}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{program.seats} seats</p>
                  <p className="text-sm text-gray-600">{program.deliveryMode}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};