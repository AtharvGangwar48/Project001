import React from 'react';
import { Building2, Users, BookOpen, UserPlus, BarChart3 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { user } = useAuth();

  const adminMenuItems = [
    { id: 'pending', label: 'Pending Universities', icon: Building2 },
    { id: 'approved', label: 'Approved Universities', icon: Users },
    { id: 'statistics', label: 'Statistics', icon: BarChart3 },
  ];

  const universityMenuItems = [
    { id: 'programs', label: 'Programs', icon: BookOpen },
    { id: 'spocs', label: 'SPOC Management', icon: UserPlus },
    { id: 'overview', label: 'Overview', icon: BarChart3 },
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : universityMenuItems;

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 min-h-screen">
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-indigo-100 text-indigo-700 border-r-2 border-indigo-500'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};