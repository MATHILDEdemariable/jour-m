
import { useEventStore } from '@/stores/eventStore';
import type { Task } from '@/stores/eventStore';

// Hook qui remplace useTasks en gardant exactement la même interface
export const useLocalTasks = () => {
  const {
    tasks,
    currentEventId,
    addTask: addTaskToStore,
    updateTask: updateTaskInStore,
    deleteTask: deleteTaskFromStore,
    loading
  } = useEventStore();

  console.log('useLocalTasks - Current event ID:', currentEventId);
  console.log('useLocalTasks - All tasks:', tasks.length);
  console.log('useLocalTasks - Filtered tasks:', tasks.filter(t => t.event_id === currentEventId).length);

  return {
    data: tasks.filter(task => task.event_id === currentEventId),
    isLoading: loading,
    refetch: async () => {
      console.log('useLocalTasks - Tasks refetched from localStorage');
      return { data: tasks.filter(task => task.event_id === currentEventId) };
    }
  };
};

// Hook pour créer une tâche
export const useLocalCreateTask = () => {
  const { addTask } = useEventStore();
  const { currentEventId } = useEventStore();

  const generateId = () => `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  return {
    mutate: async (data: any) => {
      const task: Task = {
        ...data,
        id: generateId(),
        event_id: currentEventId || data.event_id,
        status: data.status || 'pending',
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      addTask(task);
      console.log('useLocalCreateTask - Task created:', task);
    },
    mutateAsync: async (data: any) => {
      const task: Task = {
        ...data,
        id: generateId(),
        event_id: currentEventId || data.event_id,
        status: data.status || 'pending',
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      addTask(task);
      console.log('useLocalCreateTask - Task created async:', task);
      return task;
    },
    isPending: false,
    isError: false,
    error: null
  };
};

// Hook pour mettre à jour une tâche
export const useLocalUpdateTask = () => {
  const { updateTask } = useEventStore();

  return {
    mutate: async ({ id, data }: { id: string; data: Partial<Task> }) => {
      const updatedData = {
        ...data,
        updated_at: new Date().toISOString()
      };
      updateTask(id, updatedData);
      console.log('useLocalUpdateTask - Task updated:', id, updatedData);
    },
    mutateAsync: async ({ id, data }: { id: string; data: Partial<Task> }) => {
      const updatedData = {
        ...data,
        updated_at: new Date().toISOString()
      };
      updateTask(id, updatedData);
      console.log('useLocalUpdateTask - Task updated async:', id, updatedData);
      return updatedData;
    },
    isPending: false,
    isError: false,
    error: null
  };
};

// Hook pour supprimer une tâche
export const useLocalDeleteTask = () => {
  const { deleteTask } = useEventStore();

  return {
    mutate: async (id: string) => {
      deleteTask(id);
      console.log('useLocalDeleteTask - Task deleted:', id);
    },
    mutateAsync: async (id: string) => {
      deleteTask(id);
      console.log('useLocalDeleteTask - Task deleted async:', id);
    },
    isPending: false,
    isError: false,
    error: null
  };
};

// Hook pour basculer le statut d'une tâche
export const useLocalToggleTaskStatus = () => {
  const { updateTask } = useEventStore();

  return {
    mutate: async ({ id, completed }: { id: string; completed: boolean }) => {
      const status: Task['status'] = completed ? 'completed' : 'pending';
      const updatedData = {
        status,
        completed_at: completed ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      };
      updateTask(id, updatedData);
      console.log('useLocalToggleTaskStatus - Task status toggled:', id, status);
    },
    isPending: false,
    isError: false,
    error: null
  };
};
