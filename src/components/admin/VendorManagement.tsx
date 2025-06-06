
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Phone, Mail, MapPin, Euro } from 'lucide-react';

export const VendorManagement = () => {
  const [vendors, setVendors] = useState([
    {
      id: 1,
      name: "Studio Lumière",
      service: "Photographe",
      contact: "Marie Dubois",
      email: "contact@studiolumiere.fr",
      phone: "+33 1 23 45 67 89",
      price: 1500,
      status: "confirmed",
      rating: 4.8,
      notes: "Spécialisé dans les mariages, très professionnel"
    },
    {
      id: 2,
      name: "Traiteur Délices",
      service: "Traiteur",
      contact: "Jean Martin",
      email: "info@traiteurdelices.fr",
      phone: "+33 1 98 76 54 32",
      price: 4500,
      status: "pending",
      rating: 4.6,
      notes: "Menu dégustation prévu la semaine prochaine"
    },
    {
      id: 3,
      name: "Château de Malmaison",
      service: "Lieu de réception",
      contact: "Sophie Laurent",
      email: "evenements@chateaumalmaison.fr",
      phone: "+33 1 55 44 33 22",
      price: 3200,
      status: "confirmed",
      rating: 4.9,
      notes: "Capacité 120 personnes, jardin inclus"
    },
    {
      id: 4,
      name: "Fleurs & Passion",
      service: "Fleuriste",
      contact: "Claire Moreau",
      email: "contact@fleursetpassion.fr",
      phone: "+33 1 66 77 88 99",
      price: 800,
      status: "quoted",
      rating: 4.5,
      notes: "Devis en cours de validation"
    }
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const statusColors = {
    confirmed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    quoted: "bg-blue-100 text-blue-800",
    cancelled: "bg-red-100 text-red-800"
  };

  const statusLabels = {
    confirmed: "Confirmé",
    pending: "En attente",
    quoted: "Devis",
    cancelled: "Annulé"
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestion des Prestataires</h2>
          <p className="text-gray-600">Gérez tous vos prestataires et leurs contrats</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Prestataire
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ajouter un prestataire</DialogTitle>
              <DialogDescription>
                Ajoutez un nouveau prestataire à votre événement
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vendor-name" className="text-right">Nom</Label>
                <Input id="vendor-name" className="col-span-3" placeholder="Nom du prestataire" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="service" className="text-right">Service</Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Type de service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="photographer">Photographe</SelectItem>
                    <SelectItem value="caterer">Traiteur</SelectItem>
                    <SelectItem value="venue">Lieu</SelectItem>
                    <SelectItem value="florist">Fleuriste</SelectItem>
                    <SelectItem value="musician">Musicien</SelectItem>
                    <SelectItem value="decorator">Décorateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact" className="text-right">Contact</Label>
                <Input id="contact" className="col-span-3" placeholder="Nom du contact" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vendor-email" className="text-right">Email</Label>
                <Input id="vendor-email" type="email" className="col-span-3" placeholder="email@example.com" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vendor-phone" className="text-right">Téléphone</Label>
                <Input id="vendor-phone" className="col-span-3" placeholder="+33 1 23 45 67 89" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">Tarif (€)</Label>
                <Input id="price" type="number" className="col-span-3" placeholder="1500" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vendor-notes" className="text-right">Notes</Label>
                <Textarea id="vendor-notes" className="col-span-3" placeholder="Informations complémentaires" />
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
            <div className="text-2xl font-bold text-purple-600">4</div>
            <div className="text-sm text-gray-600">Prestataires</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">2</div>
            <div className="text-sm text-gray-600">Confirmés</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">10.000€</div>
            <div className="text-sm text-gray-600">Budget total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-amber-600">4.7</div>
            <div className="text-sm text-gray-600">Note moyenne</div>
          </CardContent>
        </Card>
      </div>

      {/* Vendors List */}
      <div className="grid gap-4">
        {vendors.map((vendor) => (
          <Card key={vendor.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-semibold text-xl">{vendor.name}</h3>
                    <Badge variant="outline">{vendor.service}</Badge>
                    <Badge className={statusColors[vendor.status as keyof typeof statusColors]}>
                      {statusLabels[vendor.status as keyof typeof statusLabels]}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Contact: {vendor.contact}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <Mail className="w-4 h-4" />
                        {vendor.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        {vendor.phone}
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Euro className="w-4 h-4" />
                        <span className="font-semibold">{vendor.price.toLocaleString()} €</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-gray-600">Note:</span>
                        <span className="font-semibold text-amber-600">⭐ {vendor.rating}/5</span>
                      </div>
                    </div>
                  </div>
                  
                  {vendor.notes && (
                    <div className="bg-gray-50 p-3 rounded-lg mb-4">
                      <p className="text-sm text-gray-700">{vendor.notes}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
