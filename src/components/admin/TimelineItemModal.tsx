
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocalEventData } from '@/contexts/LocalEventDataContext';

interface TimelineItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  item?: any | null;
}

export const TimelineItemModal: React.FC<TimelineItemModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  item
}) => {
  const { people, vendors } = useLocalEventData();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 60,
    category: 'Préparation',
    priority: 'medium' as 'high' | 'medium' | 'low',
    status: 'scheduled' as 'scheduled' | 'in_progress' | 'completed' | 'delayed',
    time: '08:00',
    assigned_person_ids: [] as string[],
    assigned_vendor_id: '',
    assigned_role: '',
    notes: ''
  });

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || '',
        description: item.description || '',
        duration: item.duration || 60,
        category: item.category || 'Préparation',
        priority: item.priority || 'medium',
        status: item.status || 'scheduled',
        time: item.time || '08:00',
        assigned_person_ids: item.assigned_person_ids || [],
        assigned_vendor_id: item.assigned_vendor_id || '',
        assigned_role: item.assigned_role || '',
        notes: item.notes || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        duration: 60,
        category: 'Préparation',
        priority: 'medium',
        status: 'scheduled',
        time: '08:00',
        assigned_person_ids: [],
        assigned_vendor_id: '',
        assigned_role: '',
        notes: ''
      });
    }
  }, [item, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handlePersonToggle = (personId: string) => {
    setFormData(prev => ({
      ...prev,
      assigned_person_ids: prev.assigned_person_ids.includes(personId)
        ? prev.assigned_person_ids.filter(id => id !== personId)
        : [...prev.assigned_person_ids, personId]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {item ? 'Modifier l\'étape' : 'Ajouter une nouvelle étape'}
          </DialogTitle>
          <DialogDescription>
            {item ? 'Modifiez les détails de cette étape' : 'Créez une nouvelle étape pour votre planning'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Titre */}
          <div className="space-y-2">
            <Label htmlFor="title">Titre de l'étape *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ex: Accueil des invités"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Décrivez cette étape en détail..."
              rows={3}
            />
          </div>

          {/* Heure et Durée */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="time">Heure de début</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Durée (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
              />
            </div>
          </div>

          {/* Catégorie et Priorité */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Catégorie</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
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
            <div className="space-y-2">
              <Label>Priorité</Label>
              <Select value={formData.priority} onValueChange={(value: 'high' | 'medium' | 'low') => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
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

          {/* Statut */}
          <div className="space-y-2">
            <Label>Statut</Label>
            <Select value={formData.status} onValueChange={(value: 'scheduled' | 'in_progress' | 'completed' | 'delayed') => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">📅 Planifié</SelectItem>
                <SelectItem value="in_progress">🔄 En cours</SelectItem>
                <SelectItem value="completed">✅ Terminé</SelectItem>
                <SelectItem value="delayed">⚠️ Retardé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Assignation aux personnes */}
          {people.length > 0 && (
            <div className="space-y-2">
              <Label>Personnes assignées</Label>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {people.map((person) => (
                  <label
                    key={person.id}
                    className="flex items-center space-x-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={formData.assigned_person_ids.includes(person.id)}
                      onChange={() => handlePersonToggle(person.id)}
                      className="rounded"
                    />
                    <span className="text-sm">{person.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Assignation aux vendors */}
          {vendors.length > 0 && (
            <div className="space-y-2">
              <Label>Prestataire assigné</Label>
              <Select value={formData.assigned_vendor_id} onValueChange={(value) => setFormData(prev => ({ ...prev, assigned_vendor_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un prestataire..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Aucun prestataire</SelectItem>
                  {vendors.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Rôle assigné */}
          <div className="space-y-2">
            <Label htmlFor="assigned_role">Rôle assigné</Label>
            <Input
              id="assigned_role"
              value={formData.assigned_role}
              onChange={(e) => setFormData(prev => ({ ...prev, assigned_role: e.target.value }))}
              placeholder="Ex: Coordinateur, Assistant..."
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Notes additionnelles..."
              rows={2}
            />
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
              {item ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
