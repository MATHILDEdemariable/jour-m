
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Building2, ArrowRight } from 'lucide-react';
import { useLocalCurrentEvent } from '@/contexts/LocalCurrentEventContext';
import { useEventStore } from '@/stores/eventStore';

interface EventPortalSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EventPortalSelectionModal: React.FC<EventPortalSelectionModalProps> = ({
  open,
  onOpenChange
}) => {
  const navigate = useNavigate();
  const { currentEventId } = useLocalCurrentEvent();
  
  // CHANGEMENT: Utiliser EventStore comme source unique de données
  const { people, vendors } = useEventStore();
  
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedUserType, setSelectedUserType] = useState<'person' | 'vendor' | ''>('');

  // Filtrer par événement actuel
  const filteredPeople = people.filter(person => person.event_id === currentEventId);
  const filteredVendors = vendors.filter(vendor => vendor.event_id === currentEventId);

  // Debug pour vérifier les données
  console.log('EventPortalSelectionModal - Current event:', currentEventId);
  console.log('EventPortalSelectionModal - All people:', people.length);
  console.log('EventPortalSelectionModal - Filtered people:', filteredPeople.length, filteredPeople);
  console.log('EventPortalSelectionModal - All vendors:', vendors.length);
  console.log('EventPortalSelectionModal - Filtered vendors:', filteredVendors.length, filteredVendors);

  const handleContinue = () => {
    if (!selectedUserId || !selectedUserType || !currentEventId) return;

    const url = `/event-portal?user_type=${selectedUserType}&user_id=${selectedUserId}&auto_login=true`;
    
    navigate(url);
    onOpenChange(false);
    
    // Reset state
    setSelectedUserId('');
    setSelectedUserType('');
  };

  const handleUserSelect = (value: string) => {
    setSelectedUserId(value);
    
    // Déterminer automatiquement le type d'utilisateur basé sur l'ID
    const isPerson = filteredPeople.some(p => p.id === value);
    const isVendor = filteredVendors.some(v => v.id === value);
    
    if (isPerson) {
      setSelectedUserType('person');
    } else if (isVendor) {
      setSelectedUserType('vendor');
    }
  };

  // Combiner toutes les options dans une seule liste
  const allUsers = [
    ...filteredPeople.map(person => ({
      id: person.id,
      name: person.name,
      type: 'person' as const,
      subtitle: person.role || 'Membre de l\'équipe',
      icon: Users
    })),
    ...filteredVendors.map(vendor => ({
      id: vendor.id,
      name: vendor.name,
      type: 'vendor' as const,
      subtitle: vendor.service_type || 'Prestataire',
      icon: Building2
    }))
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Accès Jour-J
          </DialogTitle>
          <DialogDescription>
            Sélectionnez votre profil pour accéder directement à votre planning personnalisé du jour J
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Qui êtes-vous ?</h3>

            <Select value={selectedUserId} onValueChange={handleUserSelect}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionnez votre profil..." />
              </SelectTrigger>
              <SelectContent>
                {allUsers.length > 0 ? (
                  allUsers.map((user) => {
                    const IconComponent = user.icon;
                    return (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center gap-3">
                          <div className={`p-1 rounded ${user.type === 'person' ? 'bg-purple-100' : 'bg-blue-100'}`}>
                            <IconComponent className={`w-4 h-4 ${user.type === 'person' ? 'text-purple-600' : 'text-blue-600'}`} />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium">{user.name}</span>
                            <span className="text-xs text-gray-500">{user.subtitle}</span>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })
                ) : (
                  <SelectItem value="no-users" disabled>
                    Aucun utilisateur disponible pour cet événement
                  </SelectItem>
                )}
              </SelectContent>
            </Select>

            {allUsers.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                <p className="text-sm">Aucune personne ou prestataire trouvé pour cet événement.</p>
                <p className="text-xs mt-1">Veuillez d'abord ajouter des participants dans le portail admin.</p>
              </div>
            )}

            <Button
              onClick={handleContinue}
              disabled={!selectedUserId || selectedUserId === 'no-users'}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Accéder à mon planning
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
