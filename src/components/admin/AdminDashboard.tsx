
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertTriangle, Users, Calendar, FileText } from 'lucide-react';

export const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-stone-900">Dashboard</h2>
        <p className="text-stone-600">Vue d'ensemble de votre événement</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-stone-50 border-emerald-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-stone-800">Tâches Complètes</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-900">24/32</div>
            <p className="text-xs text-stone-600">75% terminées</p>
          </CardContent>
        </Card>

        <Card className="bg-stone-50 border-emerald-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-stone-800">Prestataires</CardTitle>
            <Users className="h-4 w-4 text-emerald-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-900">12</div>
            <p className="text-xs text-stone-600">8 confirmés</p>
          </CardContent>
        </Card>

        <Card className="bg-stone-50 border-emerald-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-stone-800">Jours Restants</CardTitle>
            <Calendar className="h-4 w-4 text-emerald-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-900">45</div>
            <p className="text-xs text-stone-600">jusqu'au Jour M</p>
          </CardContent>
        </Card>

        <Card className="bg-stone-50 border-emerald-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-stone-800">Documents</CardTitle>
            <FileText className="h-4 w-4 text-emerald-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-900">18</div>
            <p className="text-xs text-stone-600">fichiers uploadés</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-stone-50 border-emerald-200">
          <CardHeader>
            <CardTitle className="text-stone-900">Progression Générale</CardTitle>
            <CardDescription className="text-stone-600">Avancement des préparatifs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-stone-800">Planification</span>
                <span className="text-sm text-stone-600">85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-stone-800">Prestataires</span>
                <span className="text-sm text-stone-600">70%</span>
              </div>
              <Progress value={70} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-stone-800">Documentation</span>
                <span className="text-sm text-stone-600">60%</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-stone-800">Logistique</span>
                <span className="text-sm text-stone-600">45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-stone-50 border-emerald-200">
          <CardHeader>
            <CardTitle className="text-stone-900">Alertes & Tâches Critiques</CardTitle>
            <CardDescription className="text-stone-600">Points d'attention prioritaires</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border-l-4 border-l-red-700">
              <AlertTriangle className="h-4 w-4 text-red-700" />
              <div className="flex-1">
                <p className="text-sm font-medium text-stone-900">Confirmation traiteur</p>
                <p className="text-xs text-stone-600">En attente depuis 5 jours</p>
              </div>
              <Badge className="bg-red-800 text-red-100">Urgent</Badge>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border-l-4 border-l-amber-700">
              <Clock className="h-4 w-4 text-amber-700" />
              <div className="flex-1">
                <p className="text-sm font-medium text-stone-900">Essayage robe</p>
                <p className="text-xs text-stone-600">Prévu dans 3 jours</p>
              </div>
              <Badge className="bg-amber-700 text-amber-100">Important</Badge>
            </div>

            <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border-l-4 border-l-emerald-700">
              <FileText className="h-4 w-4 text-emerald-700" />
              <div className="flex-1">
                <p className="text-sm font-medium text-stone-900">Contrat musiciens</p>
                <p className="text-xs text-stone-600">À signer cette semaine</p>
              </div>
              <Badge className="bg-emerald-600 text-emerald-100">Normal</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-stone-50 border-emerald-200">
        <CardHeader>
          <CardTitle className="text-stone-900">Activité Récente</CardTitle>
          <CardDescription className="text-stone-600">Dernières modifications et actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-stone-900">Sarah a marqué "Réservation salle" comme terminée</p>
                <p className="text-xs text-stone-600">Il y a 2 heures</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-stone-900">Nouveau document ajouté: "Contrat DJ"</p>
                <p className="text-xs text-stone-600">Il y a 4 heures</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-stone-900">Planning mis à jour par Wedding Planner</p>
                <p className="text-xs text-stone-600">Hier à 16:30</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
