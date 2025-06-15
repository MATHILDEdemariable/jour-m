
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Users, UserCheck, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Person {
  id: string;
  name: string;
  role: string;
}
interface Vendor {
  id: string;
  name: string;
  service_type: string;
}
interface EventInfo {
  id: string;
  name: string;
  slug: string;
  event_date: string;
}

type UserType = 'person' | 'vendor';

export const EventTeamAccess = () => {
  const { eventSlug } = useParams<{ eventSlug: string }>();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<EventInfo | null>(null);
  const [people, setPeople] = useState<Person[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [selectedUserId, setSelectedUserId] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!eventSlug) return;
    const fetchEventAndTeam = async () => {
      setLoading(true);
      // Get event by slug
      const { data: eventRows, error: eventError } = await supabase
        .from('events')
        .select('id, name, slug, event_date')
        .eq('slug', eventSlug)
        .limit(1);

      if (eventError || !eventRows || eventRows.length === 0) {
        toast({
          title: 'Événement introuvable',
          description: 'Cet événement n\'existe pas.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      const foundEvent = eventRows[0];
      setEvent(foundEvent);

      // Load people & vendors for this event
      const [{ data: peopleRows }, { data: vendorsRows }] = await Promise.all([
        supabase.from('people').select('id, name, role').eq('event_id', foundEvent.id),
        supabase.from('vendors').select('id, name, service_type').eq('event_id', foundEvent.id),
      ]);

      setPeople(peopleRows || []);
      setVendors(vendorsRows || []);
      setLoading(false);
    };

    fetchEventAndTeam();
  }, [eventSlug, toast]);

  const handleAccess = () => {
    if (!event || !userType || !selectedUserId) {
      toast({
        title: 'Informations manquantes',
        description: 'Veuillez sélectionner votre identité.',
        variant: 'destructive',
      });
      return;
    }
    navigate(`/event/${event.id}?user_type=${userType}&user_id=${selectedUserId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="bg-white/80 backdrop-blur-sm border-b border-blue-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" onClick={() => navigate('/')} className="mr-4">
              {/* Back arrow */}
              <svg className="w-4 h-4 mr-2" viewBox="0 0 16 16" fill="none"><path d="M8 3L3 8M3 8L8 13M3 8H15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Retour
            </Button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate">
              Accès Équipe – {event ? event.name : loading ? 'Chargement...' : 'Erreur'}
            </h1>
          </div>
        </div>
      </div>
      <div className="max-w-xl mx-auto px-4 py-10">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Rejoindre l’événement</CardTitle>
            <p className="text-gray-600">
              Sélectionnez votre mode d’accès pour <b>{event?.name}</b>
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: type */}
            {!userType && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="flex flex-col items-center border-2 border-blue-400 hover:bg-blue-50 py-6"
                  onClick={() => setUserType('person')}
                  data-testid="btn-person"
                >
                  <Users className="w-7 h-7 mb-2 text-blue-600" />
                  <span className="font-medium">Équipe Personnelle</span>
                  <span className="text-xs text-gray-500">Organisateurs, proches, invités avec rôles</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center border-2 border-purple-500 hover:bg-purple-50 py-6"
                  onClick={() => setUserType('vendor')}
                  data-testid="btn-vendor"
                >
                  <Building2 className="w-7 h-7 mb-2 text-purple-700" />
                  <span className="font-medium">Équipe Professionnelle</span>
                  <span className="text-xs text-gray-500">Prestataires, intervenants</span>
                </Button>
              </div>
            )}
            {/* Step 2: identity */}
            {userType && (
              <div className="space-y-4">
                <div>
                  <Button size="sm" variant="ghost" onClick={() => { setUserType(null); setSelectedUserId(''); }}>
                    &larr; Retour
                  </Button>
                </div>
                <Label className="block mb-2">
                  {userType === 'person' ? 'Qui êtes-vous dans l’équipe personnelle ?' : 'Sélectionnez votre entreprise / prestataire'}
                </Label>
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger>
                    <SelectValue placeholder={userType === 'person' ? "Sélectionnez votre nom" : "Sélectionnez votre société"} />
                  </SelectTrigger>
                  <SelectContent>
                    {(userType === 'person' ? people : vendors).map(item => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name} {(userType === 'person' && (item as Person).role) ? `(${(item as Person).role})` : (userType === 'vendor' && (item as Vendor).service_type ? `– ${(item as Vendor).service_type}` : "")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {(userType === 'person' && people.length === 0) && (
                  <p className="text-gray-500 text-xs">Aucun membre trouvé pour cet événement.</p>
                )}
                {(userType === 'vendor' && vendors.length === 0) && (
                  <p className="text-gray-500 text-xs">Aucun prestataire trouvé pour cet événement.</p>
                )}
                <Button
                  className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600"
                  onClick={handleAccess}
                  disabled={!selectedUserId}
                  size="lg"
                >
                  Accéder à mon espace
                </Button>
              </div>
            )}

            <div className="pt-6 border-t flex flex-col items-center gap-2">
              <span className="text-xs text-gray-400">
                URL à partager : <b>{window?.location.origin + `/equipe/${eventSlug}`}</b>
              </span>
              <Button
                variant="link"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.origin + `/equipe/${eventSlug}`);
                  toast({ title: 'Lien copié !' });
                }}
              >
                Copier le lien d’accès équipe
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default EventTeamAccess;

