
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Phone, Mail, User } from 'lucide-react';

export const PeopleManagement = () => {
  const [people, setPeople] = useState([
    {
      id: 1,
      name: "Sarah Martinez",
      role: "bride",
      email: "sarah@example.com",
      phone: "+33 6 12 34 56 78",
      availability: "full",
      status: "confirmed"
    },
    {
      id: 2,
      name: "James Wilson",
      role: "groom", 
      email: "james@example.com",
      phone: "+33 6 87 65 43 21",
      availability: "full",
      status: "confirmed"
    },
    {
      id: 3,
      name: "Emma Thompson",
      role: "maid-of-honor",
      email: "emma@example.com",
      phone: "+33 6 11 22 33 44",
      availability: "partial",
      status: "confirmed"
    },
    {
      id: 4,
      name: "Studio Lumière",
      role: "photographer",
      email: "contact@studiolumiere.fr",
      phone: "+33 1 23 45 67 89",
      availability: "full",
      status: "confirmed"
    },
    {
      id: 5,
      name: "Traiteur Délices",
      role: "caterer",
      email: "info@traiteurdelices.fr", 
      phone: "+33 1 98 76 54 32",
      availability: "full",
      status: "pending"
    }
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const roleLabels = {
    bride: "Mariée",
    groom: "Marié",
    "best-man": "Témoin",
    "maid-of-honor": "Demoiselle d'honneur",
    "wedding-planner": "Wedding Planner",
    photographer: "Photographe",
    caterer: "Traiteur",
    guest: "Invité",
    family: "Famille"
  };

  const roleColors = {
    bride: "bg-pink-100 text-pink-800",
    groom: "bg-blue-100 text-blue-800",
    "best-man": "bg-green-100 text-green-800",
    "maid-of-honor": "bg-rose-100 text-rose-800",
    "wedding-planner": "bg-purple-100 text-purple-800",
    photographer: "bg-amber-100 text-amber-800",
    caterer: "bg-orange-100 text-orange-800",
    guest: "bg-gray-100 text-gray-800",
    family: "bg-indigo-100 text-indigo-800"
  };

  const statusColors = {
    confirmed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    declined: "bg-red-100 text-red-800"
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestion des Personnes</h2>
          <p className="text-gray-600">Gérez tous les intervenants de votre événement</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une personne
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle personne</DialogTitle>
              <DialogDescription>
                Ajoutez un intervenant à votre événement
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nom</Label>
                <Input id="name" className="col-span-3" placeholder="Nom complet" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">Rôle</Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bride">Mariée</SelectItem>
                    <SelectItem value="groom">Marié</SelectItem>
                    <SelectItem value="best-man">Témoin</SelectItem>
                    <SelectItem value="maid-of-honor">Demoiselle d'honneur</SelectItem>
                    <SelectItem value="wedding-planner">Wedding Planner</SelectItem>
                    <SelectItem value="photographer">Photographe</SelectItem>
                    <SelectItem value="caterer">Traiteur</SelectItem>
                    <SelectItem value="guest">Invité</SelectItem>
                    <SelectItem value="family">Famille</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" type="email" className="col-span-3" placeholder="email@example.com" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">Téléphone</Label>
                <Input id="phone" className="col-span-3" placeholder="+33 6 12 34 56 78" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Annuler
              </Button>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                Ajouter
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">5</div>
            <div className="text-sm text-gray-600">Total personnes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">4</div>
            <div className="text-sm text-gray-600">Confirmées</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">1</div>
            <div className="text-sm text-gray-600">En attente</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">3</div>
            <div className="text-sm text-gray-600">Prestataires</div>
          </CardContent>
        </Card>
      </div>

      {/* People List */}
      <div className="grid gap-4">
        {people.map((person) => (
          <Card key={person.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{person.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={roleColors[person.role as keyof typeof roleColors]}>
                        {roleLabels[person.role as keyof typeof roleLabels]}
                      </Badge>
                      <Badge className={statusColors[person.status as keyof typeof statusColors]}>
                        {person.status === 'confirmed' ? 'Confirmé' : 
                         person.status === 'pending' ? 'En attente' : 'Décliné'}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <Mail className="w-4 h-4" />
                      {person.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      {person.phone}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
