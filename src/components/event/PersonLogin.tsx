
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Building2 } from 'lucide-react';
import { useSharedEventData } from '@/hooks/useSharedEventData';
import { useVendors } from '@/hooks/useVendors';

interface PersonLoginProps {
  onLogin: (userId: string, userName: string, userType: 'person' | 'vendor') => void;
}

export const PersonLogin: React.FC<PersonLoginProps> = ({ onLogin }) => {
  const [selectedUserType, setSelectedUserType] = useState<'person' | 'vendor'>('person');
  const [selectedUserId, setSelectedUserId] = useState('');
  const { people, loading: peopleLoading } = useSharedEventData();
  const { vendors, loading: vendorsLoading } = useVendors();

  const confirmedPeople = people.filter(p => p.status === 'confirmed');
  const confirmedVendors = vendors.filter(v => v.contract_status === 'signed');

  const handleLogin = () => {
    if (!selectedUserId) return;

    if (selectedUserType === 'person') {
      const person = confirmedPeople.find(p => p.id === selectedUserId);
      if (person) {
        onLogin(person.id, person.name, 'person');
      }
    } else {
      const vendor = confirmedVendors.find(v => v.id === selectedUserId);
      if (vendor) {
        onLogin(vendor.id, vendor.name, 'vendor');
      }
    }
  };

  const loading = peopleLoading || vendorsLoading;
  const currentList = selectedUserType === 'person' ? confirmedPeople : confirmedVendors;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Connexion Event Portal
          </CardTitle>
          <p className="text-gray-600">Sélectionnez votre profil pour accéder à votre planning personnel</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User Type Selection */}
          <div className="flex gap-2">
            <Button
              variant={selectedUserType === 'person' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setSelectedUserType('person');
                setSelectedUserId('');
              }}
              className={`flex-1 ${selectedUserType === 'person' ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''}`}
            >
              <Users className="w-4 h-4 mr-2" />
              Équipe
            </Button>
            <Button
              variant={selectedUserType === 'vendor' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setSelectedUserType('vendor');
                setSelectedUserId('');
              }}
              className={`flex-1 ${selectedUserType === 'vendor' ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''}`}
            >
              <Building2 className="w-4 h-4 mr-2" />
              Prestataires
            </Button>
          </div>

          {/* User Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {selectedUserType === 'person' ? 'Sélectionnez votre nom' : 'Sélectionnez votre prestataire'}
            </label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger className="border-purple-200 focus:border-purple-500">
                <SelectValue placeholder={`Choisir ${selectedUserType === 'person' ? 'une personne' : 'un prestataire'}...`} />
              </SelectTrigger>
              <SelectContent>
                {currentList.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.name}</span>
                      <span className="text-xs text-gray-500">
                        {selectedUserType === 'person' 
                          ? (user as any).role || 'Membre de l\'équipe'
                          : (user as any).service_type || 'Prestataire'
                        }
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Login Button */}
          <Button
            onClick={handleLogin}
            disabled={loading || !selectedUserId}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {loading ? 'Chargement...' : 'Se connecter'}
          </Button>

          {/* Stats Preview */}
          <div className="grid grid-cols-2 gap-3 mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">{confirmedPeople.length}</div>
              <div className="text-xs text-gray-600">Membres confirmés</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-pink-600">{confirmedVendors.length}</div>
              <div className="text-xs text-gray-600">Prestataires signés</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
