
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Users, Building2, AlertTriangle } from 'lucide-react';
import { useSharedEventData } from '@/hooks/useSharedEventData';

export const EventSummaryCards = () => {
  const { getProgressStats, getTeamSummary, getVendorsSummary, getDaysUntilEvent } = useSharedEventData();
  
  const progressStats = getProgressStats();
  const teamSummary = getTeamSummary();
  const vendorsSummary = getVendorsSummary();
  const daysUntilEvent = getDaysUntilEvent();

  const cards = [
    {
      title: 'Progression Globale',
      value: `${progressStats.progressPercentage}%`,
      subtitle: `${progressStats.completedTasks}/${progressStats.totalTasks} tâches`,
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      title: 'Tâches Critiques',
      value: progressStats.criticalTasks,
      subtitle: 'Haute priorité',
      icon: AlertTriangle,
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700'
    },
    {
      title: 'Équipe',
      value: `${teamSummary.confirmed}/${teamSummary.total}`,
      subtitle: 'Personnes confirmées',
      icon: Users,
      color: 'from-blue-500 to-purple-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Prestataires',
      value: `${vendorsSummary.confirmed}/${vendorsSummary.total}`,
      subtitle: 'Contrats signés',
      icon: Building2,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                {index === 0 && (
                  <Badge className={`${card.bgColor} ${card.textColor} border-0`}>
                    {progressStats.progressPercentage >= 80 ? 'Excellent' : 
                     progressStats.progressPercentage >= 60 ? 'Bon' : 'En cours'}
                  </Badge>
                )}
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {card.value}
                </div>
                <div className="text-sm text-gray-600">{card.title}</div>
                <div className="text-xs text-gray-500 mt-1">{card.subtitle}</div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
