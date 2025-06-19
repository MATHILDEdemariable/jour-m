
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckSquare, Clock, AlertTriangle } from 'lucide-react';
import { useEventStore } from '@/stores/eventStore';
import { useLocalCurrentEvent } from '@/contexts/LocalCurrentEventContext';
import { useLocalToggleTaskStatus } from '@/hooks/useLocalTasks';

interface PersonalTasksListProps {
  personId: string;
  personName: string;
}

export const PersonalTasksList: React.FC<PersonalTasksListProps> = ({ 
  personId, 
  personName 
}) => {
  const { tasks, people, vendors, loadFromStorage } = useEventStore();
  const { currentEventId } = useLocalCurrentEvent();
  const toggleTaskStatus = useLocalToggleTaskStatus();

  // FORCER la synchronisation des données à chaque rendu
  useEffect(() => {
    console.log('PersonalTasksList - Loading data for person:', personName);
    loadFromStorage();
  }, [loadFromStorage, personName]);

  // Filtrer les tâches par événement actuel
  const eventTasks = tasks.filter(task => {
    const match = task.event_id === currentEventId;
    console.log(`Task ${task.title} - event_id: ${task.event_id}, current: ${currentEventId}, matches: ${match}`);
    return match;
  });
  
  const isPerson = people.some(p => p.id === personId);

  // Filtrer les tâches assignées à cette personne ou ce prestataire
  const personalTasks = eventTasks.filter(task => {
    if (isPerson) {
      // FIX: Use array-based assignment
      const match = task.assigned_person_ids.includes(personId);
      console.log(`Task ${task.title} - assigned_person_ids: ${task.assigned_person_ids}, personId: ${personId}, matches: ${match}`);
      return match;
    } else {
      // Si ce n'est pas une personne, on suppose que c'est un prestataire
      // FIX: Use array-based assignment
      const match = task.assigned_vendor_ids.includes(personId);
      console.log(`Task ${task.title} - assigned_vendor_ids: ${task.assigned_vendor_ids}, vendorId: ${personId}, matches: ${match}`);
      return match;
    }
  });

  console.log('PersonalTasksList - Debug info:', {
    personId,
    personName,
    currentEventId,
    totalTasks: tasks.length,
    eventTasks: eventTasks.length,
    personalTasks: personalTasks.length,
    isPerson
  });

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    try {
      console.log('PersonalTasksList - Toggling task:', taskId, completed);
      await toggleTaskStatus.mutateAsync({ id: taskId, completed });
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'high': return { color: 'bg-red-100 text-red-800', label: 'Haute', icon: '🔴' };
      case 'medium': return { color: 'bg-yellow-100 text-yellow-800', label: 'Moyenne', icon: '🟡' };
      case 'low': return { color: 'bg-green-100 text-green-800', label: 'Basse', icon: '🟢' };
      default: return { color: 'bg-gray-100 text-gray-800', label: 'Normale', icon: '⚪' };
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending': return { color: 'bg-gray-100 text-gray-800', label: 'En attente' };
      case 'in_progress': return { color: 'bg-blue-100 text-blue-800', label: 'En cours' };
      case 'completed': return { color: 'bg-green-100 text-green-800', label: 'Terminé' };
      case 'delayed': return { color: 'bg-red-100 text-red-800', label: 'Retardé' };
      default: return { color: 'bg-gray-100 text-gray-800', label: status };
    }
  };

  const completedCount = personalTasks.filter(task => task.status === 'completed').length;
  const totalCount = personalTasks.length;
  const urgentTasks = personalTasks.filter(task => task.priority === 'high' && task.status !== 'completed').length;

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
              <CheckSquare className="w-5 h-5 text-purple-500" />
              Mes Tâches
            </CardTitle>
            <p className="text-sm text-gray-600">Tâches qui vous sont assignées</p>
          </div>
          <div className="flex items-center gap-2">
            {urgentTasks > 0 && (
              <Badge variant="destructive" className="text-xs">
                <AlertTriangle className="w-3 h-3 mr-1" />
                {urgentTasks} urgente{urgentTasks > 1 ? 's' : ''}
              </Badge>
            )}
            <Badge variant="outline" className="border-purple-200 text-purple-700">
              {completedCount}/{totalCount} terminées
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* DEBUG INFO - Visible pour diagnostic */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <h5 className="font-medium text-blue-900 text-sm mb-1">Debug - Synchronisation Tâches</h5>
          <div className="text-xs text-blue-800 space-y-1">
            <p>Event ID: {currentEventId}</p>
            <p>Person ID: {personId} ({isPerson ? 'Person' : 'Vendor'})</p>
            <p>Total tasks: {tasks.length}, Event tasks: {eventTasks.length}, Personal: {personalTasks.length}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
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
        </div>

        {personalTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CheckSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Aucune tâche ne vous est assignée pour le moment</p>
            <p className="text-xs text-gray-400 mt-2">
              Vérifiez que vous êtes bien connecté à l'événement: {currentEventId}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {personalTasks.map((task) => {
              const priorityConfig = getPriorityConfig(task.priority);
              const statusConfig = getStatusConfig(task.status);
              
              return (
                <div 
                  key={task.id} 
                  className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                    task.status === 'completed' 
                      ? 'bg-green-50 border-green-200 opacity-75' 
                      : task.priority === 'high' 
                        ? 'bg-red-50 border-red-200' 
                        : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={task.status === 'completed'}
                      onCheckedChange={(checked) => handleToggleTask(task.id, !!checked)}
                      className="mt-1"
                      disabled={toggleTaskStatus.isPending}
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-medium ${
                          task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
                        }`}>
                          {task.title}
                        </h3>
                        <Badge className={`${priorityConfig.color} text-xs`}>
                          {priorityConfig.icon} {priorityConfig.label}
                        </Badge>
                        <Badge className={`${statusConfig.color} text-xs`}>
                          {statusConfig.label}
                        </Badge>
                      </div>
                      
                      {task.description && (
                        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                      )}
                      
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {task.duration_minutes}min
                          </div>
                          <span>Assigné à: {personName}</span>
                        </div>
                        
                        {task.completed_at && (
                          <span className="text-green-600">
                            Terminé le {new Date(task.completed_at).toLocaleDateString('fr-FR')}
                          </span>
                        )}
                      </div>

                      {task.notes && (
                        <div className="mt-2 p-2 bg-white rounded text-xs text-gray-600">
                          <strong>Note:</strong> {task.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
