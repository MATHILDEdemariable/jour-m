
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Building2, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { useSharedEventData } from '@/hooks/useSharedEventData';
import { useCurrentEvent } from '@/contexts/CurrentEventContext';

interface PersonLoginProps {
  onLogin: (userId: string, userName: string, userType: 'person' | 'vendor') => void;
}

export const PersonLogin: React.FC<PersonLoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [selectedUserType, setSelectedUserType] = useState<'person' | 'vendor'>('person');
  const [selectedUserId, setSelectedUserId] = useState('');
  const { people, vendors, loading, refreshData } = useSharedEventData();
  const { currentEventId } = useCurrentEvent();

  // Debug logs pour diagnostiquer la synchronisation
  console.log('=== PersonLogin Debug - Accès Simplifié ===');
  console.log('Current Event ID:', currentEventId);
  console.log('Loading state:', loading);
  console.log('All people for this event:', people);
  console.log('All vendors for this event:', vendors);
  console.log('=== End PersonLogin Debug ===');

  const handleLogin = () => {
    if (!selectedUserId) return;

    if (selectedUserType === 'person') {
      const person = people.find(p => p.id === selectedUserId);
      if (person) {
        console.log('Logging in person:', person);
        onLogin(person.id, person.name, 'person');
      }
    } else {
      const vendor = vendors.find(v => v.id === selectedUserId);
      if (vendor) {
        console.log('Logging in vendor:', vendor);
        onLogin(vendor.id, vendor.name, 'vendor');
      }
    }
  };

  const handleRefresh = () => {
    console.log('Manual refresh triggered for event ID:', currentEventId);
    refreshData();
    setSelectedUserId(''); // Reset selection after refresh
  };

  const currentList = selectedUserType === 'person' ? people : vendors;
  const hasData = people.length > 0 || vendors.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
      {/* Bouton retour en haut à gauche */}
      <Button
        variant="ghost"
        onClick={() => navigate('/')}
        className="fixed top-4 left-4 text-gray-600 hover:text-purple-600 z-10"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour
      </Button>

      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Connexion Event Portal
          </CardTitle>
          <p className="text-gray-600">Sélectionnez votre profil pour accéder à votre planning personnel</p>
          
          {/* Informations de debug pour l'event ID */}
          <div className="text-xs text-gray-500 bg-gray-100 rounded px-2 py-1 mt-2">
            Event ID: {currentEventId}
          </div>
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

          {/* Bouton de rafraîchissement */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
              className="text-purple-600 border-purple-200 hover:bg-purple-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Synchronisation...' : 'Actualiser'}
            </Button>
          </div>

          {/* État de chargement ou données */}
          {loading ? (
            <div className="text-center py-4">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-purple-600" />
              <p className="text-purple-600">Synchronisation avec l'Admin Portal...</p>
            </div>
          ) : !hasData ? (
            <div className="text-center py-4 bg-red-50 rounded-lg border border-red-200">
              <AlertCircle className="w-6 h-6 mx-auto mb-2 text-red-600" />
              <p className="text-red-700 font-medium">Aucun participant trouvé</p>
              <p className="text-red-600 text-sm">Ajoutez des participants dans l'Admin Portal</p>
            </div>
          ) : (
            <>
              {/* User Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {selectedUserType === 'person' ? 'Sélectionnez votre nom' : 'Sélectionnez votre prestataire'}
                </label>
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger className="border-purple-200 focus:border-purple-500 bg-white">
                    <SelectValue placeholder={`Choisir ${selectedUserType === 'person' ? 'une personne' : 'un prestataire'}...`} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg z-50 max-h-60 overflow-y-auto">
                    {currentList.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        Aucun {selectedUserType === 'person' ? 'membre' : 'prestataire'} trouvé
                      </div>
                    ) : (
                      currentList.map((user) => (
                        <SelectItem key={user.id} value={user.id} className="cursor-pointer hover:bg-purple-50">
                          <div className="flex flex-col w-full">
                            <span className="font-medium text-gray-900">{user.name}</span>
                            <span className="text-xs text-gray-500">
                              {selectedUserType === 'person' 
                                ? (user as any).role || 'Membre de l\'équipe'
                                : (user as any).service_type || 'Prestataire'
                              }
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Login Button */}
              <Button
                onClick={handleLogin}
                disabled={!selectedUserId}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Se connecter
              </Button>
            </>
          )}

          {/* Stats Preview - Simplifié */}
          <div className="grid grid-cols-2 gap-3 mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">{people.length}</div>
              <div className="text-xs text-gray-600">Membres</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-pink-600">{vendors.length}</div>
              <div className="text-xs text-gray-600">Prestataires</div>
            </div>
          </div>

          {/* Debug info (visible seulement en développement) */}
          {process.env.NODE_ENV === 'development' && (
            <details className="text-xs text-gray-500 bg-gray-100 rounded p-2">
              <summary className="cursor-pointer">Debug Info</summary>
              <div className="mt-2 space-y-1">
                <div>Event ID: {currentEventId}</div>
                <div>Total People: {people.length}</div>
                <div>Total Vendors: {vendors.length}</div>
                <div>People with event_id: {people.filter(p => p.event_id === currentEventId).length}</div>
                <div>Vendors with event_id: {vendors.filter(v => v.event_id === currentEventId).length}</div>
              </div>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
