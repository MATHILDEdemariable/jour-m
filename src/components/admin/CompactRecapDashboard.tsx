
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calendar, Users, Building2, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { useSharedEventData } from '@/hooks/useSharedEventData';

export const CompactRecapDashboard = () => {
  const {
    getProgressStats,
    getDaysUntilEvent,
    getCriticalTasks,
    getTeamSummary,
    getVendorsSummary,
    getTimelineStats,
    getRecentActivity,
    loading
  } = useSharedEventData();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Chargement du récapitulatif...</p>
        </div>
      </div>
    );
  }

  const progressStats = getProgressStats();
  const daysUntilEvent = getDaysUntilEvent();
  const criticalTasks = getCriticalTasks();
  const teamSummary = getTeamSummary();
  const vendorsSummary = getVendorsSummary();
  const timelineStats = getTimelineStats();
  const recentActivity = getRecentActivity();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">📊 Récapitulatif Général</h2>
        <p className="text-gray-600">Vue d'ensemble de l'avancement de votre événement</p>
      </div>

      {/* Indicateurs clés compacts */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Jours restants</p>
                <p className="text-2xl font-bold text-purple-600">{daysUntilEvent}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tâches terminées</p>
                <p className="text-2xl font-bold text-green-600">{progressStats.completedTasks}/{progressStats.totalTasks}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Planning</p>
                <p className="text-2xl font-bold text-blue-600">{timelineStats.progressPercentage}%</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Alertes</p>
                <p className="text-2xl font-bold text-red-600">{criticalTasks.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progression détaillée */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Équipe & Personnes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Confirmations</span>
                <span>{teamSummary.confirmed}/{teamSummary.total}</span>
              </div>
              <Progress value={(teamSummary.confirmed / Math.max(teamSummary.total, 1)) * 100} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="font-bold text-green-600">{teamSummary.confirmed}</div>
                <div className="text-gray-600">Confirmées</div>
              </div>
              <div className="text-center p-2 bg-yellow-50 rounded">
                <div className="font-bold text-yellow-600">{teamSummary.pending}</div>
                <div className="text-gray-600">En attente</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Prestataires
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Contrats signés</span>
                <span>{vendorsSummary.confirmed}/{vendorsSummary.total}</span>
              </div>
              <Progress value={(vendorsSummary.confirmed / Math.max(vendorsSummary.total, 1)) * 100} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="font-bold text-green-600">{vendorsSummary.confirmed}</div>
                <div className="text-gray-600">Signés</div>
              </div>
              <div className="text-center p-2 bg-blue-50 rounded">
                <div className="font-bold text-blue-600">{vendorsSummary.pending}</div>
                <div className="text-gray-600">En cours</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tâches critiques */}
      {criticalTasks.length > 0 && (
        <Card className="border-red-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-5 h-5" />
              Tâches critiques à traiter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {criticalTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="p-3 bg-red-50 rounded-lg flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium text-red-900">{task.title}</p>
                    <p className="text-sm text-red-700">
                      {task.assigned_role && `Assigné à: ${task.assigned_role}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activité récente */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Activité récente</CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded">
                  <div className={`w-2 h-2 rounded-full bg-${activity.color}-500`}></div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.time).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Aucune activité récente</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
