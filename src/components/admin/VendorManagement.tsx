
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Phone, Mail, MapPin, FileText, Calendar } from 'lucide-react';
import { useLocalVendors } from '@/hooks/useLocalVendors';
import { VendorModal } from './VendorModal';
import { VendorDetailModal } from './VendorDetailModal';

export const VendorManagement = () => {
  const { vendors, loading, loadVendors, addVendor, updateVendor, deleteVendor } = useLocalVendors();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<any | null>(null);

  useEffect(() => {
    loadVendors();
  }, []);

  const handleCreateVendor = async (vendorData: any) => {
    await addVendor(vendorData);
    setIsCreateModalOpen(false);
  };

  const handleEditVendor = async (vendorData: any) => {
    if (selectedVendor) {
      await updateVendor(selectedVendor.id, vendorData);
      setIsEditModalOpen(false);
      setSelectedVendor(null);
    }
  };

  const handleDeleteVendor = async (vendorId: string) => {
    await deleteVendor(vendorId);
  };

  const openEditModal = (vendor: any) => {
    setSelectedVendor(vendor);
    setIsEditModalOpen(true);
  };

  const openDetailModal = (vendor: any) => {
    setSelectedVendor(vendor);
    setIsDetailModalOpen(true);
  };

  const getStatusColor = (status: string | null) => {
    const colors = {
      quote: "bg-blue-100 text-blue-800",
      confirmed: "bg-green-100 text-green-800",
      in_progress: "bg-yellow-100 text-yellow-800",
      completed: "bg-purple-100 text-purple-800",
      cancelled: "bg-red-100 text-red-800"
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string | null) => {
    const labels = {
      quote: "Devis",
      confirmed: "Confirmé",
      in_progress: "En cours",
      completed: "Terminé",
      cancelled: "Annulé"
    };
    return labels[status as keyof typeof labels] || status || "Non défini";
  };

  const getServiceTypeLabel = (serviceType: string | null) => {
    const labels = {
      photographer: "Photographe",
      caterer: "Traiteur",
      venue: "Lieu",
      florist: "Fleuriste",
      musician: "Musicien",
      decorator: "Décorateur",
      transport: "Transport",
      other: "Autre"
    };
    return labels[serviceType as keyof typeof labels] || serviceType || "Non défini";
  };

  return (
    <div className="space-y-4">
      {/* Header optimisé */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">🏢 Gestion des Prestataires</h2>
          <p className="text-sm text-gray-600">Gérez vos prestataires et suivez leurs contrats • {vendors.length} prestataire(s)</p>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Prestataire
        </Button>
      </div>

      {/* Stats compactes en ligne */}
      <div className="flex items-center gap-6 bg-white p-3 rounded-lg border border-gray-200">
        <div className="text-center">
          <div className="text-lg font-bold text-purple-600">{vendors.length}</div>
          <div className="text-xs text-gray-600">Total</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-600">{vendors.filter(v => v.contract_status === 'confirmed').length}</div>
          <div className="text-xs text-gray-600">Confirmés</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600">{vendors.filter(v => v.contract_status === 'quote').length}</div>
          <div className="text-xs text-gray-600">Devis</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-yellow-600">{vendors.filter(v => v.contract_status === 'in_progress').length}</div>
          <div className="text-xs text-gray-600">En cours</div>
        </div>
      </div>

      {/* Vendors List */}
      <div className="grid gap-4">
        {loading ? (
          <Card>
            <CardContent className="p-6 text-center">
              Chargement des prestataires...
            </CardContent>
          </Card>
        ) : vendors.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              <div className="text-center py-8">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 mb-4">Aucun prestataire enregistré</p>
                <p className="text-sm text-gray-400">Commencez par ajouter vos prestataires pour organiser votre événement</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          vendors.map((vendor) => (
            <Card key={vendor.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6" onClick={() => openDetailModal(vendor)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-semibold text-xl">{vendor.name}</h3>
                      {vendor.service_type && (
                        <Badge variant="outline">{getServiceTypeLabel(vendor.service_type)}</Badge>
                      )}
                      <Badge className={getStatusColor(vendor.contract_status)}>
                        {getStatusLabel(vendor.contract_status)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        {vendor.contact_person && (
                          <p className="text-sm text-gray-600 mb-2">Contact: {vendor.contact_person}</p>
                        )}
                        {vendor.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                            <Mail className="w-4 h-4" />
                            {vendor.email}
                          </div>
                        )}
                        {vendor.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            {vendor.phone}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        {vendor.address && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <MapPin className="w-4 h-4" />
                            <span className="truncate">{vendor.address}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>Créé le {new Date(vendor.created_at).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                    </div>
                    
                    {vendor.notes && (
                      <div className="bg-gray-50 p-3 rounded-lg mb-4">
                        <p className="text-sm text-gray-700 line-clamp-2">{vendor.notes}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => openEditModal(vendor)}
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
                            Êtes-vous sûr de vouloir supprimer ce prestataire ? Cette action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteVendor(vendor.id)}
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
      <VendorModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateVendor}
      />

      <VendorModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedVendor(null);
        }}
        onSubmit={handleEditVendor}
        vendor={selectedVendor}
      />

      <VendorDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedVendor(null);
        }}
        vendor={selectedVendor}
        onEdit={(vendor) => {
          setIsDetailModalOpen(false);
          openEditModal(vendor);
        }}
      />
    </div>
  );
};
