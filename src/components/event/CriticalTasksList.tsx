
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, User, Settings } from 'lucide-react';
import { useSharedEventData } from '@/hooks/useSharedEventData';
import { useNavigate } from 'react-router-dom';

export const CriticalTasksList = () => {
  const { getCriticalTasks } = useSharedEventData();
  const navigate = useNavigate();
  const criticalTasks = getCriticalTasks();

  const priorityColors = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200'
  };

  const statusColors = {
    pending: 'bg-gray-100 text-gray-800 border-gray-200',
    'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    delayed: 'bg-red-100 text-red-800 border-red-200'
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          Tâches Critiques
        </CardTitle>
      </CardHeader>
      <CardContent>
        {criticalTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="mb-4">Aucune tâche critique planifiée</p>
            <Button
              onClick={() => navigate('/admin')}
              variant="outline"
              className="border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              <Settings className="w-4 h-4 mr-2" />
              Créer des tâches dans l'Admin Portal
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {criticalTasks.map((task) => (
              <div key={task.id} className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{task.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={priorityColors[task.priority as keyof typeof priorityColors]} variant="outline">
                      {task.priority === 'high' ? 'Haute' : task.priority === 'medium' ? 'Moyenne' : 'Basse'}
                    </Badge>
                    <Badge className={statusColors[task.status as keyof typeof statusColors]} variant="outline">
                      {task.status === 'pending' ? 'En attente' : 
                       task.status === 'in-progress' ? 'En cours' : 
                       task.status === 'completed' ? 'Terminé' : 'Retardé'}
                    </Badge>
                    
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {task.duration_minutes}min
                    </div>
                    
                    {task.assigned_person_id && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <User className="w-3 h-3" />
                        Assigné
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
