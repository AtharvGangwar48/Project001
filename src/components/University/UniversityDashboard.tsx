import React, { useState, useEffect } from 'react';
import { BookOpen, Users, BarChart3, Plus } from 'lucide-react';
import { Program, SPOC } from '../../types';
import { getPrograms, getSPOCs } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import { Header } from '../Layout/Header';
import { Sidebar } from '../Layout/Sidebar';
import { ProgramsTab } from './ProgramsTab';
import { SPOCsTab } from './SPOCsTab';
import { OverviewTab } from './OverviewTab';

export const UniversityDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [programs, setPrograms] = useState<Program[]>([]);
  const [spocs, setSPOCs] = useState<SPOC[]>([]);
  const { user, university } = useAuth();

  useEffect(() => {
    if (university?.id) {
      setPrograms(getPrograms(university.id));
      setSPOCs(getSPOCs(university.id));
    }
  }, [university?.id]);

  const refreshData = () => {
    if (university?.id) {
      setPrograms(getPrograms(university.id));
      setSPOCs(getSPOCs(university.id));
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab programs={programs} spocs={spocs} />;
      case 'programs':
        return <ProgramsTab programs={programs} onRefresh={refreshData} />;
      case 'spocs':
        return <SPOCsTab programs={programs} spocs={spocs} onRefresh={refreshData} />;
      default:
        return <OverviewTab programs={programs} spocs={spocs} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};