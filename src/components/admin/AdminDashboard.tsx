import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertTriangle, Users, Calendar, FileText, TrendingUp, Activity } from 'lucide-react';
import { useSharedEventData } from '@/hooks/useSharedEventData';
import { useEvents } from '@/hooks/useEvents';

export const AdminDashboard = () => {
  const { 
    getProgressStats, 
    getTeamSummary, 
    getVendorsSummary, 
    getTimelineStats,
    getDocumentStats,
    getCriticalTasks,
    getRecentActivity,
    getDaysUntilEvent,
    loading 
  } = useSharedEventData();

  const { currentEvent } = useEvents();
  
  const progressStats = getProgressStats();
  const teamSummary = getTeamSummary();
  const vendorsSummary = getVendorsSummary();
  const timelineStats = getTimelineStats();
  const documentStats = getDocumentStats();
  const criticalTasks = getCriticalTasks();
  const recentActivity = getRecentActivity();
  const daysUntilEvent = getDaysUntilEvent();

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Il y a moins d\'une heure';
    if (diffInHours < 24) return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-stone-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-stone-200 rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-stone-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Tableau de Bord</h2>
          <p className="text-gray-600">
            Vue d'ensemble de {currentEvent?.name || 'votre événement'} - 
            {daysUntilEvent > 0 ? ` ${daysUntilEvent} jours restants` : ' Jour J !'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-purple-700 border-purple-300">
            {currentEvent?.event_type || 'Événement'}
          </Badge>
          {daysUntilEvent <= 7 && daysUntilEvent > 0 && (
            <Badge variant="destructive">
              Urgent - {daysUntilEvent} jour{daysUntilEvent > 1 ? 's' : ''} restant{daysUntilEvent > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Tâches Terminées</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {progressStats.completedTasks}/{progressStats.totalTasks}
            </div>
            <p className="text-xs text-green-700">
              {progressStats.progressPercentage}% terminées
            </p>
            <Progress value={progressStats.progressPercentage} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Prestataires</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {vendorsSummary.confirmed}/{vendorsSummary.total}
            </div>
            <p className="text-xs text-blue-700">confirmés</p>
            <div className="mt-2 text-xs text-blue-600">
              {vendorsSummary.pending} en attente
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Planning</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {timelineStats.completedSteps}/{timelineStats.totalSteps}
            </div>
            <p className="text-xs text-purple-700">étapes terminées</p>
            <Progress value={timelineStats.progressPercentage} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Documents</CardTitle>
            <FileText className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">
              {documentStats.totalDocuments}
            </div>
            <p className="text-xs text-orange-700">fichiers uploadés</p>
            <div className="mt-2 text-xs text-orange-600">
              {documentStats.pendingDocuments} en attente
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section de progression */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Progression Générale
            </CardTitle>
            <CardDescription>Avancement des préparatifs par catégorie</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Tâches Principales</span>
                <span className="text-sm text-gray-500">{progressStats.progressPercentage}%</span>
              </div>
              <Progress value={progressStats.progressPercentage} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Planning du Jour J</span>
                <span className="text-sm text-gray-500">{timelineStats.progressPercentage}%</span>
              </div>
              <Progress value={timelineStats.progressPercentage} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Équipe & Prestataires</span>
                <span className="text-sm text-gray-500">
                  {Math.round(((teamSummary.confirmed + vendorsSummary.confirmed) / (teamSummary.total + vendorsSummary.total)) * 100) || 0}%
                </span>
              </div>
              <Progress 
                value={Math.round(((teamSummary.confirmed + vendorsSummary.confirmed) / (teamSummary.total + vendorsSummary.total)) * 100) || 0} 
                className="h-2" 
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Documentation</span>
                <span className="text-sm text-gray-500">
                  {Math.round((documentStats.approvedDocuments / documentStats.totalDocuments) * 100) || 0}%
                </span>
              </div>
              <Progress 
                value={Math.round((documentStats.approvedDocuments / documentStats.totalDocuments) * 100) || 0} 
                className="h-2" 
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Alertes & Tâches Critiques
            </CardTitle>
            <CardDescription>Points d'attention prioritaires</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {timelineStats.criticalSteps > 0 && (
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Étapes critiques en retard</p>
                  <p className="text-xs text-gray-600">{timelineStats.criticalSteps} étape(s) à traiter</p>
                </div>
                <Badge variant="destructive">Urgent</Badge>
              </div>
            )}

            {timelineStats.delayedSteps > 0 && (
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <Clock className="h-4 w-4 text-yellow-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Étapes en retard</p>
                  <p className="text-xs text-gray-600">{timelineStats.delayedSteps} étape(s) retardée(s)</p>
                </div>
                <Badge variant="secondary">Important</Badge>
              </div>
            )}

            {criticalTasks.slice(0, 3).map((task, index) => (
              <div key={task.id} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <FileText className="h-4 w-4 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{task.title}</p>
                  <p className="text-xs text-gray-600">
                    {task.due_date ? `Échéance: ${new Date(task.due_date).toLocaleDateString('fr-FR')}` : 'Tâche prioritaire'}
                  </p>
                </div>
                <Badge variant="outline">Critique</Badge>
              </div>
            ))}

            {criticalTasks.length === 0 && timelineStats.criticalSteps === 0 && timelineStats.delayedSteps === 0 && (
              <div className="text-center py-6 text-green-600">
                <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm font-medium">Tout va bien !</p>
                <p className="text-xs">Aucune alerte critique</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activité récente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Activité Récente
          </CardTitle>
          <CardDescription>Dernières modifications et actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full bg-${activity.color}-500`}></div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.title}</p>
                    <p className="text-xs text-gray-500">{formatTimeAgo(activity.time)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                <p className="text-sm">Aucune activité récente</p>
                <p className="text-xs">Les actions apparaîtront ici</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
