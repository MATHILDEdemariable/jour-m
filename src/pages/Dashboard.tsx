
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/cards';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, Settings, LogOut, Crown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';

interface Event {
  id: string;
  name: string;
  event_type: string;
  event_date: string;
  location?: string;
  status: string;
}

export const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { subscription, canCreateEvents, getPlanLimits } = useSubscription();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching events:', error);
          return;
        }

        setEvents(data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user, navigate]);

  const handleCreateEvent = () => {
    if (!canCreateEvents(events.length)) {
      alert('Vous avez atteint la limite d\'événements pour votre plan. Passez à un plan supérieur pour créer plus d\'événements.');
      return;
    }
    navigate('/create-event');
  };

  const handleEventClick = (eventId: string) => {
    navigate(`/event/${eventId}`);
  };

  const limits = getPlanLimits();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Jour J
              </h1>
              <Badge variant="outline" className="hidden sm:inline-flex">
                {subscription?.plan_type === 'free' && 'Plan Gratuit'}
                {subscription?.plan_type === 'premium' && (
                  <span className="flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    Plan Premium
                  </span>
                )}
                {subscription?.plan_type === 'pro' && (
                  <span className="flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    Plan Pro
                  </span>
                )}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Paramètres
              </Button>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Bonjour {user?.user_metadata?.full_name || user?.email} !
          </h2>
          <p className="text-gray-600">
            Gérez vos événements et organisez-les parfaitement
          </p>
        </div>

        {/* Plan Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-purple-600" />
              Votre abonnement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-600">Événements</div>
                <div className="font-bold">{events.length} / {limits.events}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Stockage</div>
                <div className="font-bold">{limits.storage}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Fonctionnalités</div>
                <div className="text-sm">{limits.features.join(', ')}</div>
              </div>
            </div>
            {subscription?.plan_type === 'free' && (
              <div className="mt-4">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                  Passer au Premium
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Events Section */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Mes événements</h3>
          <Button onClick={handleCreateEvent} className="bg-gradient-to-r from-purple-600 to-pink-600">
            <Plus className="w-4 h-4 mr-2" />
            Nouvel événement
          </Button>
        </div>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleEventClick(event.id)}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    {event.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Type:</span>
                      <span className="text-sm font-medium">{event.event_type}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Date:</span>
                      <span className="text-sm font-medium">
                        {new Date(event.event_date).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    {event.location && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Lieu:</span>
                        <span className="text-sm font-medium">{event.location}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Statut:</span>
                      <Badge variant={event.status === 'completed' ? 'default' : 'secondary'}>
                        {event.status === 'planning' && 'En préparation'}
                        {event.status === 'active' && 'En cours'}
                        {event.status === 'completed' && 'Terminé'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun événement</h3>
              <p className="text-gray-600 mb-4">
                Créez votre premier événement pour commencer à organiser
              </p>
              <Button onClick={handleCreateEvent} className="bg-gradient-to-r from-purple-600 to-pink-600">
                <Plus className="w-4 h-4 mr-2" />
                Créer mon premier événement
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
