
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertTriangle, Users } from 'lucide-react';
import { useSharedEventData } from '@/hooks/useSharedEventData';

interface PersonalDashboardProps {
  userId: string;
  userRole: string;
}

export const PersonalDashboard: React.FC<PersonalDashboardProps> = ({ userId, userRole }) => {
  const { tasks, timelineItems, people } = useSharedEventData();

  // Filtrer les tâches assignées à l'utilisateur
  const userTasks = tasks.filter(task => {
    if (task.assigned_person_ids && task.assigned_person_ids.length > 0) {
      return task.assigned_person_ids.includes(userId);
    }
    // Fallback pour les anciennes tâches qui n'ont pas encore été migrées
    return false;
  });

  // Filtrer les éléments de timeline assignés à l'utilisateur
  const userTimelineItems = timelineItems.filter(item => {
    if (item.assigned_person_ids && item.assigned_person_ids.length > 0) {
      return item.assigned_person_ids.includes(userId);
    }
    return item.assigned_role === userRole;
  });

  const completedTasks = userTasks.filter(task => task.status === 'completed').length;
  const urgentTasks = userTasks.filter(task => task.priority === 'high' && task.status !== 'completed').length;
  const upcomingTimelineItems = userTimelineItems.filter(item => item.status === 'scheduled').length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mes tâches</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}/{userTasks.length}</div>
            <p className="text-xs text-muted-foreground">tâches terminées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tâches urgentes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{urgentTasks}</div>
            <p className="text-xs text-muted-foreground">à traiter en priorité</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planning</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingTimelineItems}</div>
            <p className="text-xs text-muted-foreground">étapes à venir</p>
          </CardContent>
        </Card>
      </div>

      {/* Prochaines tâches */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Mes prochaines tâches
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userTasks.length === 0 ? (
            <p className="text-muted-foreground">Aucune tâche assignée pour le moment.</p>
          ) : (
            <div className="space-y-2">
              {userTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={task.priority === 'high' ? 'destructive' : 'outline'}>
                      {task.priority}
                    </Badge>
                    <Badge variant={task.status === 'completed' ? 'default' : 'secondary'}>
                      {task.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
