
import React from 'react';
import { Button } from '@/components/ui/button';

interface AdminBottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

// Nouvel ordre : Config > Équipe > Prestataires > Planning > Documents > Partage
const ADMIN_TABS = [
  { id: 'config', label: 'Config', icon: '⚙️' },
  { id: 'people', label: 'Équipe', icon: '👥' },
  { id: 'vendors', label: 'Prestataires', icon: '🏢' },
  { id: 'planning', label: 'Planning', icon: '⏰' },
  { id: 'documents', label: 'Documents', icon: '📁' },
  { id: 'share', label: 'Partage', icon: '🔗' },
];

export const AdminBottomNavigation: React.FC<AdminBottomNavigationProps> = ({ 
  activeTab, 
  onTabChange 
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 shadow-lg z-50 lg:hidden">
      <div className="grid grid-cols-6 p-2">
        {ADMIN_TABS.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'ghost'}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center gap-1 h-auto py-2 text-xs ${
              activeTab === tab.id 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            <span className="text-base">{tab.icon}</span>
            <span className="text-xs font-medium leading-none">{tab.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
