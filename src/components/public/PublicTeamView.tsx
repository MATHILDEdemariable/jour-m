
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Users, Calendar, Clock, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PublicPersonalPlanning } from '@/components/public/PublicPersonalPlanning';

interface PublicTeamViewProps {
  eventId: string;
  userId: string;
  userType: 'person' | 'vendor';
  userName: string;
  eventName: string;
  onBack: () => void;
}

export const PublicTeamView: React.FC<PublicTeamViewProps> = ({
  eventId,
  userId,
  userType,
  userName,
  eventName,
  onBack
}) => {
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEventData = async () => {
      try {
        const { data: eventData, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single();

        if (error) {
          console.error('Error loading event:', error);
        } else {
          setEvent(eventData);
        }
      } catch (error) {
        console.error('Error loading event data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEventData();
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre planning...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-purple-600 hover:text-purple-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Bienvenue {userName}
                </h1>
                <p className="text-sm text-gray-600">
                  Planning pour {eventName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span className="capitalize">{userType === 'person' ? 'Équipe personnelle' : 'Prestataire'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Event Info */}
      {event && (
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                Informations de l'événement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    {new Date(event.event_date).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                {event.start_time && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{event.start_time}</span>
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                )}
              </div>
              {event.description && (
                <p className="text-sm text-gray-600 mt-4">{event.description}</p>
              )}
            </CardContent>
          </Card>

          {/* Planning Personnel */}
          <PublicPersonalPlanning
            eventId={eventId}
            userId={userId}
            userType={userType}
          />
        </div>
      )}
    </div>
  );
};
