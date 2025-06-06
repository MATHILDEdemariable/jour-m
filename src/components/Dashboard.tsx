
import React, { useState } from 'react';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Timeline } from '@/components/Timeline';
import { TaskList } from '@/components/TaskList';
import { ContactList } from '@/components/ContactList';
import { DocumentHub } from '@/components/DocumentHub';
import { ViewToggle } from '@/components/ViewToggle';

interface DashboardProps {
  userRole: string;
  userName: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ userRole, userName }) => {
  const [activeTab, setActiveTab] = useState('timeline');
  const [viewMode, setViewMode] = useState<'personal' | 'global'>('personal');

  const renderContent = () => {
    switch (activeTab) {
      case 'timeline':
        return <Timeline viewMode={viewMode} userRole={userRole} />;
      case 'tasks':
        return <TaskList viewMode={viewMode} userRole={userRole} />;
      case 'contacts':
        return <ContactList />;
      case 'documents':
        return <DocumentHub />;
      default:
        return <Timeline viewMode={viewMode} userRole={userRole} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Jour J
            </h1>
            <p className="text-sm text-gray-600">Welcome, {userName}</p>
          </div>
          <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pb-20 overflow-hidden">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};
