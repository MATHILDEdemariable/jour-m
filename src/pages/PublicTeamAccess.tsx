
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTokenValidation } from '@/hooks/useTokenValidation';
import { PublicUserSelection } from '@/components/public/PublicUserSelection';
import { PublicTeamView } from '@/components/public/PublicTeamView';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';

const PublicTeamAccess = () => {
  const { eventId, shareToken } = useParams<{ eventId: string; shareToken: string }>();
  const { isValid, loading, error, event } = useTokenValidation(eventId!, shareToken!);
  const [selectedUser, setSelectedUser] = useState<{
    userId: string;
    userType: 'person' | 'vendor';
    userName: string;
  } | null>(null);

  console.log('PublicTeamAccess - Component loaded');
  console.log('PublicTeamAccess - Params:', { eventId, shareToken });
  console.log('PublicTeamAccess - Validation result:', { isValid, loading, error });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Vérification du lien...</h2>
            <p className="text-gray-600">Validation de votre accès en cours</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !isValid || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès non autorisé</h2>
            <p className="text-gray-600 mb-4">
              {error || 'Le lien de partage est invalide ou a expiré.'}
            </p>
            <div className="text-sm text-gray-500">
              Veuillez demander un nouveau lien à l'organisateur de l'événement.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Si un utilisateur est sélectionné, afficher la vue équipe
  if (selectedUser) {
    return (
      <PublicTeamView
        eventId={eventId!}
        userId={selectedUser.userId}
        userType={selectedUser.userType}
        userName={selectedUser.userName}
        eventName={event.name}
        onBack={() => setSelectedUser(null)}
      />
    );
  }

  // Sinon, afficher la sélection d'utilisateur
  return (
    <PublicUserSelection
      people={[]} // Sera chargé dans le composant
      vendors={[]} // Sera chargé dans le composant
      eventName={event.name}
      eventId={eventId!}
      onUserSelect={(userId, userType, userName) => {
        console.log('User selected:', { userId, userType, userName });
        setSelectedUser({ userId, userType, userName });
      }}
    />
  );
};

export default PublicTeamAccess;
