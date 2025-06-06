
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Person {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  availability: string;
  status: string;
}

export const usePeople = () => {
  const { toast } = useToast();
  
  const [people, setPeople] = useState<Person[]>([
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

  const addPerson = (newPerson: Omit<Person, 'id'>) => {
    const id = Math.max(...people.map(p => p.id)) + 1;
    setPeople(prev => [...prev, { ...newPerson, id }]);
    
    toast({
      title: 'Personne ajoutée',
      description: 'Nouvelle personne ajoutée avec succès',
    });
  };

  const updatePerson = (id: number, updates: Partial<Person>) => {
    setPeople(prev => prev.map(person => 
      person.id === id ? { ...person, ...updates } : person
    ));
    
    toast({
      title: 'Succès',
      description: 'Personne mise à jour avec succès',
    });
  };

  const deletePerson = (id: number) => {
    setPeople(prev => prev.filter(person => person.id !== id));
    
    toast({
      title: 'Personne supprimée',
      description: 'La personne a été supprimée avec succès',
    });
  };

  return {
    people,
    addPerson,
    updatePerson,
    deletePerson
  };
};
