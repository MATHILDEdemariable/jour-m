
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Person } from '@/hooks/usePeople';

interface PersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Person>) => Promise<void>;
  person?: Person | null;
}

export const PersonModal: React.FC<PersonModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  person
}) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    confirmation_status: 'pending',
    availability_notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (person) {
      setFormData({
        name: person.name || '',
        role: person.role || '',
        email: person.email || '',
        phone: person.phone || '',
        confirmation_status: person.confirmation_status || 'pending',
        availability_notes: person.availability_notes || ''
      });
    } else {
      setFormData({
        name: '',
        role: '',
        email: '',
        phone: '',
        confirmation_status: 'pending',
        availability_notes: ''
      });
    }
  }, [person, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{person ? 'Modifier la personne' : 'Ajouter une nouvelle personne'}</DialogTitle>
          <DialogDescription>
            Ajoutez un intervenant à votre événement
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Nom</Label>
            <Input 
              id="name" 
              className="col-span-3" 
              placeholder="Nom complet"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">Rôle</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bride">Mariée</SelectItem>
                <SelectItem value="groom">Marié</SelectItem>
                <SelectItem value="best-man">Témoin</SelectItem>
                <SelectItem value="maid-of-honor">Demoiselle d'honneur</SelectItem>
                <SelectItem value="wedding-planner">Wedding Planner</SelectItem>
                <SelectItem value="photographer">Photographe</SelectItem>
                <SelectItem value="caterer">Traiteur</SelectItem>
                <SelectItem value="guest">Invité</SelectItem>
                <SelectItem value="family">Famille</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">Email</Label>
            <Input 
              id="email" 
              type="email" 
              className="col-span-3" 
              placeholder="email@example.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">Téléphone</Label>
            <Input 
              id="phone" 
              className="col-span-3" 
              placeholder="+33 6 12 34 56 78"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="confirmation_status" className="text-right">Statut</Label>
            <Select value={formData.confirmation_status} onValueChange={(value) => setFormData(prev => ({ ...prev, confirmation_status: value }))}>
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="confirmed">Confirmé</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="declined">Décliné</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="availability_notes" className="text-right">Notes de disponibilité</Label>
            <Input 
              id="availability_notes" 
              className="col-span-3" 
              placeholder="Notes sur la disponibilité"
              value={formData.availability_notes}
              onChange={(e) => setFormData(prev => ({ ...prev, availability_notes: e.target.value }))}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-600" disabled={isSubmitting}>
              {isSubmitting ? 'Sauvegarde...' : (person ? 'Modifier' : 'Ajouter')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
