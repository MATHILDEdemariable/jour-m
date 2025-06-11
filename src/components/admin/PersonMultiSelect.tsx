
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePeople } from '@/hooks/usePeople';
import { X } from 'lucide-react';

interface PersonMultiSelectProps {
  selectedPersonIds: string[];
  onSelectionChange: (personIds: string[]) => void;
  label?: string;
  maxDisplayNames?: number;
}

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

export const PersonMultiSelect: React.FC<PersonMultiSelectProps> = ({
  selectedPersonIds,
  onSelectionChange,
  label = "Personnes assignées",
  maxDisplayNames = 3
}) => {
  const { people } = usePeople();

  const handlePersonToggle = (personId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedPersonIds, personId]);
    } else {
      onSelectionChange(selectedPersonIds.filter(id => id !== personId));
    }
  };

  const handleSelectAll = () => {
    onSelectionChange(people.map(person => person.id));
  };

  const handleDeselectAll = () => {
    onSelectionChange([]);
  };

  const handleRemovePerson = (personId: string) => {
    onSelectionChange(selectedPersonIds.filter(id => id !== personId));
  };

  const selectedPeople = people.filter(person => selectedPersonIds.includes(person.id));

  const getDisplayText = () => {
    if (selectedPeople.length === 0) return "Aucune personne sélectionnée";
    if (selectedPeople.length <= maxDisplayNames) {
      return selectedPeople.map(person => person.name).join(", ");
    }
    const displayNames = selectedPeople.slice(0, maxDisplayNames).map(person => person.name).join(", ");
    const remaining = selectedPeople.length - maxDisplayNames;
    return `${displayNames} et ${remaining} autre${remaining > 1 ? 's' : ''}`;
  };

  return (
    <div className="space-y-3">
      <Label className="text-stone-700">{label}</Label>
      
      {/* Affichage des personnes sélectionnées */}
      {selectedPeople.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-stone-50 rounded-lg border">
          {selectedPeople.map(person => (
            <Badge 
              key={person.id} 
              variant="secondary" 
              className="flex items-center gap-1 bg-purple-100 text-purple-700 border-purple-200"
            >
              {person.name}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-purple-200"
                onClick={() => handleRemovePerson(person.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Résumé textuel */}
      <div className="text-sm text-stone-600 bg-stone-50 p-2 rounded border">
        {getDisplayText()}
      </div>

      {/* Boutons de sélection rapide */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSelectAll}
          className="text-xs border-stone-300 text-stone-600 hover:bg-stone-50"
        >
          Tout sélectionner
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleDeselectAll}
          className="text-xs border-stone-300 text-stone-600 hover:bg-stone-50"
        >
          Tout désélectionner
        </Button>
      </div>

      {/* Liste des personnes avec checkboxes */}
      <div className="max-h-48 overflow-y-auto border border-stone-200 rounded-lg bg-white">
        {people.length === 0 ? (
          <div className="p-4 text-center text-stone-500 text-sm">
            Aucune personne disponible
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {people.map(person => (
              <div key={person.id} className="flex items-center space-x-3 p-2 hover:bg-stone-50 rounded">
                <Checkbox
                  id={`person-${person.id}`}
                  checked={selectedPersonIds.includes(person.id)}
                  onCheckedChange={(checked) => handlePersonToggle(person.id, checked as boolean)}
                />
                <Label 
                  htmlFor={`person-${person.id}`} 
                  className="flex-1 text-sm cursor-pointer"
                >
                  <div className="font-medium text-stone-800">{person.name}</div>
                  {person.role && (
                    <div className="text-xs text-stone-500">
                      {roleLabels[person.role as keyof typeof roleLabels] || person.role}
                    </div>
                  )}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
