import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useCurrentTenant } from './useCurrentTenant';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'pending' | 'in-progress' | 'completed' | 'delayed';
  priority: 'high' | 'medium' | 'low';
  duration_minutes: number;
  category_id: string | null;
  assigned_person_id: string | null;
  assigned_vendor_id: string | null;
  assigned_role: string | null;
  event_id: string | null;
  order_index: number;
  notes: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  duration_minutes: number;
  category_id?: string;
  assigned_person_id?: string;
  assigned_vendor_id?: string;
  assigned_role?: string;
  event_id?: string;
  notes?: string;
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  status?: 'pending' | 'in-progress' | 'completed' | 'delayed';
}

export const useTasks = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('order_index');
      
      if (error) {
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les tâches',
          variant: 'destructive',
        });
        throw error;
      }
      
      return data as Task[];
    },
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: currentTenant } = useCurrentTenant();

  return useMutation({
    mutationFn: async (data: CreateTaskData) => {
      if (!currentTenant) {
        throw new Error('Tenant non identifié. Impossible de créer la tâche.');
      }
      const taskWithTenant = { ...data, tenant_id: currentTenant.id };

      const { data: result, error } = await supabase
        .from('tasks')
        .insert([taskWithTenant])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']) || [];

      // Créer une tâche optimiste avec id temporaire
      const optimisticTask: Task = {
        id: `optimistic-${Date.now()}`,
        title: newTask.title,
        description: newTask.description ?? null,
        status: 'pending',
        priority: newTask.priority,
        duration_minutes: newTask.duration_minutes,
        category_id: newTask.category_id ?? null,
        assigned_person_id: newTask.assigned_person_id ?? null,
        assigned_vendor_id: newTask.assigned_vendor_id ?? null,
        assigned_role: newTask.assigned_role ?? null,
        event_id: newTask.event_id ?? null,
        order_index: previousTasks.length,
        notes: newTask.notes ?? null,
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      queryClient.setQueryData<Task[]>(['tasks'], [optimisticTask, ...previousTasks]);
      return { previousTasks };
    },
    onSuccess: (savedTask, _newTask, context) => {
      // Remplacer la tâche optimiste par la vraie reçue de la BDD
      queryClient.setQueryData<Task[]>(['tasks'], (old) =>
        old
          ? [savedTask, ...old.filter((t) => !t.id.startsWith('optimistic-'))]
          : [savedTask]
      );
      toast({
        title: 'Succès',
        description: 'Tâche créée avec succès',
      });
    },
    onError: (_error, _variables, context) => {
      // En cas d’erreur, rollback à l’état précédent
      if (context?.previousTasks) {
        queryClient.setQueryData<Task[]>(['tasks'], context.previousTasks);
      }
      toast({
        title: 'Erreur',
        description: 'Impossible de créer la tâche',
        variant: 'destructive',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTaskData }) => {
      const { data: result, error } = await supabase
        .from('tasks')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: 'Succès',
        description: 'Tâche mise à jour avec succès',
      });
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour la tâche',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: 'Succès',
        description: 'Tâche supprimée avec succès',
      });
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la tâche',
        variant: 'destructive',
      });
    },
  });
};

export const useToggleTaskStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const status = completed ? 'completed' : 'pending';
      const { data: result, error } = await supabase
        .from('tasks')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le statut',
        variant: 'destructive',
      });
    },
  });
};
