
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Vendor } from '@/hooks/useVendors';

interface VendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Vendor>) => void;
  vendor?: Vendor | null;
}

type ContractStatus = 'quote' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export const VendorModal: React.FC<VendorModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  vendor
}) => {
  const [formData, setFormData] = useState({
    name: '',
    service_type: '',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    notes: '',
    contract_status: 'quote' as ContractStatus
  });

  useEffect(() => {
    if (vendor) {
      setFormData({
        name: vendor.name || '',
        service_type: vendor.service_type || '',
        contact_person: vendor.contact_person || '',
        email: vendor.email || '',
        phone: vendor.phone || '',
        address: vendor.address || '',
        website: vendor.website || '',
        notes: vendor.notes || '',
        contract_status: (vendor.contract_status as ContractStatus) || 'quote'
      });
    } else {
      setFormData({
        name: '',
        service_type: '',
        contact_person: '',
        email: '',
        phone: '',
        address: '',
        website: '',
        notes: '',
        contract_status: 'quote'
      });
    }
  }, [vendor, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{vendor ? 'Modifier le prestataire' : 'Nouveau prestataire'}</DialogTitle>
          <DialogDescription>
            {vendor ? 'Modifiez les informations du prestataire' : 'Ajoutez un nouveau prestataire à votre événement'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nom du prestataire *</Label>
              <Input 
                id="name" 
                placeholder="Nom de l'entreprise"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="service_type">Type de service</Label>
              <Select value={formData.service_type} onValueChange={(value) => setFormData(prev => ({ ...prev, service_type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="photographer">Photographe</SelectItem>
                  <SelectItem value="caterer">Traiteur</SelectItem>
                  <SelectItem value="venue">Lieu</SelectItem>
                  <SelectItem value="florist">Fleuriste</SelectItem>
                  <SelectItem value="musician">Musicien</SelectItem>
                  <SelectItem value="decorator">Décorateur</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contact_person">Personne de contact</Label>
              <Input 
                id="contact_person" 
                placeholder="Nom du contact"
                value={formData.contact_person}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_person: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="contract_status">Statut du contrat</Label>
              <Select value={formData.contract_status} onValueChange={(value: ContractStatus) => setFormData(prev => ({ ...prev, contract_status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quote">Devis</SelectItem>
                  <SelectItem value="confirmed">Confirmé</SelectItem>
                  <SelectItem value="in_progress">En cours</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                  <SelectItem value="cancelled">Annulé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input 
                id="phone" 
                placeholder="+33 1 23 45 67 89"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Adresse</Label>
            <Input 
              id="address" 
              placeholder="Adresse complète"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="website">Site web</Label>
            <Input 
              id="website" 
              placeholder="https://www.example.com"
              value={formData.website}
              onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes internes</Label>
            <Textarea 
              id="notes" 
              placeholder="Remarques, évaluations, informations importantes..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-600">
              {vendor ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
