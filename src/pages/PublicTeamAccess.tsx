
import React from 'react';
import { useParams } from 'react-router-dom';

const PublicTeamAccess = () => {
  const params = useParams<{ eventId: string; shareToken: string }>();
  
  console.log('PublicTeamAccess - Component loaded');
  console.log('PublicTeamAccess - Params:', params);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-green-600 mb-4">✅ Route fonctionne !</h1>
        <div className="space-y-2">
          <p><strong>Event ID:</strong> {params.eventId || 'Non trouvé'}</p>
          <p><strong>Share Token:</strong> {params.shareToken || 'Non trouvé'}</p>
          <p className="text-sm text-gray-500">
            URL actuelle: {window.location.pathname}
          </p>
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded">
          <p className="text-sm text-blue-700">
            Si vous voyez ce message, la route React fonctionne !
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicTeamAccess;
