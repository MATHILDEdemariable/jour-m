
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useSharedEventData } from '@/hooks/useSharedEventData';
import { useToggleTaskStatus } from '@/hooks/useTasks';

interface TaskListProps {
  viewMode: 'personal' | 'global';
  userRole: string;
}

const PRIORITY_CONFIG = {
  high: { color: 'bg-red-100 text-red-800', label: 'Haute' },
  medium: { color: 'bg-yellow-100 text-yellow-800', label: 'Moyenne' },
  low: { color: 'bg-green-100 text-green-800', label: 'Basse' }
};

const STATUS_CONFIG = {
  pending: { color: 'bg-gray-100 text-gray-800', label: 'En attente' },
  'in-progress': { color: 'bg-blue-100 text-blue-800', label: 'En cours' },
  completed: { color: 'bg-green-100 text-green-800', label: 'Terminé' },
  delayed: { color: 'bg-red-100 text-red-800', label: 'Retardé' }
};

export const TaskList: React.FC<TaskListProps> = ({ viewMode, userRole }) => {
  const { tasks, loading, people } = useSharedEventData();
  const toggleTaskStatus = useToggleTaskStatus();

  // Filtrer les tâches selon le mode de vue
  const filteredTasks = viewMode === 'personal' 
    ? tasks.filter(task => {
        // Filtrer par rôle assigné ou par personne assignée
        if (task.assigned_role === userRole) return true;
        if (task.assigned_person_id) {
          const assignedPerson = people.find(p => p.id === task.assigned_person_id);
          return assignedPerson?.role === userRole;
        }
        return false;
      })
    : tasks;

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    try {
      await toggleTaskStatus.mutateAsync({ id: taskId, completed });
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const completedCount = filteredTasks.filter(task => task.status === 'completed').length;
  const totalCount = filteredTasks.length;

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
          <p className="text-purple-600">Chargement des tâches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {viewMode === 'personal' ? 'Mes Tâches' : 'Toutes les Tâches'}
        </h2>
        <Badge variant="secondary" className="text-xs">
          {completedCount}/{totalCount} terminées
        </Badge>
      </div>

      {/* Progress Summary */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progression</span>
            <span className="text-sm text-gray-600">
              {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {filteredTasks.map((task) => {
          const priorityConfig = PRIORITY_CONFIG[task.priority as keyof typeof PRIORITY_CONFIG];
          const statusConfig = STATUS_CONFIG[task.status as keyof typeof STATUS_CONFIG];
          const isMyTask = viewMode === 'personal';
          const assignedPerson = task.assigned_person_id ? people.find(p => p.id === task.assigned_person_id) : null;
          
          return (
            <Card 
              key={task.id} 
              className={`transition-all hover:shadow-md ${task.status === 'completed' ? 'opacity-60' : ''} ${isMyTask ? 'border-l-4 border-l-purple-500' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={task.status === 'completed'}
                    onCheckedChange={(checked) => handleToggleTask(task.id, !!checked)}
                    className="mt-1"
                    disabled={toggleTaskStatus.isPending}
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                        {task.title}
                      </h3>
                      <Badge className={priorityConfig.color} variant="secondary">
                        {priorityConfig.label}
                      </Badge>
                      <Badge className={statusConfig.color} variant="secondary">
                        {statusConfig.label}
                      </Badge>
                    </div>
                    
                    {task.description && (
                      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">
                          Durée: {task.duration_minutes}min
                        </span>
                        {assignedPerson && (
                          <span className="text-gray-500">
                            Assigné à: {assignedPerson.name}
                          </span>
                        )}
                        {task.assigned_role && !assignedPerson && (
                          <span className="text-gray-500">
                            Rôle: {task.assigned_role.replace('-', ' ')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {filteredTasks.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Aucune tâche trouvée</p>
        </div>
      )}
    </div>
  );
};
