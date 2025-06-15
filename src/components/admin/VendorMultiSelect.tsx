
import React from 'react';
import { useVendors } from '@/hooks/useVendors';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface VendorMultiSelectProps {
  selectedVendorIds: string[];
  onSelectionChange: (vendorIds: string[]) => void;
  label?: string;
}

export const VendorMultiSelect: React.FC<VendorMultiSelectProps> = ({
  selectedVendorIds,
  onSelectionChange,
  label = "Prestataires"
}) => {
  const { vendors, loading } = useVendors();

  if (loading) {
    return <div className="text-gray-500 text-sm">Chargement des prestataires...</div>;
  }

  return (
    <div>
      <Label className="mb-1 block">{label}</Label>
      <div className="space-y-2 max-h-40 overflow-y-auto">
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
                  onSelectionChange([...selectedVendorIds, vendor.id]);
                } else {
                  onSelectionChange(selectedVendorIds.filter(id => id !== vendor.id));
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
  );
};
