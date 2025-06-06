
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Clock, Users } from 'lucide-react';

export const TaskManagement = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Réservation salle de réception",
      description: "Confirmer la réservation et les détails logistiques",
      duration: 30,
      priority: "high",
      category: "Logistique",
      assignedTo: ["wedding-planner"],
      status: "completed",
      order: 1
    },
    {
      id: 2,
      title: "Essayage final de la robe",
      description: "Derniers ajustements et vérifications",
      duration: 120,
      priority: "high",
      category: "Préparation",
      assignedTo: ["bride"],
      status: "in-progress",
      order: 2
    },
    {
      id: 3,
      title: "Test son et éclairage",
      description: "Vérifier tous les équipements techniques",
      duration: 60,
      priority: "medium",
      category: "Technique",
      assignedTo: ["photographer", "wedding-planner"],
      status: "pending",
      order: 3
    }
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const priorityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  };

  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    pending: 'bg-gray-100 text-gray-800',
    delayed: 'bg-red-100 text-red-800'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestion des Tâches</h2>
          <p className="text-gray-600">Créez et organisez toutes les tâches de votre événement</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Tâche
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer une nouvelle tâche</DialogTitle>
              <DialogDescription>
                Définissez les détails de la tâche et assignez-la aux bonnes personnes
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Titre</Label>
                <Input id="title" className="col-span-3" placeholder="Nom de la tâche" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea id="description" className="col-span-3" placeholder="Description détaillée" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="duration" className="text-right">Durée</Label>
                <Input id="duration" type="number" className="col-span-3" placeholder="En minutes" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right">Priorité</Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionner une priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">Haute</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="low">Basse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">Catégorie</Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="logistique">Logistique</SelectItem>
                    <SelectItem value="preparation">Préparation</SelectItem>
                    <SelectItem value="technique">Technique</SelectItem>
                    <SelectItem value="administrative">Administrative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Annuler
              </Button>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                Créer la tâche
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {tasks.map((task) => (
          <Card key={task.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{task.title}</CardTitle>
                  <CardDescription>{task.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{task.duration}min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{task.assignedTo.length} assigné(s)</span>
                  </div>
                  <Badge className={priorityColors[task.priority as keyof typeof priorityColors]}>
                    {task.priority === 'high' ? 'Haute' : task.priority === 'medium' ? 'Moyenne' : 'Basse'}
                  </Badge>
                  <Badge variant="outline">{task.category}</Badge>
                </div>
                <Badge className={statusColors[task.status as keyof typeof statusColors]}>
                  {task.status === 'completed' ? 'Terminée' : 
                   task.status === 'in-progress' ? 'En cours' : 
                   task.status === 'delayed' ? 'Retardée' : 'En attente'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
