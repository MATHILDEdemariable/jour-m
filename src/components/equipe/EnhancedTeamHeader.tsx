
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Calendar, Eye, Wifi } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocalEventData } from '@/contexts/LocalEventDataContext';

export const EnhancedTeamHeader = () => {
  const navigate = useNavigate();
  const { currentEvent, getDaysUntilEvent } = useLocalEventData();

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4 overflow-hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900 flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Accueil
            </Button>
            
            <div className="overflow-hidden">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Eye className="w-4 h-4 text-white" />
                </div>
                <div className="overflow-hidden">
                  <h1 className="text-xl lg:text-2xl font-bold text-gray-900 truncate">
                    {currentEvent ? currentEvent.name : 'Jour J'} - Vue Équipe
                  </h1>
                  {currentEvent && (
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{currentEvent.event_type}</span>
                      <span>•</span>
                      <span>{new Date(currentEvent.event_date).toLocaleDateString('fr-FR')}</span>
                      <span>•</span>
                      <span className="font-medium">
                        J-{getDaysUntilEvent()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
              <Wifi className="w-3 h-3" />
              Données Locales
            </Badge>
            
            <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
              <Users className="w-3 h-3" />
              Vue Lecture
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};
