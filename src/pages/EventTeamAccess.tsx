
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Users, Building2, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { usePeople } from '@/hooks/usePeople';
import { useVendors } from '@/hooks/useVendors';

type Event = {
  id: string;
  name: string;
  slug: string;
};

const EventTeamAccess = () => {
  const { eventSlug } = useParams<{ eventSlug: string }>();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [teamType, setTeamType] = useState<'personal' | 'professional' | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  const { people, loading: loadingPeople } = usePeople(event?.id);
  const { vendors, loading: loadingVendors } = useVendors(event?.id);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventSlug) return;
      setLoadingEvent(true);
      try {
        const { data, error } = await supabase
          .from('events')
          .select('id, name, slug')
          .eq('slug', eventSlug)
          .single();

        if (error) throw error;
        setEvent(data as Event);
      } catch (error) {
        console.error("Error fetching event by slug:", error);
        setEvent(null);
      } finally {
        setLoadingEvent(false);
      }
    };
    fetchEvent();
  }, [eventSlug]);

  const handleContinue = () => {
    if (!selectedUserId || !teamType || !event) return;

    const userType = teamType === 'personal' ? 'person' : 'vendor';
    const url = `/event/${event.id}?user_type=${userType}&user_id=${selectedUserId}`;
    
    navigate(url);
  };

  const handleBack = () => {
    setTeamType(null);
    setSelectedUserId('');
  };

  const renderContent = () => {
    if (loadingEvent) {
      return <p className="text-center text-gray-600">Chargement de l'événement...</p>;
    }

    if (!event) {
      return <p className="text-center text-red-600">Cet événement n'a pas été trouvé.</p>;
    }
    
    if (!teamType) {
      return (
        <div className="space-y-4">
            <h3 className="font-medium text-gray-900 text-center">Choisissez votre équipe :</h3>
            <div className="grid grid-cols-1 gap-3">
              <Button variant="outline" onClick={() => setTeamType('personal')} className="h-auto p-4 justify-start">
                <Users className="w-5 h-5 mr-3 text-purple-600" />
                <div className="text-left">
                  <div className="font-medium">Équipe personnelle</div>
                  <div className="text-sm text-gray-500">Membres, famille, amis...</div>
                </div>
              </Button>
              <Button variant="outline" onClick={() => setTeamType('professional')} className="h-auto p-4 justify-start">
                <Building2 className="w-5 h-5 mr-3 text-purple-600" />
                 <div className="text-left">
                    <div className="font-medium">Équipe professionnelle</div>
                    <div className="text-sm text-gray-500">Prestataires, fournisseurs...</div>
                  </div>
              </Button>
            </div>
        </div>
      );
    }

    const isLoadingData = teamType === 'personal' ? loadingPeople : loadingVendors;
    const data = teamType === 'personal' ? people : vendors;

    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={handleBack} className="text-purple-600 hover:text-purple-700">← Retour</Button>
        <h3 className="font-medium text-gray-900">
          {teamType === 'personal' ? 'Qui êtes-vous ?' : 'Quel prestataire êtes-vous ?'}
        </h3>
        {isLoadingData ? <p>Chargement...</p> : (
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez votre nom..." />
              </SelectTrigger>
              <SelectContent>
                {data.length > 0 ? (
                  data.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-data" disabled>Aucune personne trouvée</SelectItem>
                )}
              </SelectContent>
            </Select>
        )}
        <Button onClick={handleContinue} disabled={!selectedUserId || isLoadingData} className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
          <ArrowRight className="w-4 h-4 mr-2" />
          Accéder à mon espace
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
         <div className="mb-4">
            <Button variant="ghost" asChild>
                <RouterLink to="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour à l'accueil
                </RouterLink>
            </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Accès Équipe Jour-J</CardTitle>
            {event && <CardDescription className="text-center">Événement : {event.name}</CardDescription>}
          </CardHeader>
          <CardContent className="py-6">
            {renderContent()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventTeamAccess;
