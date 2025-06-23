
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Mail, Phone, User } from 'lucide-react';
import { useSharedEventData } from '@/hooks/useSharedEventData';

export const TeamOverview = () => {
  const { people, getTeamSummary } = useSharedEventData();
  const teamSummary = getTeamSummary();

  const statusColors = {
    confirmed: 'bg-green-100 text-green-800 border-green-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    declined: 'bg-red-100 text-red-800 border-red-200'
  };

  const roleLabels = {
    bride: "Mariée",
    groom: "Marié",
    "best-man": "Témoin",
    "maid-of-honor": "Demoiselle d'honneur",
    "wedding-planner": "Wedding Planner",
    photographer: "Photographe",
    caterer: "Traiteur",
    guest: "Invité",
    family: "Famille"
  };

  // Afficher les personnes clés en premier
  const keyPeople = people.filter(p => ['bride', 'groom', 'wedding-planner', 'photographer'].includes(p.role || '')).slice(0, 6);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg text-gray-900">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            Équipe
          </div>
          <Badge variant="outline" className="text-blue-700 border-blue-200">
            {teamSummary.confirmed}/{teamSummary.total} confirmés
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {keyPeople.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Aucune personne dans l'équipe</p>
          </div>
        ) : (
          <div className="space-y-3">
            {keyPeople.map((person) => (
              <div key={person.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{person.name}</h4>
                    <p className="text-sm text-gray-600">
                      {roleLabels[person.role as keyof typeof roleLabels] || person.role}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={statusColors[person.confirmation_status as keyof typeof statusColors] || statusColors.pending} variant="outline">
                    {person.confirmation_status === 'confirmed' ? 'Confirmé' : 
                     person.confirmation_status === 'pending' ? 'En attente' : 'Décliné'}
                  </Badge>
                  
                  <div className="flex gap-1">
                    {person.email && (
                      <div className="p-1 bg-blue-100 rounded">
                        <Mail className="w-3 h-3 text-blue-600" />
                      </div>
                    )}
                    {person.phone && (
                      <div className="p-1 bg-green-100 rounded">
                        <Phone className="w-3 h-3 text-green-600" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {people.length > 6 && (
              <div className="text-center pt-2">
                <Badge variant="outline" className="text-gray-600 border-gray-300">
                  +{people.length - 6} autres personnes
                </Badge>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
