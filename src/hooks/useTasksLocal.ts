
// Hook unifié pour remplacer useTasks, useCreateTask, useUpdateTask, useDeleteTask
export { 
  useLocalTasks as useTasks,
  useLocalCreateTask as useCreateTask,
  useLocalUpdateTask as useUpdateTask,
  useLocalDeleteTask as useDeleteTask,
  useLocalToggleTaskStatus as useToggleTaskStatus
} from './useLocalTasks';
