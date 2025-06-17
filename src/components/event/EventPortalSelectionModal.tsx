
import React, { useState, useEffect } from 'react';
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
  
  // UTILISER EventStore comme source unique
  const { people, vendors, loadFromStorage } = useEventStore();
  
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedUserType, setSelectedUserType] = useState<'person' | 'vendor' | ''>('');

  // FORCER le rechargement des données à l'ouverture du modal
  useEffect(() => {
    if (open) {
      console.log('EventPortalSelectionModal - Modal opened, loading data...');
      loadFromStorage();
      
      // Debug immédiat
      setTimeout(() => {
        console.log('EventPortalSelectionModal - All people:', people);
        console.log('EventPortalSelectionModal - All vendors:', vendors);
      }, 100);
    }
  }, [open, loadFromStorage]);

  // RÉCUPÉRER l'événement actuel
  const currentEventId = localStorage.getItem('currentEventId') || 'default-event';
  console.log('EventPortalSelectionModal - Current event ID:', currentEventId);

  // FILTRER par événement actuel
  const filteredPeople = people.filter(person => {
    const match = person.event_id === currentEventId;
    console.log(`Person ${person.name} - event_id: ${person.event_id}, matches: ${match}`);
    return match;
  });
  
  const filteredVendors = vendors.filter(vendor => {
    const match = vendor.event_id === currentEventId;
    console.log(`Vendor ${vendor.name} - event_id: ${vendor.event_id}, matches: ${match}`);
    return match;
  });

  console.log('EventPortalSelectionModal - Filtered people:', filteredPeople.length);
  console.log('EventPortalSelectionModal - Filtered vendors:', filteredVendors.length);

  const handleContinue = () => {
    if (!selectedUserId || !selectedUserType) return;

    const url = `/event-portal?user_type=${selectedUserType}&user_id=${selectedUserId}&auto_login=true`;
    
    navigate(url);
    onOpenChange(false);
    
    // Reset state
    setSelectedUserId('');
    setSelectedUserType('');
  };

  const handleUserSelect = (value: string) => {
    setSelectedUserId(value);
    
    // Déterminer automatiquement le type d'utilisateur
    const isPerson = filteredPeople.some(p => p.id === value);
    const isVendor = filteredVendors.some(v => v.id === value);
    
    if (isPerson) {
      setSelectedUserType('person');
      console.log('Selected person:', value);
    } else if (isVendor) {
      setSelectedUserType('vendor');
      console.log('Selected vendor:', value);
    }
  };

  // COMBINER toutes les options
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

  console.log('EventPortalSelectionModal - All users for selection:', allUsers);

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
                    Aucune personne ou prestataire trouvé pour cet événement.
                    Veuillez d'abord ajouter des participants dans le portail admin.
                  </SelectItem>
                )}
              </SelectContent>
            </Select>

            <Button
              onClick={handleContinue}
              disabled={!selectedUserId || selectedUserId === 'no-users'}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Accéder à mon planning
            </Button>
          </div>
          
          {/* DEBUG INFO - À supprimer en production */}
          <div className="text-xs text-gray-400 space-y-1">
            <p>Debug: Event ID = {currentEventId}</p>
            <p>Debug: People = {filteredPeople.length}, Vendors = {filteredVendors.length}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
