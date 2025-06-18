
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocalVendors } from '@/hooks/useLocalVendors';
import type { Task } from '@/stores/eventStore';

interface CreateTaskData {
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  assigned_person_id?: string;
  assigned_vendor_id?: string;
  duration_minutes: number;
  due_date: string;
  notes?: string;
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskData) => void;
  task?: Task | null;
  isLoading?: boolean;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  task,
  isLoading = false
}) => {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CreateTaskData>();
  const assignedVendorId = watch('assigned_vendor_id') || 'none';
  const { vendors, loading: vendorsLoading } = useLocalVendors();

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        duration_minutes: task.duration_minutes || 30,
        notes: task.notes || '',
        assigned_vendor_id: task.assigned_vendor_id || 'none',
        due_date: task.due_date || new Date().toISOString().split('T')[0],
      });
    } else {
      reset({
        title: '',
        description: '',
        priority: 'medium',
        duration_minutes: 30,
        notes: '',
        assigned_vendor_id: 'none',
        due_date: new Date().toISOString().split('T')[0],
      });
    }
  }, [task, reset]);

  const handleFormSubmit = (data: CreateTaskData) => {
    // If "none" is selected, set assigned_vendor_id to null or ''
    const submitData = {
      ...data,
      assigned_vendor_id:
        data.assigned_vendor_id === 'none' ? null : data.assigned_vendor_id,
    };
    onSubmit(submitData);
    if (!task) {
      reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-emerald-800">
            {task ? 'Modifier la tâche' : 'Créer une nouvelle tâche'}
          </DialogTitle>
          <DialogDescription>
            {task ? 'Modifiez les détails de la tâche' : 'Définissez les détails de la nouvelle tâche'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                {...register('title', { required: 'Le titre est requis' })}
                placeholder="Nom de la tâche"
                className="border-stone-300 focus:border-emerald-500"
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
                placeholder="Description détaillée de la tâche"
                className="border-stone-300 focus:border-emerald-500"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration_minutes">Durée (minutes) *</Label>
                <Input
                  id="duration_minutes"
                  type="number"
                  {...register('duration_minutes', { 
                    required: 'La durée est requise',
                    min: { value: 1, message: 'La durée doit être d\'au moins 1 minute' }
                  })}
                  placeholder="30"
                  className="border-stone-300 focus:border-emerald-500"
                />
                {errors.duration_minutes && (
                  <p className="text-red-600 text-sm mt-1">{errors.duration_minutes.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="priority">Priorité *</Label>
                <Select value={watch('priority')} onValueChange={(value) => setValue('priority', value as 'high' | 'medium' | 'low')}>
                  <SelectTrigger className="border-stone-300 focus:border-emerald-500">
                    <SelectValue placeholder="Sélectionner une priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">🔴 Haute</SelectItem>
                    <SelectItem value="medium">🟡 Moyenne</SelectItem>
                    <SelectItem value="low">🟢 Basse</SelectItem>
                  </SelectContent>
                </Select>
                {errors.priority && (
                  <p className="text-red-600 text-sm mt-1">{errors.priority.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="due_date">Date d'échéance</Label>
              <Input
                id="due_date"
                type="date"
                {...register('due_date')}
                className="border-stone-300 focus:border-emerald-500"
              />
            </div>
            
            {/* Vendor Selector */}
            <div>
              <Label htmlFor="assigned_vendor_id">Prestataire assigné</Label>
              <Select
                value={assignedVendorId}
                onValueChange={value => setValue('assigned_vendor_id', value)}
              >
                <SelectTrigger className="border-stone-300 focus:border-emerald-500">
                  <SelectValue placeholder="Aucun prestataire" />
                </SelectTrigger>
                <SelectContent>
                  {vendorsLoading && (
                    <SelectItem value="none" disabled>Chargement...</SelectItem>
                  )}
                  <SelectItem value="none">Aucun</SelectItem>
                  {vendors.map(vendor => (
                    <SelectItem value={vendor.id} key={vendor.id}>
                      {vendor.name} ({vendor.service_type || "service"})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                {...register('notes')}
                placeholder="Notes additionnelles"
                className="border-stone-300 focus:border-emerald-500"
                rows={2}
              />
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
              className="bg-emerald-700 hover:bg-emerald-800 text-white"
            >
              {isLoading ? 'Sauvegarde...' : task ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
