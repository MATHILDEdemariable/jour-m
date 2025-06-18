
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Heart } from 'lucide-react';
import { useLocalEventData } from '@/contexts/LocalEventDataContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const ReadOnlyEventConfig = () => {
  const { currentEvent, getDaysUntilEvent } = useLocalEventData();

  if (!currentEvent) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun événement</h3>
          <p className="text-gray-500">Les informations de l'événement apparaîtront ici.</p>
        </CardContent>
      </Card>
    );
  }

  const daysUntil = getDaysUntilEvent();

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Heart className="w-6 h-6 text-purple-600" />
            {currentEvent.name}
          </CardTitle>
          <CardDescription className="text-base">
            Informations générales de votre événement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-medium">Date de l'événement</p>
                <p className="text-gray-600">
                  {format(new Date(currentEvent.event_date), 'EEEE d MMMM yyyy', { locale: fr })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
              <MapPin className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-medium">Lieu</p>
                <p className="text-gray-600">{currentEvent.location || 'Non défini'}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
            <Users className="w-5 h-5 text-purple-600" />
            <div>
              <p className="font-medium">Type d'événement</p>
              <p className="text-gray-600">{currentEvent.event_type}</p>
            </div>
          </div>

          {currentEvent.description && (
            <div className="p-3 bg-white rounded-lg">
              <p className="font-medium mb-1">Description</p>
              <p className="text-gray-600">{currentEvent.description}</p>
            </div>
          )}

          <div className="text-center p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
            <p className="text-lg font-semibold text-purple-800">
              {daysUntil === 0 ? "C'est aujourd'hui !" : 
               daysUntil === 1 ? "Demain c'est le grand jour !" :
               `Plus que ${daysUntil} jours !`}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
