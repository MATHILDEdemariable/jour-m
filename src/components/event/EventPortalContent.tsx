
import React from 'react';
import { Button } from '@/components/ui/button';
import { UnifiedPersonalPlanning } from '@/components/event/UnifiedPersonalPlanning';
import { ContactsTab } from '@/components/event/ContactsTab';
import { PersonalDocuments } from '@/components/event/PersonalDocuments';
import { LoggedUser } from '@/types/event';

interface EventPortalContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobile: boolean;
  loggedInUser: LoggedUser;
  viewMode: 'personal' | 'global';
  onViewModeChange: (mode: 'personal' | 'global') => void;
}

export const EventPortalContent: React.FC<EventPortalContentProps> = ({
  activeTab,
  setActiveTab,
  isMobile,
  loggedInUser,
  viewMode,
  onViewModeChange
}) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case 'planning':
        return (
          <UnifiedPersonalPlanning 
            userId={loggedInUser.id} 
            userName={loggedInUser.name}
            userType={loggedInUser.type}
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
          />
        );
      case 'contacts':
        return (
          <ContactsTab 
            userId={loggedInUser.id}
            userType={loggedInUser.type}
          />
        );
      case 'documents':
        return (
          <PersonalDocuments 
            personId={loggedInUser.id} 
            personName={loggedInUser.name} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Desktop Tabs */}
      {!isMobile && (
        <div className="flex gap-2 border-b border-gray-200">
          <Button
            variant={activeTab === 'planning' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('planning')}
            className={activeTab === 'planning' ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''}
          >
            📅 Planning
          </Button>
          <Button
            variant={activeTab === 'contacts' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('contacts')}
            className={activeTab === 'contacts' ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''}
          >
            👥 Contacts
          </Button>
          <Button
            variant={activeTab === 'documents' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('documents')}
            className={activeTab === 'documents' ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''}
          >
            📁 Mes Fichiers
          </Button>
        </div>
      )}
      
      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};
