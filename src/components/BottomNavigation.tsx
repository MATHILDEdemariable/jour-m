
import React from 'react';
import { Button } from '@/components/ui/button';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS = [
  { id: 'timeline', label: 'Timeline', icon: '📅' },
  { id: 'tasks', label: 'Tasks', icon: '✅' },
  { id: 'contacts', label: 'Contacts', icon: '👥' },
  { id: 'documents', label: 'Files', icon: '📁' },
];

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
      <div className="flex items-center justify-around p-2">
        {TABS.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'ghost'}
            onClick={() => onTabChange(tab.id)}
            className="flex-1 flex flex-col items-center gap-1 h-auto py-2 text-xs"
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="text-xs">{tab.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
