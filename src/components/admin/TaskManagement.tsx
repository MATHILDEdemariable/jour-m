import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Clock, Users, Search, Filter, Building } from 'lucide-react';
import { useLocalTasks, useLocalCreateTask, useLocalUpdateTask, useLocalDeleteTask, useLocalToggleTaskStatus } from '@/hooks/useLocalTasks';
import { TaskModal } from './TaskModal';
import { TaskSuggestions } from './TaskSuggestions';
import { useLocalVendors } from '@/hooks/useLocalVendors';
import { useLocalCurrentEvent } from '@/contexts/LocalCurrentEventContext';
import type { Task } from '@/stores/eventStore';

interface CreateTaskData {
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  assigned_person_id?: string;
  assigned_vendor_id?: string;
  assigned_role?: string;
  duration_minutes: number;
  due_date: string;
  notes?: string;
}

export const TaskManagement = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // CORRECTION: Utiliser les hooks locaux avec event_id
  const { data: tasks = [], isLoading } = useLocalTasks();
  const { vendors } = useLocalVendors();
  const { currentEventId } = useLocalCurrentEvent();
  const createTaskMutation = useLocalCreateTask();
  const updateTaskMutation = useLocalUpdateTask();
  const deleteTaskMutation = useLocalDeleteTask();
  const toggleStatusMutation = useLocalToggleTaskStatus();

  // DEBUG: Log pour vérifier la synchronisation
  console.log('TaskManagement - Current event ID:', currentEventId);
  console.log('TaskManagement - Tasks count:', tasks.length);
  console.log('TaskManagement - Vendors count:', vendors.length);

  const handleCreateTask = (data: CreateTaskData) => {
    // S'assurer que l'event_id est inclus
    const taskData = {
      ...data,
      event_id: currentEventId
    };
    
    console.log('TaskManagement - Creating task with event_id:', currentEventId, taskData);
    
    createTaskMutation.mutate(taskData, {
      onSuccess: () => {
        setIsCreateModalOpen(false);
        console.log('TaskManagement - Task created successfully');
      }
    });
  };

  const handleUpdateTask = (data: CreateTaskData) => {
    if (!editingTask) return;
    
    console.log('TaskManagement - Updating task:', editingTask.id, data);
    
    updateTaskMutation.mutate(
      { id: editingTask.id, data },
      {
        onSuccess: () => {
          setIsEditModalOpen(false);
          setEditingTask(null);
          console.log('TaskManagement - Task updated successfully');
        }
      }
    );
  };

  const handleEditTask = (task: Task) => {
    console.log('TaskManagement - Editing task:', task.id);
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    console.log('TaskManagement - Deleting task:', taskId);
    deleteTaskMutation.mutate(taskId);
  };

  const handleToggleStatus = (taskId: string, completed: boolean) => {
    console.log('TaskManagement - Toggling task status:', taskId, completed);
    toggleStatusMutation.mutate({ id: taskId, completed });
  };

  const handleAddSuggestion = (taskData: CreateTaskData) => {
    const taskDataWithEvent = {
      ...taskData,
      event_id: currentEventId
    };
    console.log('TaskManagement - Adding suggested task:', taskDataWithEvent);
    createTaskMutation.mutate(taskDataWithEvent);
  };

  // Filtrage des tâches
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const priorityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-amber-100 text-amber-800',
    low: 'bg-emerald-100 text-emerald-800'
  };

  const statusColors = {
    completed: 'bg-emerald-100 text-emerald-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    pending: 'bg-stone-100 text-stone-800',
    delayed: 'bg-red-100 text-red-800'
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴 Haute';
      case 'medium': return '🟡 Moyenne';
      case 'low': return '🟢 Basse';
      default: return priority;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return '✅ Terminée';
      case 'in-progress': return '🔄 En cours';
      case 'pending': return '⏳ En attente';
      case 'delayed': return '⚠️ Retardée';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="text-stone-600 mt-2">Chargement des tâches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* DEBUG INFO - Visible pour vérifier la synchronisation */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">Debug - Synchronisation</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p>Event ID actuel: {currentEventId}</p>
          <p>Nombre de tâches: {tasks.length}</p>
          <p>Nombre de prestataires: {vendors.length}</p>
          <p>Tâches filtrées: {filteredTasks.length}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-stone-900">Gestion des Tâches</h2>
          <p className="text-stone-600">Créez et organisez toutes les tâches de votre événement</p>
        </div>
        <div className="flex gap-2">
          <TaskSuggestions onAddTask={handleAddSuggestion} />
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Tâche
          </Button>
        </div>
      </div>

      {/* Filtres et recherche */}
      <Card className="bg-stone-50 border-stone-200">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher une tâche..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 border-stone-300 focus:border-emerald-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 border-stone-300">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="in-progress">En cours</SelectItem>
                  <SelectItem value="completed">Terminées</SelectItem>
                  <SelectItem value="delayed">Retardées</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-40 border-stone-300">
                  <SelectValue placeholder="Priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes priorités</SelectItem>
                  <SelectItem value="high">Haute</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="low">Basse</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-stone-200">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-emerald-700">
              {tasks.filter(t => t.status === 'completed').length}
            </div>
            <p className="text-stone-600 text-sm">Tâches terminées</p>
          </CardContent>
        </Card>
        <Card className="border-stone-200">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {tasks.filter(t => t.status === 'in-progress').length}
            </div>
            <p className="text-stone-600 text-sm">En cours</p>
          </CardContent>
        </Card>
        <Card className="border-stone-200">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-stone-600">
              {tasks.filter(t => t.status === 'pending').length}
            </div>
            <p className="text-stone-600 text-sm">En attente</p>
          </CardContent>
        </Card>
        <Card className="border-stone-200">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {tasks.filter(t => t.status === 'delayed').length}
            </div>
            <p className="text-stone-600 text-sm">Retardées</p>
          </CardContent>
        </Card>
      </div>

      {/* Liste des tâches */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <Card className="border-stone-200">
            <CardContent className="p-8 text-center">
              <p className="text-stone-500">Aucune tâche trouvée</p>
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' ? (
                <p className="text-sm text-stone-400 mt-2">
                  Essayez de modifier vos filtres de recherche
                </p>
              ) : (
                <Button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="mt-4 bg-emerald-700 hover:bg-emerald-800"
                >
                  Créer votre première tâche
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredTasks.map((task) => {
            const assignedVendor = task.assigned_vendor_id ? vendors.find(v => v.id === task.assigned_vendor_id) : null;
            
            return (
              <Card key={task.id} className={`hover:shadow-md transition-shadow border-stone-200 ${assignedVendor ? 'bg-sky-50 border-sky-200' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={task.status === 'completed'}
                      onCheckedChange={(checked) => handleToggleStatus(task.id, checked as boolean)}
                      className="mt-1"
                      disabled={toggleStatusMutation.isPending}
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className={`font-medium text-stone-800 ${task.status === 'completed' ? 'line-through text-stone-500' : ''}`}>
                          {task.title}
                        </h3>
                        <Badge className={priorityColors[task.priority as keyof typeof priorityColors]}>
                          {getPriorityLabel(task.priority)}
                        </Badge>
                        <Badge className={statusColors[task.status as keyof typeof statusColors]}>
                          {getStatusLabel(task.status)}
                        </Badge>
                      </div>
                      
                      {task.description && (
                        <p className="text-sm text-stone-600 mb-2">{task.description}</p>
                      )}
                      
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-4 flex-wrap">
                          <div className="flex items-center gap-1 text-stone-500">
                            <Clock className="w-3 h-3" />
                            <span>{task.duration_minutes}min</span>
                          </div>
                          {task.assigned_role && (
                            <div className="flex items-center gap-1 text-stone-500">
                              <Users className="w-3 h-3" />
                              <span>{task.assigned_role.replace('-', ' ')}</span>
                            </div>
                          )}
                           {assignedVendor && (
                            <div className="flex items-center gap-1 text-sky-600 font-medium">
                               <Building className="w-3 h-3" />
                               <span>{assignedVendor.name}</span>
                            </div>
                          )}
                          {task.completed_at && (
                            <span className="text-emerald-600">
                              Terminée le {new Date(task.completed_at).toLocaleDateString('fr-FR')}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditTask(task)}
                            className="h-8 w-8 p-0 hover:bg-stone-100"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-red-50 text-red-600"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Êtes-vous sûr de vouloir supprimer la tâche "{task.title}" ? 
                                  Cette action est irréversible.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteTask(task.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Modals */}
      <TaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTask}
        isLoading={createTaskMutation.isPending}
      />

      <TaskModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleUpdateTask}
        task={editingTask}
        isLoading={updateTaskMutation.isPending}
      />
    </div>
  );
};
