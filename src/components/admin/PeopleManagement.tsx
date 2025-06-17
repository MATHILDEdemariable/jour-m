
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Phone, Mail, User, Loader2 } from 'lucide-react';
import { useLocalPeople } from '@/hooks/useLocalPeople';
import { Person } from '@/stores/eventStore';
import { PersonModal } from './PersonModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export const PeopleManagement = () => {
  const { people, loading, addPerson, updatePerson, deletePerson } = useLocalPeople();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);

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

  const handleEditPerson = (person: Person) => {
    setEditingPerson(person);
    setIsModalOpen(true);
  };

  const handleCreatePerson = () => {
    setEditingPerson(null);
    setIsModalOpen(true);
  };

  const handleSubmitPerson = async (data: Partial<Person>) => {
    if (editingPerson) {
      await updatePerson(editingPerson.id, data);
    } else {
      await addPerson(data as Omit<Person, 'id' | 'created_at' | 'updated_at'>);
    }
    setIsModalOpen(false);
    setEditingPerson(null);
  };

  const handleDeletePerson = async (id: string) => {
    await deletePerson(id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Chargement des personnes...</span>
      </div>
    );
  }

  // Sort alphabetically by name
  const sortedPeople = [...people].sort((a, b) =>
    a.name.localeCompare(b.name, "fr", { sensitivity: "base" })
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">👥 Gestion des Personnes</h2>
          <p className="text-sm text-gray-600">Gérez tous les intervenants • {people.length} personne(s)</p>
        </div>
        <Button onClick={handleCreatePerson} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une personne
        </Button>
      </div>

      {/* People List */}
      <div className="grid gap-4">
        {sortedPeople.map((person) => (
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
                      {person.role && (
                        <Badge className={roleColors[person.role as keyof typeof roleColors]}>
                          {roleLabels[person.role as keyof typeof roleLabels] || person.role}
                        </Badge>
                      )}
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
                      {person.email || 'Non renseigné'}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      {person.phone || 'Non renseigné'}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEditPerson(person)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer cette personne ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer "{person.name}" ? Cette action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeletePerson(person.id)}
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
            </CardContent>
          </Card>
        ))}

        {people.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune personne</h3>
              <p className="text-gray-600 mb-4">Commencez par ajouter des personnes à votre événement</p>
              <Button onClick={handleCreatePerson} className="bg-gradient-to-r from-purple-600 to-pink-600">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter la première personne
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <PersonModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPerson(null);
        }}
        onSubmit={handleSubmitPerson}
        person={editingPerson}
      />
    </div>
  );
};
