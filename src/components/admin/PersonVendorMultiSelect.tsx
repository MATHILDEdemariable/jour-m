
import React from 'react';
import { useLocalEventData } from '@/contexts/LocalEventDataContext';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface PersonVendorMultiSelectProps {
  selectedPersonIds: string[];
  selectedVendorIds: string[];
  onPersonSelectionChange: (personIds: string[]) => void;
  onVendorSelectionChange: (vendorIds: string[]) => void;
  label?: string;
  showPeople?: boolean;
  showVendors?: boolean;
}

export const PersonVendorMultiSelect: React.FC<PersonVendorMultiSelectProps> = ({
  selectedPersonIds,
  selectedVendorIds,
  onPersonSelectionChange,
  onVendorSelectionChange,
  label = "Assignations",
  showPeople = true,
  showVendors = true
}) => {
  const { people, vendors, loading } = useLocalEventData();

  if (loading) {
    return <div className="text-gray-500 text-sm">Chargement...</div>;
  }

  return (
    <div>
      <Label className="mb-2 block">{label}</Label>
      <div className="space-y-3 max-h-40 overflow-y-auto border rounded-md p-3">
        
        {showPeople && (
          <div>
            <Label className="text-sm font-medium text-purple-700 mb-2 block">👥 Équipe</Label>
            <div className="space-y-2">
              {people.length === 0 && (
                <div className="text-gray-500 text-sm">Aucune personne</div>
              )}
              {people.map((person) => (
                <div key={person.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`person-${person.id}`}
                    checked={selectedPersonIds.includes(person.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onPersonSelectionChange([...selectedPersonIds, person.id]);
                      } else {
                        onPersonSelectionChange(selectedPersonIds.filter(id => id !== person.id));
                      }
                    }}
                  />
                  <Label htmlFor={`person-${person.id}`} className="text-sm text-stone-600">
                    {person.name} ({person.role || "équipe"})
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {showPeople && showVendors && people.length > 0 && vendors.length > 0 && (
          <Separator />
        )}

        {showVendors && (
          <div>
            <Label className="text-sm font-medium text-blue-700 mb-2 block">🏢 Prestataires</Label>
            <div className="space-y-2">
              {vendors.length === 0 && (
                <div className="text-gray-500 text-sm">Aucun prestataire</div>
              )}
              {vendors.map((vendor) => (
                <div key={vendor.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`vendor-${vendor.id}`}
                    checked={selectedVendorIds.includes(vendor.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onVendorSelectionChange([...selectedVendorIds, vendor.id]);
                      } else {
                        onVendorSelectionChange(selectedVendorIds.filter(id => id !== vendor.id));
                      }
                    }}
                  />
                  <Label htmlFor={`vendor-${vendor.id}`} className="text-sm text-stone-600">
                    {vendor.name} ({vendor.service_type || "service"})
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
