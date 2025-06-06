
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, FileText, Download, Share, Trash2, Eye, Plus } from 'lucide-react';

export const DocumentManagement = () => {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: "Contrat Photographe",
      category: "Contrats",
      type: "pdf",
      size: "2.4 MB",
      uploadDate: "2024-01-15",
      uploadedBy: "Sarah Martinez",
      shared: ["wedding-planner", "photographer"],
      version: 1
    },
    {
      id: 2,
      name: "Planning Détaillé",
      category: "Planning",
      type: "docx",
      size: "1.2 MB",
      uploadDate: "2024-01-20",
      uploadedBy: "Wedding Planner",
      shared: ["bride", "groom", "best-man", "maid-of-honor"],
      version: 3
    },
    {
      id: 3,
      name: "Liste Invités",
      category: "Listes",
      type: "xlsx",
      size: "856 KB",
      uploadDate: "2024-01-18",
      uploadedBy: "Sarah Martinez",
      shared: ["groom"],
      version: 2
    },
    {
      id: 4,
      name: "Playlist Cérémonie",
      category: "Musique",
      type: "pdf",
      size: "654 KB",
      uploadDate: "2024-01-22",
      uploadedBy: "James Wilson",
      shared: ["photographer", "wedding-planner"],
      version: 1
    }
  ]);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const categoryColors = {
    "Contrats": "bg-blue-100 text-blue-800",
    "Planning": "bg-purple-100 text-purple-800",
    "Listes": "bg-green-100 text-green-800",
    "Musique": "bg-pink-100 text-pink-800",
    "Photos": "bg-amber-100 text-amber-800",
    "Factures": "bg-red-100 text-red-800"
  };

  const getFileIcon = (type: string) => {
    return <FileText className="w-5 h-5 text-gray-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestion des Documents</h2>
          <p className="text-gray-600">Centralisez et partagez tous vos documents</p>
        </div>
        <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Upload className="w-4 h-4 mr-2" />
              Uploader Document
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Uploader un nouveau document</DialogTitle>
              <DialogDescription>
                Ajoutez un document et définissez ses paramètres de partage
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="document" className="text-right">Fichier</Label>
                <Input id="document" type="file" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="doc-category" className="text-right">Catégorie</Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contrats">Contrats</SelectItem>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="listes">Listes</SelectItem>
                    <SelectItem value="musique">Musique</SelectItem>
                    <SelectItem value="photos">Photos</SelectItem>
                    <SelectItem value="factures">Factures</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sharing" className="text-right">Partage</Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Qui peut voir ce document ?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tout le monde</SelectItem>
                    <SelectItem value="couple">Couple seulement</SelectItem>
                    <SelectItem value="wedding-team">Équipe mariage</SelectItem>
                    <SelectItem value="vendors">Prestataires</SelectItem>
                    <SelectItem value="custom">Personnalisé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsUploadModalOpen(false)}>
                Annuler
              </Button>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                Uploader
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
            <div className="text-sm text-gray-600">Documents</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">5.1 MB</div>
            <div className="text-sm text-gray-600">Espace utilisé</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">6</div>
            <div className="text-sm text-gray-600">Catégories</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-amber-600">12</div>
            <div className="text-sm text-gray-600">Partages actifs</div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Filtrer par catégorie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">Tous</Button>
            <Button variant="outline" size="sm">Contrats</Button>
            <Button variant="outline" size="sm">Planning</Button>
            <Button variant="outline" size="sm">Listes</Button>
            <Button variant="outline" size="sm">Musique</Button>
            <Button variant="outline" size="sm">Photos</Button>
            <Button variant="outline" size="sm">Factures</Button>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <div className="grid gap-4">
        {documents.map((doc) => (
          <Card key={doc.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    {getFileIcon(doc.type)}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg">{doc.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={categoryColors[doc.category as keyof typeof categoryColors]}>
                        {doc.category}
                      </Badge>
                      <span className="text-sm text-gray-500">v{doc.version}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{doc.size}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Uploadé par {doc.uploadedBy} le {new Date(doc.uploadDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-600 mb-1">
                      Partagé avec {doc.shared.length} personne(s)
                    </div>
                    <div className="flex gap-1">
                      {doc.shared.slice(0, 3).map((role, index) => (
                        <div key={index} className="w-6 h-6 bg-purple-500 text-white rounded-full text-xs flex items-center justify-center">
                          {role.charAt(0).toUpperCase()}
                        </div>
                      ))}
                      {doc.shared.length > 3 && (
                        <div className="w-6 h-6 bg-gray-300 text-gray-600 rounded-full text-xs flex items-center justify-center">
                          +{doc.shared.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share className="w-4 h-4" />
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
