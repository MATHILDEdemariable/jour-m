
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, Building2, ArrowRight, UserCheck } from 'lucide-react';

interface PublicUserSelectionProps {
  people: any[];
  vendors: any[];
  eventName: string;
  onUserSelect: (userId: string, userType: 'person' | 'vendor', userName: string) => void;
}

export const PublicUserSelection: React.FC<PublicUserSelectionProps> = ({
  people,
  vendors,
  eventName,
  onUserSelect
}) => {
  const [teamType, setTeamType] = useState<'personal' | 'professional' | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  const handleTeamTypeSelect = (type: 'personal' | 'professional') => {
    setTeamType(type);
    setSelectedUserId('');
  };

  const handleContinue = () => {
    if (!selectedUserId || !teamType) return;

    const userType = teamType === 'personal' ? 'person' : 'vendor';
    const users = teamType === 'personal' ? people : vendors;
    const selectedUser = users.find(user => user.id === selectedUserId);
    
    if (selectedUser) {
      onUserSelect(selectedUserId, userType, selectedUser.name);
    }
  };

  const handleBack = () => {
    setTeamType(null);
    setSelectedUserId('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center space-y-2">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCheck className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-xl text-gray-900">Accès Équipe</CardTitle>
          <div className="text-sm text-gray-600">
            <div className="font-medium">{eventName}</div>
            <div className="mt-1">Sélectionnez votre profil pour accéder à votre planning</div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {!teamType ? (
            // Step 1: Choose team type
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 text-center">Vous êtes :</h3>
              
              <div className="grid grid-cols-1 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleTeamTypeSelect('personal')}
                  className="h-auto p-4 justify-start border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-all"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-medium">Équipe personnelle</div>
                      <div className="text-sm text-gray-500">
                        Invités, famille, témoins...
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {people.length}
                    </Badge>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleTeamTypeSelect('professional')}
                  className="h-auto p-4 justify-start border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-all"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Building2 className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-medium">Équipe professionnelle</div>
                      <div className="text-sm text-gray-500">
                        Prestataires et fournisseurs
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {vendors.length}
                    </Badge>
                  </div>
                </Button>
              </div>
            </div>
          ) : (
            // Step 2: Select specific person/vendor
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                >
                  ← Retour
                </Button>
              </div>

              <h3 className="font-medium text-gray-900">
                {teamType === 'personal' ? 'Choisissez votre nom :' : 'Choisissez votre prestataire :'}
              </h3>

              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={
                    teamType === 'personal' 
                      ? "Sélectionnez votre nom..." 
                      : "Sélectionnez votre prestataire..."
                  } />
                </SelectTrigger>
                <SelectContent>
                  {teamType === 'personal' ? (
                    people.length > 0 ? (
                      people.map((person) => (
                        <SelectItem key={person.id} value={person.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{person.name}</span>
                            {person.role && (
                              <span className="text-xs text-gray-500 capitalize">{person.role}</span>
                            )}
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-people" disabled>
                        Aucune personne disponible
                      </SelectItem>
                    )
                  ) : (
                    vendors.length > 0 ? (
                      vendors.map((vendor) => (
                        <SelectItem key={vendor.id} value={vendor.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{vendor.name}</span>
                            {vendor.service_type && (
                              <span className="text-xs text-gray-500">{vendor.service_type}</span>
                            )}
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-vendors" disabled>
                        Aucun prestataire disponible
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>

              <Button
                onClick={handleContinue}
                disabled={!selectedUserId || selectedUserId === 'no-people' || selectedUserId === 'no-vendors'}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Accéder à mon planning
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
