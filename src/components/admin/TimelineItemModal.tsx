
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PersonMultiSelect } from './PersonMultiSelect';
import { VendorMultiSelect } from './VendorMultiSelect';
import { useLocalEventData } from '@/contexts/LocalEventDataContext';

interface TimelineItem {
  id: string;
  event_id: string | null;
  title: string;
  description: string | null;
  time: string;
  duration: number;
  category: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'delayed';
  priority: 'high' | 'medium' | 'low';
  assigned_person_ids: string[];
  assigned_vendor_id: string | null;
  assigned_role: string | null;
  order_index: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface TimelineItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<TimelineItem>) => Promise<void>;
  item?: TimelineItem | null;
}

export const TimelineItemModal: React.FC<TimelineItemModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  item
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    time: '08:00',
    duration: 60,
    category: 'Préparation',
    priority: 'medium' as 'high' | 'medium' | 'low',
    assigned_person_ids: [] as string[],
    assigned_vendor_id: null as string | null,
    assigned_role: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { vendors } = useLocalEventData();

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || '',
        description: item.description || '',
        time: item.time || '08:00',
        duration: item.duration || 60,
        category: item.category || 'Préparation',
        priority: item.priority || 'medium',
        assigned_person_ids: item.assigned_person_ids || [],
        assigned_vendor_id: item.assigned_vendor_id || null,
        assigned_role: item.assigned_role || '',
        notes: item.notes || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        time: '08:00',
        duration: 60,
        category: 'Préparation',
        priority: 'medium',
        assigned_person_ids: [],
        assigned_vendor_id: null,
        assigned_role: '',
        notes: ''
      });
    }
  }, [item, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting timeline item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-stone-800">
            {item ? 'Modifier l\'étape' : 'Ajouter une nouvelle étape'}
          </DialogTitle>
          <DialogDescription className="text-stone-600">
            Configurez les détails de cette étape du planning
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="title" className="text-stone-700">Titre *</Label>
              <Input 
                id="title"
                className="border-stone-300 focus:border-purple-500"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                placeholder="Nom de l'étape"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="time" className="text-stone-700">Heure de début</Label>
                <Input 
                  id="time"
                  type="time"
                  className="border-stone-300 focus:border-purple-500"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="duration" className="text-stone-700">Durée (minutes) *</Label>
                <Input 
                  id="duration"
                  type="number"
                  className="border-stone-300 focus:border-purple-500"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                  min="1"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-stone-700">Description</Label>
              <Textarea 
                id="description"
                className="border-stone-300 focus:border-purple-500"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description détaillée de l'étape"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category" className="text-stone-700">Catégorie *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="border-stone-300 focus:border-purple-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Préparation">Préparation</SelectItem>
                    <SelectItem value="Logistique">Logistique</SelectItem>
                    <SelectItem value="Cérémonie">Cérémonie</SelectItem>
                    <SelectItem value="Photos">Photos</SelectItem>
                    <SelectItem value="Réception">Réception</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority" className="text-stone-700">Priorité *</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as 'high' | 'medium' | 'low' }))}>
                  <SelectTrigger className="border-stone-300 focus:border-purple-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">🔴 Haute</SelectItem>
                    <SelectItem value="medium">🟡 Moyenne</SelectItem>
                    <SelectItem value="low">🟢 Basse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="assigned_role" className="text-stone-700">Rôle assigné</Label>
              <Select value={formData.assigned_role || 'none'} onValueChange={(value) => setFormData(prev => ({ ...prev, assigned_role: value === 'none' ? null : value }))}>
                <SelectTrigger className="border-stone-300 focus:border-purple-500">
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun rôle spécifique</SelectItem>
                  <SelectItem value="wedding-planner">Wedding Planner</SelectItem>
                  <SelectItem value="bride">Mariée</SelectItem>
                  <SelectItem value="groom">Marié</SelectItem>
                  <SelectItem value="maid-of-honor">Demoiselle d'honneur</SelectItem>
                  <SelectItem value="best-man">Témoin</SelectItem>
                  <SelectItem value="photographer">Photographe</SelectItem>
                  <SelectItem value="caterer">Traiteur</SelectItem>
                  <SelectItem value="florist">Fleuriste</SelectItem>
                  <SelectItem value="musician">Musicien</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <PersonMultiSelect
              selectedPersonIds={formData.assigned_person_ids}
              onSelectionChange={(personIds) => setFormData(prev => ({ ...prev, assigned_person_ids: personIds }))}
              label="Personnes assignées"
            />

            <div>
              <Label className="text-stone-700">Prestataire assigné</Label>
              <Select value={formData.assigned_vendor_id || 'none'} onValueChange={(value) => setFormData(prev => ({ ...prev, assigned_vendor_id: value === 'none' ? null : value }))}>
                <SelectTrigger className="border-stone-300 focus:border-purple-500">
                  <SelectValue placeholder="Sélectionner un prestataire" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun prestataire</SelectItem>
                  {vendors.filter(vendor => vendor.id && vendor.id.trim() !== '').map(vendor => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      {vendor.name} ({vendor.service_type || 'Service'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes" className="text-stone-700">Notes</Label>
              <Textarea 
                id="notes"
                className="border-stone-300 focus:border-purple-500"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Notes additionnelles"
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-stone-200">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose} 
              disabled={isSubmitting}
              className="border-stone-300 text-stone-700 hover:bg-stone-50"
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium px-6"
            >
              {isSubmitting ? 'Sauvegarde...' : item ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
