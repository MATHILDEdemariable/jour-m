
import React from 'react';
import { RefreshCw } from 'lucide-react';

interface EventPortalLoadingProps {
  isRefreshing?: boolean;
  message?: string;
  details?: string | null;
  fullScreen?: boolean;
}

export const EventPortalLoading: React.FC<EventPortalLoadingProps> = ({
  isRefreshing,
  message,
  details,
  fullScreen = false
}) => {
  const loadingMessage = message || (isRefreshing ? 'Synchronisation forcée en cours...' : 'Chargement des données...');
  const detailMessage = details === undefined ? "Synchronisation avec l'Admin Portal" : details;

  const content = (
      <div className="text-center">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
        <p className="text-purple-600">
          {loadingMessage}
        </p>
        {detailMessage && (
          <p className="text-sm text-gray-500 mt-2">
            {detailMessage}
          </p>
        )}
      </div>
  );

  if (fullScreen) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        {content}
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center h-64">
      {content}
    </div>
  );
};
