
import React from 'react';
import { useParams } from 'react-router-dom';
import { CurrentEventProvider } from '@/contexts/CurrentEventContext';
import { EventDataProvider } from '@/contexts/EventDataContext';
import { PublicTeamView } from '@/components/public/PublicTeamView';

const PublicTeamAccess = () => {
  const { eventId, shareToken } = useParams<{ eventId: string; shareToken: string }>();

  // Validation des paramètres URL
  if (!eventId || !shareToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Lien invalide</h1>
          <p className="text-gray-600">Les paramètres du lien sont manquants ou incorrects.</p>
        </div>
      </div>
    );
  }

  return (
    <CurrentEventProvider>
      <EventDataProvider>
        <PublicTeamView />
      </EventDataProvider>
    </CurrentEventProvider>
  );
};

export default PublicTeamAccess;
