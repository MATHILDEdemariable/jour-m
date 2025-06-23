import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { PlanningItem } from '@/hooks/usePlanningItems';
import { usePeople } from '@/hooks/usePeople';

interface PlanningItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<PlanningItem>) => void;
  item?: PlanningItem | null;
  availablePeople: string[];
}

export const PlanningItemModal: React.FC<PlanningItemModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  item,
  availablePeople
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 60,
    category: 'Préparation',
    assignedTo: [] as string[],
    time: '08:00'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { people } = usePeople();

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        description: item.description,
        duration: item.duration,
        category: item.category,
        assignedTo: item.assignedTo || [],
        time: item.time || '08:00'
      });
    } else {
      setFormData({
        title: '',
        description: '',
        duration: 60,
        category: 'Préparation',
        assignedTo: [],
        time: '08:00'
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
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePersonAssignment = (personName: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      assignedTo: checked 
        ? [...prev.assignedTo, personName]
        : prev.assignedTo.filter(name => name !== personName)
    }));
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-stone-800">
            {item ? 'Modifier l\'étape' : 'Ajouter une nouvelle étape'}
          </DialogTitle>
          <DialogDescription className="text-stone-600">
            Configurez les détails de cette étape du planning
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right text-stone-700">Titre</Label>
            <Input 
              id="title"
              className="col-span-3 border-stone-300 focus:border-sage-500"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right text-stone-700">Heure de début</Label>
            <Input 
              id="time"
              type="time"
              className="col-span-3 border-stone-300 focus:border-sage-500"
              value={formData.time}
              onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right text-stone-700">Description</Label>
            <Textarea 
              id="description"
              className="col-span-3 border-stone-300 focus:border-sage-500"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="duration" className="text-right text-stone-700">Durée (min)</Label>
            <Input 
              id="duration"
              type="number"
              className="col-span-3 border-stone-300 focus:border-sage-500"
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
              min="1"
              required
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right text-stone-700">Catégorie</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger className="col-span-3 border-stone-300 focus:border-sage-500">
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

          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right mt-2 text-stone-700">Assigné à</Label>
            <div className="col-span-3 space-y-2 max-h-40 overflow-y-auto">
              {people.map((person) => (
                <div key={person.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`person-${person.id}`}
                    checked={formData.assignedTo.includes(person.name)}
                    onCheckedChange={(checked) => handlePersonAssignment(person.name, checked as boolean)}
                  />
                  <Label htmlFor={`person-${person.id}`} className="text-sm text-stone-600">
                    {person.name} ({person.role})
                  </Label>
                </div>
              ))}
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
              className="bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white font-medium px-6"
            >
              {isSubmitting ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
