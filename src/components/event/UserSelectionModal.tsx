
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLocalEventData } from '@/contexts/LocalEventDataContext';
import { LoggedUser } from '@/types/event';

interface UserSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (userId: string, userName: string, userType: 'person' | 'vendor') => void;
}

export const UserSelectionModal: React.FC<UserSelectionModalProps> = ({
  isOpen,
  onClose,
  onLogin
}) => {
  const { people, vendors } = useLocalEventData();
  const [selectedUser, setSelectedUser] = useState<LoggedUser | null>(null);

  const handleUserSelect = (id: string, name: string, type: 'person' | 'vendor') => {
    setSelectedUser({ id, name, type });
  };

  const handleLogin = () => {
    if (selectedUser) {
      onLogin(selectedUser.id, selectedUser.name, selectedUser.type);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Accès Jour-J</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {people.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Équipe</h3>
              <div className="space-y-2">
                {people.map((person) => (
                  <Card 
                    key={person.id}
                    className={`cursor-pointer transition-colors ${
                      selectedUser?.id === person.id ? 'ring-2 ring-purple-500' : ''
                    }`}
                    onClick={() => handleUserSelect(person.id, person.name, 'person')}
                  >
                    <CardContent className="p-3">
                      <div className="font-medium">{person.name}</div>
                      <div className="text-sm text-gray-600">{person.role}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {vendors.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Prestataires</h3>
              <div className="space-y-2">
                {vendors.map((vendor) => (
                  <Card 
                    key={vendor.id}
                    className={`cursor-pointer transition-colors ${
                      selectedUser?.id === vendor.id ? 'ring-2 ring-purple-500' : ''
                    }`}
                    onClick={() => handleUserSelect(vendor.id, vendor.name, 'vendor')}
                  >
                    <CardContent className="p-3">
                      <div className="font-medium">{vendor.name}</div>
                      <div className="text-sm text-gray-600">{vendor.service_type}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Annuler
            </Button>
            <Button 
              onClick={handleLogin} 
              disabled={!selectedUser}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
            >
              Se connecter
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
