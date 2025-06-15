
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Users, Building2, ArrowRight, UserCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { usePeople } from '@/hooks/usePeople';
import { useVendors } from '@/hooks/useVendors';
import { useCurrentEvent } from '@/contexts/CurrentEventContext';

type Event = {
  id: string;
  name: string;
  slug: string;
};

const EventTeamAccess = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { setCurrentEventId } = useCurrentEvent();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [teamType, setTeamType] = useState<'personal' | 'professional' | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  // Synchronisation dynamique des membres/équipes
  const { people, loading: loadingPeople } = usePeople(eventId);
  const { vendors, loading: loadingVendors } = useVendors(eventId);

  useEffect(() => {
    if (eventId) setCurrentEventId(eventId);
  }, [eventId, setCurrentEventId]);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;
      setLoadingEvent(true);
      try {
        const { data, error } = await supabase
          .from('events')
          .select('id, name, slug')
          .eq('id', eventId)
          .single();

        if (error) throw error;
        setEvent(data as Event);
      } catch (error) {
        setEvent(null);
      } finally {
        setLoadingEvent(false);
      }
    };
    fetchEvent();
  }, [eventId]);

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
      return (
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <p className="text-center text-gray-700">Chargement de l'événement...</p>
        </div>
      );
    }
    if (!event) {
      return <p className="text-center text-red-600">Cet événement n'a pas été trouvé.</p>;
    }
    if (!teamType) {
      return (
        <div className="space-y-6">
          <h3 className="font-semibold text-gray-900 text-center text-xl mb-4">Accès équipe événement&nbsp;: <span className="font-bold text-purple-700">{event.name}</span></h3>
          <p className="text-center text-gray-600 mb-3">Veuillez indiquer à quelle équipe vous appartenez en sélectionnant la bonne catégorie :</p>
          <div className="flex flex-col gap-3">
            <Button variant="outline" onClick={() => setTeamType('personal')} className="h-auto p-5 !justify-start shadow-sm group">
              <Users className="w-6 h-6 mr-3 text-purple-700 group-hover:text-purple-900 transition" />
              <div className="text-left">
                <div className="font-semibold text-base">Équipe personnelle</div>
                <div className="text-gray-500 text-sm">Membres, famille, amis</div>
              </div>
            </Button>
            <Button variant="outline" onClick={() => setTeamType('professional')} className="h-auto p-5 !justify-start shadow-sm group">
              <Building2 className="w-6 h-6 mr-3 text-purple-700 group-hover:text-purple-900 transition" />
              <div className="text-left">
                <div className="font-semibold text-base">Équipe professionnelle</div>
                <div className="text-gray-500 text-sm">Prestataires, fournisseurs</div>
              </div>
            </Button>
          </div>
        </div>
      );
    }

    const isLoadingData = teamType === 'personal' ? loadingPeople : loadingVendors;
    const data = teamType === 'personal' ? people : vendors;
    const placeholder = teamType === 'personal' 
      ? "Sélectionnez votre nom..." 
      : "Sélectionnez votre société ou activité...";

    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="text-purple-600 hover:text-purple-700"
        >
          ← Changer mon type d'équipe
        </Button>
        <h3 className="font-medium text-gray-900 text-lg">
          {teamType === 'personal' ? 'Qui êtes-vous parmi les invités/membres ?' : 'Quel prestataire êtes-vous ?'}
        </h3>
        {isLoadingData ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"/> 
            <span className="text-sm text-gray-600">Chargement...</span>
          </div>
        ) : (
          <Select value={selectedUserId} onValueChange={setSelectedUserId}>
            <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-purple-400">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-white z-[100] shadow-lg border-gray-100 max-h-72 overflow-y-auto">
              {data.length > 0 ? data.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  <div className="flex items-center gap-2">
                    <UserCircle2 className="w-5 h-5 text-purple-500" />
                    <span>
                      {item.name}
                    </span>
                  </div>
                </SelectItem>
              )) : (
                <SelectItem value="no-data" disabled className="text-gray-400">
                  {teamType === 'personal' 
                    ? "Aucun membre n’a encore été ajouté"
                    : "Aucun prestataire n’a encore été ajouté"}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        )}
        <Button
          onClick={handleContinue}
          disabled={!selectedUserId || isLoadingData}
          className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-base py-3 font-semibold flex items-center justify-center"
        >
          <ArrowRight className="w-5 h-5 mr-2" />
          Accéder à mon espace événement
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-4">
          <Button variant="ghost" asChild>
            <RouterLink to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </RouterLink>
          </Button>
        </div>
        <Card className="shadow-2xl border-2 border-purple-100">
          <CardHeader>
            <CardTitle className="text-center">Accès à l'événement</CardTitle>
            {event && <CardDescription className="text-center">Événement : <span className="font-semibold text-purple-700">{event.name}</span></CardDescription>}
          </CardHeader>
          <CardContent className="py-7">
            {renderContent()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventTeamAccess;

