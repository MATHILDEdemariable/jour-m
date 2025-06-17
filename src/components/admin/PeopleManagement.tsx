
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Phone, Mail, MapPin, Users, FileText } from 'lucide-react';
import { useLocalPeople } from '@/hooks/useLocalPeople';
import { PersonModal } from './PersonModal';

export const PeopleManagement = () => {
  const { people, loading, loadPeople, addPerson, updatePerson, deletePerson } = useLocalPeople();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<any | null>(null);

  useEffect(() => {
    loadPeople();
  }, []);

  const handleCreatePerson = async (personData: any) => {
    await addPerson(personData);
    setIsCreateModalOpen(false);
  };

  const handleEditPerson = async (personData: any) => {
    if (selectedPerson) {
      await updatePerson(selectedPerson.id, personData);
      setIsEditModalOpen(false);
      setSelectedPerson(null);
    }
  };

  const handleDeletePerson = async (personId: string) => {
    await deletePerson(personId);
  };

  const openEditModal = (person: any) => {
    setSelectedPerson(person);
    setIsEditModalOpen(true);
  };

  const getStatusColor = (status: string | null) => {
    const colors = {
      confirmed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      declined: "bg-red-100 text-red-800"
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string | null) => {
    const labels = {
      confirmed: "Confirmé",
      pending: "En attente",
      declined: "Décliné"
    };
    return labels[status as keyof typeof labels] || status || "Non défini";
  };

  const getRoleLabel = (role: string | null) => {
    const labels = {
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
    return labels[role as keyof typeof labels] || role || "Non défini";
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">👥 Gestion de l'Équipe</h2>
          <p className="text-sm text-gray-600">Gérez les membres de votre équipe • {people.length} personne(s)</p>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Personne
        </Button>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 bg-white p-3 rounded-lg border border-gray-200">
        <div className="text-center">
          <div className="text-lg font-bold text-purple-600">{people.length}</div>
          <div className="text-xs text-gray-600">Total</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-600">{people.filter(p => p.status === 'confirmed').length}</div>
          <div className="text-xs text-gray-600">Confirmés</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-yellow-600">{people.filter(p => p.status === 'pending').length}</div>
          <div className="text-xs text-gray-600">En attente</div>
        </div>
      </div>

      {/* People List */}
      <div className="grid gap-4">
        {loading ? (
          <Card>
            <CardContent className="p-6 text-center">
              Chargement des personnes...
            </CardContent>
          </Card>
        ) : people.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 mb-4">Aucune personne enregistrée</p>
                <p className="text-sm text-gray-400">Commencez par ajouter les membres de votre équipe</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          people.map((person) => (
            <Card key={person.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-semibold text-xl">{person.name}</h3>
                      {person.role && (
                        <Badge variant="outline">{getRoleLabel(person.role)}</Badge>
                      )}
                      <Badge className={getStatusColor(person.status)}>
                        {getStatusLabel(person.status)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        {person.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                            <Mail className="w-4 h-4" />
                            {person.email}
                          </div>
                        )}
                        {person.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            {person.phone}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        {person.availability && (
                          <div className="text-sm text-gray-600 mb-2">
                            <strong>Disponibilité:</strong> {person.availability}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => openEditModal(person)}
                    >
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
                          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer cette personne ? Cette action est irréversible.
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
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modals */}
      <PersonModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePerson}
      />

      <PersonModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPerson(null);
        }}
        onSubmit={handleEditPerson}
        person={selectedPerson}
      />
    </div>
  );
};
