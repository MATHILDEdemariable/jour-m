
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PlanningItem {
  id: number;
  time: string;
  duration: number;
  title: string;
  description: string;
  category: string;
  assignedTo: string[];
}

interface PlanningItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<PlanningItem>) => void;
  item?: PlanningItem | null;
  isLoading?: boolean;
}

export const PlanningItemModal: React.FC<PlanningItemModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  item,
  isLoading = false
}) => {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<Partial<PlanningItem>>();

  const categoryValue = watch('category');

  useEffect(() => {
    if (item) {
      reset({
        title: item.title,
        description: item.description,
        duration: item.duration,
        time: item.time,
        category: item.category,
      });
    } else {
      reset({
        title: '',
        description: '',
        duration: 60,
        time: '09:00',
        category: 'Préparation',
      });
    }
  }, [item, reset]);

  const handleFormSubmit = (data: Partial<PlanningItem>) => {
    onSubmit(data);
    if (!item) {
      reset();
    }
  };

  const categories = [
    "Préparation",
    "Logistique", 
    "Cérémonie",
    "Photos",
    "Réception"
  ];

  const assignedToOptions = [
    "bride",
    "groom", 
    "wedding-planner",
    "photographer",
    "caterer",
    "maid-of-honor",
    "best-man",
    "florist",
    "musician"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-stone-800">
            {item ? 'Modifier l\'élément du planning' : 'Créer un nouvel élément'}
          </DialogTitle>
          <DialogDescription>
            {item ? 'Modifiez les détails de cet élément' : 'Définissez les détails du nouvel élément'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                {...register('title', { required: 'Le titre est requis' })}
                placeholder="Nom de l'activité"
                className="border-stone-300 focus:border-sage-500"
              />
              {errors.title && (
                <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Description détaillée de l'activité"
                className="border-stone-300 focus:border-sage-500"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="time">Heure de début *</Label>
                <Input
                  id="time"
                  type="time"
                  {...register('time', { required: 'L\'heure est requise' })}
                  className="border-stone-300 focus:border-sage-500"
                />
                {errors.time && (
                  <p className="text-red-600 text-sm mt-1">{errors.time.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="duration">Durée (minutes) *</Label>
                <Input
                  id="duration"
                  type="number"
                  {...register('duration', { 
                    required: 'La durée est requise',
                    min: { value: 1, message: 'La durée doit être d\'au moins 1 minute' }
                  })}
                  placeholder="60"
                  className="border-stone-300 focus:border-sage-500"
                />
                {errors.duration && (
                  <p className="text-red-600 text-sm mt-1">{errors.duration.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="category">Catégorie *</Label>
                <Select value={categoryValue} onValueChange={(value) => setValue('category', value)}>
                  <SelectTrigger className="border-stone-300 focus:border-sage-500">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="border-stone-300 text-stone-700 hover:bg-stone-50"
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-sage-600 hover:bg-sage-700 text-white"
            >
              {isLoading ? 'Sauvegarde...' : item ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
