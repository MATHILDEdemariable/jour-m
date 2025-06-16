
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, FileText, Clock, MapPin, AlertCircle, UserCheck } from 'lucide-react';
import { useTokenValidation } from '@/hooks/useTokenValidation';
import { PublicUserSelection } from './PublicUserSelection';
import { UnifiedPersonalPlanning } from '@/components/event/UnifiedPersonalPlanning';
import { PublicContactsTab } from './PublicContactsTab';
import { PublicDocuments } from './PublicDocuments';
import { useCurrentEvent } from '@/contexts/CurrentEventContext';
import { useSharedEventData } from '@/hooks/useSharedEventData';

interface SelectedUser {
  id: string;
  type: 'person' | 'vendor';
  name: string;
}

export const PublicTeamView = () => {
  const { eventId, shareToken } = useParams<{ eventId: string; shareToken: string }>();
  const { isValid, loading, error, event } = useTokenValidation(eventId!, shareToken!);
  const { setCurrentEventId } = useCurrentEvent();
  const { people, vendors, timelineItems, documents, refreshData } = useSharedEventData();
  const [activeTab, setActiveTab] = useState<'planning' | 'contacts' | 'documents'>('planning');
  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);
  const [viewMode, setViewMode] = useState<'personal' | 'global'>('personal');

  // Configuration de l'event ID et refresh des données
  useEffect(() => {
    if (eventId && isValid) {
      console.log('PublicTeamView - Setting current event ID:', eventId);
      setCurrentEventId(eventId);
      
      // Force refresh des données après avoir défini l'event ID
      setTimeout(() => {
        console.log('PublicTeamView - Forcing data refresh...');
        refreshData();
      }, 100);
    }
  }, [eventId, isValid, setCurrentEventId, refreshData]);

  // Gestion localStorage pour persistance utilisateur
  useEffect(() => {
    if (eventId && shareToken && isValid) {
      const stored = localStorage.getItem(`public-user-${eventId}-${shareToken}`);
      if (stored) {
        try {
          const parsedUser = JSON.parse(stored);
          console.log('PublicTeamView - Restored user from localStorage:', parsedUser);
          setSelectedUser(parsedUser);
        } catch (error) {
          console.error('Error parsing stored user:', error);
        }
      }
    }
  }, [eventId, shareToken, isValid]);

  const handleUserSelect = (userId: string, userType: 'person' | 'vendor', userName: string) => {
    const user = { id: userId, type: userType, name: userName };
    console.log('PublicTeamView - User selected:', user);
    setSelectedUser(user);
    
    // Sauvegarder dans localStorage
    if (eventId && shareToken) {
      localStorage.setItem(`public-user-${eventId}-${shareToken}`, JSON.stringify(user));
    }
  };

  const handleChangeUser = () => {
    console.log('PublicTeamView - Changing user');
    setSelectedUser(null);
    if (eventId && shareToken) {
      localStorage.removeItem(`public-user-${eventId}-${shareToken}`);
    }
  };

  // États de chargement et d'erreur
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validation de l'accès...</p>
        </div>
      </div>
    );
  }

  if (error || !isValid || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Accès non autorisé</h2>
            <p className="text-gray-600 mb-4">
              {error || 'Le lien est invalide ou a expiré.'}
            </p>
            <p className="text-sm text-gray-500">
              Veuillez demander un nouveau lien à l'organisateur de l'événement.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filtrage des données par event_id
  const filteredPeople = people.filter(p => p.event_id === eventId);
  const filteredVendors = vendors.filter(v => v.event_id === eventId);
  const filteredTimelineItems = timelineItems.filter(t => t.event_id === eventId);
  const filteredDocuments = documents.filter(d => d.event_id === eventId);

  console.log('PublicTeamView - Render data:');
  console.log('- Event ID:', eventId);
  console.log('- People filtered:', filteredPeople.length);
  console.log('- Vendors filtered:', filteredVendors.length);
  console.log('- Timeline items filtered:', filteredTimelineItems.length);
  console.log('- Documents filtered:', filteredDocuments.length);

  // Afficher la sélection d'utilisateur si aucun utilisateur sélectionné
  if (!selectedUser) {
    return (
      <PublicUserSelection
        people={filteredPeople}
        vendors={filteredVendors}
        eventName={event.name}
        onUserSelect={handleUserSelect}
      />
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const tabs = [
    { id: 'planning', label: 'Planning', icon: Calendar, count: filteredTimelineItems.length },
    { id: 'contacts', label: 'Équipe', icon: Users, count: filteredPeople.length + filteredVendors.length },
    { id: 'documents', label: 'Documents', icon: FileText, count: filteredDocuments.length }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'planning':
        return (
          <UnifiedPersonalPlanning 
            userId={selectedUser.id}
            userName={selectedUser.name}
            userType={selectedUser.type}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        );
      case 'contacts':
        return (
          <PublicContactsTab 
            people={filteredPeople} 
            vendors={filteredVendors} 
          />
        );
      case 'documents':
        return (
          <PublicDocuments 
            documents={filteredDocuments}
            selectedPersonId={selectedUser.type === 'person' ? selectedUser.id : null}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {event.name}
                </h1>
                <Badge variant="outline" className="border-purple-200 text-purple-700 bg-purple-50">
                  Accès Équipe
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(event.event_date)}
                </div>
                {event.start_time && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {event.start_time.substring(0, 5)}
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                )}
              </div>
            </div>
            
            {/* User info and change button */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm">
                <UserCheck className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-gray-700">{selectedUser.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {selectedUser.type === 'person' ? 'Équipe' : 'Prestataire'}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleChangeUser}
                className="border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                Changer d'utilisateur
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'outline'}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                    : 'border-purple-200 text-purple-700 hover:bg-purple-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                <Badge variant="secondary" className="ml-1 text-xs">
                  {tab.count}
                </Badge>
              </Button>
            );
          })}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
