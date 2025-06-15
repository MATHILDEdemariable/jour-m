import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Users, UserCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
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
  event_date: string;
}

export const TeamAccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const [eventId, setEventId] = useState('');
  const [userType, setUserType] = useState<'person' | 'vendor' | ''>('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [people, setPeople] = useState<Person[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [eventValid, setEventValid] = useState(false);

  const [eventOptions, setEventOptions] = useState<EventInfo[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  // Charger la liste des événements pour le menu déroulant
  useEffect(() => {
    const fetchEvents = async () => {
      setEventsLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('id, name, event_date')
        .order('event_date', { ascending: false });

      if (error) {
        toast({
          title: 'Erreur',
          description: "Impossible de charger la liste des événements",
          variant: 'destructive'
        });
      } else {
        setEventOptions(data || []);
      }
      setEventsLoading(false);
    };
    fetchEvents();
  }, [toast]);

  // Auto-remplir depuis les paramètres URL
  useEffect(() => {
    const urlEventId = searchParams.get('event');
    const urlUserType = searchParams.get('type') as 'person' | 'vendor' | null;
    const urlUserId = searchParams.get('id');
    if (urlEventId) setEventId(urlEventId);
    if (urlUserType) setUserType(urlUserType);
    if (urlUserId) setSelectedUserId(urlUserId);
  }, [searchParams]);

  // Vérifier l'événement et charger les données associées
  useEffect(() => {
    if (eventId) {
      verifyEventAndLoadData();
    }
  }, [eventId]);

  const verifyEventAndLoadData = async () => {
    if (!eventId) return;
    setLoading(true);
    try {
      // Vérifier que l'événement existe
      const foundEvent = eventOptions.find(e => e.id === eventId);
      if (!foundEvent) {
        toast({
          title: "Événement introuvable",
          description: "Cet événement n'existe pas.",
          variant: "destructive",
        });
        setEventValid(false);
        setPeople([]);
        setVendors([]);
        setLoading(false);
        return;
      }
      setEventValid(true);

      // Charger les personnes et prestataires liées à l'événement
      const [peopleResult, vendorsResult] = await Promise.all([
        supabase
          .from('people')
          .select('id, name, role')
          .eq('event_id', eventId),
        supabase
          .from('vendors')
          .select('id, name, service_type')
          .eq('event_id', eventId),
      ]);

      setPeople(peopleResult.data || []);
      setVendors(vendorsResult.data || []);
    } catch (error) {
      console.error('Error verifying event:', error);
      toast({
        title: 'Erreur',
        description: "Impossible de vérifier l’événement.",
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAccess = () => {
    if (!eventId || !userType || !selectedUserId) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive",
      });
      return;
    }
    navigate(`/event/${eventId}?user_type=${userType}&user_id=${selectedUserId}`);
  };

  const currentUserList = userType === 'person' ? people : vendors;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="bg-white/80 backdrop-blur-sm border-b border-blue-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" onClick={() => navigate('/')} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Accès Équipe
            </h1>
          </div>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Rejoindre votre équipe</CardTitle>
            <p className="text-gray-600">
              Accédez à votre planning et vos tâches en quelques clics
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Étape 1: Sélection événement via menu déroulant */}
            <div className="space-y-2">
              <Label htmlFor="eventId">Sélectionnez votre événement</Label>
              <Select
                value={eventId}
                onValueChange={value => setEventId(value)}
                disabled={eventsLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={eventsLoading ? "Chargement..." : "Choisissez l’événement"} />
                </SelectTrigger>
                <SelectContent>
                  {eventOptions.map(ev => (
                    <SelectItem key={ev.id} value={ev.id}>
                      {ev.name} {ev.event_date && `(${new Date(ev.event_date).toLocaleDateString('fr-FR')})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {eventOptions.length === 0 && !eventsLoading && (
                <p className="text-sm text-gray-500 px-2 pt-2">
                  Aucun événement disponible.
                </p>
              )}
              {eventValid && (
                <p className="text-sm text-green-600 flex items-center">
                  <UserCheck className="w-4 h-4 mr-1" />
                  Événement trouvé !
                </p>
              )}
            </div>
            {/* Étape 2: Type d'utilisateur */}
            {eventValid && (
              <div className="space-y-2">
                <Label>Je suis...</Label>
                <Select value={userType} onValueChange={(value: 'person' | 'vendor') => setUserType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisissez votre rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="person">👥 Membre de l'équipe</SelectItem>
                    <SelectItem value="vendor">🏢 Prestataire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {/* Étape 3: Sélection d'identité */}
            {eventValid && userType && (
              <div className="space-y-2">
                <Label>Qui êtes-vous ?</Label>
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre nom" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentUserList.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} {userType === 'person' ? `(${user.role})` : `- ${(user as Vendor).service_type}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {currentUserList.length === 0 && (
                  <p className="text-sm text-gray-500">
                    Aucun {userType === 'person' ? 'membre' : 'prestataire'} trouvé pour cet événement.
                  </p>
                )}
              </div>
            )}
            {/* Bouton d'accès */}
            <Button 
              onClick={handleAccess}
              disabled={!eventId || !userType || !selectedUserId || loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              size="lg"
            >
              {loading ? 'Vérification...' : 'Accéder à mon planning'}
            </Button>
            {/* Aide */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-gray-500">
                Vous ne trouvez pas votre événement ? Contactez l’organisateur.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeamAccess;
