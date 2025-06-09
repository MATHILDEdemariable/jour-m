
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw, Settings, LogOut } from 'lucide-react';
import { useSharedEventData } from '@/hooks/useSharedEventData';
import { PersonLogin } from '@/components/event/PersonLogin';
import { UnifiedPersonalPlanning } from '@/components/event/UnifiedPersonalPlanning';
import { PersonalDocuments } from '@/components/event/PersonalDocuments';
import { ContactsTab } from '@/components/event/ContactsTab';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCurrentEvent } from '@/contexts/CurrentEventContext';

interface LoggedUser {
  id: string;
  name: string;
  type: 'person' | 'vendor';
}

const EventPortal = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { loading, refreshData, getDaysUntilEvent } = useSharedEventData();
  const { currentEventId } = useCurrentEvent();
  const [loggedInUser, setLoggedInUser] = useState<LoggedUser | null>(null);
  const [activeTab, setActiveTab] = useState('planning');
  const [viewMode, setViewMode] = useState<'personal' | 'global'>('personal');
  
  const daysUntilEvent = getDaysUntilEvent();

  useEffect(() => {
    // Rafraîchir les données au montage et vérifier si un utilisateur est déjà connecté
    console.log('EventPortal - Initializing with event ID:', currentEventId);
    refreshData();
    
    // Vérifier le localStorage pour une session existante
    const savedUser = localStorage.getItem('eventPortalUser');
    if (savedUser) {
      try {
        setLoggedInUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('eventPortalUser');
      }
    }
  }, [currentEventId]);

  // Force refresh when switching tabs to ensure synchronization
  useEffect(() => {
    refreshData();
    console.log('EventPortal - Tab changed to:', activeTab, '- refreshing data');
  }, [activeTab]);

  const handleLogin = (userId: string, userName: string, userType: 'person' | 'vendor') => {
    const user = { id: userId, name: userName, type: userType };
    setLoggedInUser(user);
    // Sauvegarder dans le localStorage pour persister la session
    localStorage.setItem('eventPortalUser', JSON.stringify(user));
    console.log('User logged in:', user);
    // Refresh data after login
    refreshData();
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem('eventPortalUser');
    console.log('User logged out');
  };

  const handleRefreshData = () => {
    console.log('Manual data refresh triggered for event ID:', currentEventId);
    refreshData();
  };

  // Si pas encore connecté, afficher l'écran de connexion
  if (!loggedInUser) {
    return <PersonLogin onLogin={handleLogin} />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'planning':
        return (
          <UnifiedPersonalPlanning 
            userId={loggedInUser.id} 
            userName={loggedInUser.name}
            userType={loggedInUser.type}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 lg:h-16">
            <div className="flex items-center gap-2 lg:gap-4 overflow-hidden">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-purple-700 hover:text-purple-900 px-2 lg:px-3"
              >
                <ArrowLeft className="w-4 h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Retour</span>
              </Button>
              <div className="hidden lg:block h-6 w-px bg-purple-200" />
              <h1 className="text-base lg:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent truncate">
                Event Portal - {loggedInUser.name}
              </h1>
            </div>
            
            <div className="flex items-center gap-1 lg:gap-3">
              <div className="text-xs lg:text-sm text-purple-600 font-medium whitespace-nowrap">
                J-{daysUntilEvent} jours
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshData}
                disabled={loading}
                className="border-purple-200 text-purple-700 hover:bg-purple-50 h-7 w-7 lg:h-8 lg:w-auto lg:px-3 p-0"
                title="Actualiser"
              >
                <RefreshCw className={`w-4 h-4 ${!isMobile && 'mr-2'} ${loading ? 'animate-spin' : ''}`} />
                {!isMobile && 'Actualiser'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-red-200 text-red-700 hover:bg-red-50 h-7 w-7 lg:h-8 lg:w-auto lg:px-3 p-0"
                title="Déconnexion"
              >
                <LogOut className="w-4 h-4 lg:mr-2" />
                {!isMobile && 'Déconnexion'}
              </Button>
              {!isMobile && (
                <Button
                  onClick={() => navigate('/admin')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 lg:py-8 pb-20 lg:pb-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
              <p className="text-purple-600">Synchronisation avec l'Admin Portal...</p>
            </div>
          </div>
        ) : (
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
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <BottomNavigation 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      )}
    </div>
  );
};

export default EventPortal;
