
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { usePeople } from '@/hooks/usePeople';

interface DocumentAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (assignedTo: string[]) => void;
  currentAssignment: string[];
  documentName: string;
}

const ROLE_LABELS = {
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

export const DocumentAssignmentModal: React.FC<DocumentAssignmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentAssignment,
  documentName
}) => {
  const { people } = usePeople();
  const [selectedPeople, setSelectedPeople] = useState<string[]>(currentAssignment);

  useEffect(() => {
    setSelectedPeople(currentAssignment);
  }, [currentAssignment]);

  const handlePersonToggle = (personId: string) => {
    setSelectedPeople(prev => 
      prev.includes(personId) 
        ? prev.filter(id => id !== personId)
        : [...prev, personId]
    );
  };

  const handleSave = () => {
    onSave(selectedPeople);
    onClose();
  };

  const getPersonName = (personId: string) => {
    const person = people.find(p => p.id === personId);
    return person ? person.name : 'Personne inconnue';
  };

  const getPersonRole = (personId: string) => {
    const person = people.find(p => p.id === personId);
    if (!person?.role) return '';
    return ROLE_LABELS[person.role as keyof typeof ROLE_LABELS] || person.role;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assigner le document</DialogTitle>
          <p className="text-sm text-gray-600">"{documentName}"</p>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Personnes disponibles</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {people.map((person) => (
                <div key={person.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={person.id}
                    checked={selectedPeople.includes(person.id)}
                    onCheckedChange={() => handlePersonToggle(person.id)}
                  />
                  <label htmlFor={person.id} className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{person.name}</span>
                      {person.role && (
                        <Badge variant="outline" className="text-xs">
                          {getPersonRole(person.id)}
                        </Badge>
                      )}
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {selectedPeople.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Assigné à :</h4>
              <div className="flex flex-wrap gap-1">
                {selectedPeople.map(personId => (
                  <Badge key={personId} variant="secondary" className="text-xs">
                    {getPersonName(personId)}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
            Sauvegarder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
