
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, Download, Share, Trash2, Eye, Plus, Cloud, Filter } from 'lucide-react';
import { useDocuments, Document } from '@/hooks/useDocuments';
import { GoogleDriveIntegration } from './GoogleDriveIntegration';
import { DocumentPreview } from './DocumentPreview';

export const DocumentManagement = () => {
  const { documents, loading, uploadDocument, deleteDocument, getStats } = useDocuments();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterSource, setFilterSource] = useState<string>('all');

  // État pour l'upload
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');

  const stats = getStats();

  const categories = [
    'Contrats', 'Planning', 'Listes', 'Musique', 'Photos', 'Factures', 'Légal', 'Communications'
  ];

  const categoryColors = {
    "Contrats": "bg-blue-100 text-blue-800",
    "Planning": "bg-purple-100 text-purple-800",
    "Listes": "bg-green-100 text-green-800",
    "Musique": "bg-pink-100 text-pink-800",
    "Photos": "bg-amber-100 text-amber-800",
    "Factures": "bg-red-100 text-red-800",
    "Légal": "bg-gray-100 text-gray-800",
    "Communications": "bg-indigo-100 text-indigo-800"
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadFile(file);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile || !uploadCategory) return;

    try {
      await uploadDocument(uploadFile, uploadCategory, uploadDescription);
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setUploadCategory('');
      setUploadDescription('');
    } catch (error) {
      console.error('Error uploading:', error);
    }
  };

  const handlePreview = (document: Document) => {
    setSelectedDocument(document);
    setIsPreviewOpen(true);
  };

  const handleDelete = async (documentId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      await deleteDocument(documentId);
    }
  };

  const getFileIcon = (mimeType: string | null) => {
    return <FileText className="w-5 h-5 text-gray-500" />;
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Filtrer les documents
  const filteredDocuments = documents.filter(doc => {
    const categoryMatch = filterCategory === 'all' || doc.category === filterCategory;
    const sourceMatch = filterSource === 'all' || doc.source === filterSource;
    return categoryMatch && sourceMatch;
  });

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
                Ajoutez un document et définissez ses paramètres
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="document" className="text-right">Fichier</Label>
                <Input 
                  id="document" 
                  type="file" 
                  className="col-span-3" 
                  onChange={handleFileUpload}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="doc-category" className="text-right">Catégorie</Label>
                <Select value={uploadCategory} onValueChange={setUploadCategory}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea 
                  id="description"
                  placeholder="Description du document (optionnel)"
                  className="col-span-3"
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsUploadModalOpen(false)}>
                Annuler
              </Button>
              <Button 
                onClick={handleUpload}
                disabled={!uploadFile || !uploadCategory}
                className="bg-gradient-to-r from-purple-600 to-pink-600"
              >
                Uploader
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.totalDocuments}</div>
            <div className="text-sm text-gray-600">Documents</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{formatFileSize(stats.totalSize)}</div>
            <div className="text-sm text-gray-600">Espace utilisé</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.categoriesCount}</div>
            <div className="text-sm text-gray-600">Catégories</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-amber-600">{stats.manualCount}</div>
            <div className="text-sm text-gray-600">Upload manuel</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-indigo-600">{stats.googleDriveCount}</div>
            <div className="text-sm text-gray-600">Google Drive</div>
          </CardContent>
        </Card>
      </div>

      {/* Intégration Google Drive */}
      <GoogleDriveIntegration />

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="filter-category">Catégorie</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label htmlFor="filter-source">Source</Label>
              <Select value={filterSource} onValueChange={setFilterSource}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les sources</SelectItem>
                  <SelectItem value="manual">Upload manuel</SelectItem>
                  <SelectItem value="google_drive">Google Drive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des documents */}
      <div className="grid gap-4">
        {loading ? (
          <Card>
            <CardContent className="p-6 text-center">
              Chargement des documents...
            </CardContent>
          </Card>
        ) : filteredDocuments.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              Aucun document trouvé pour les filtres sélectionnés
            </CardContent>
          </Card>
        ) : (
          filteredDocuments.map((doc) => (
            <Card key={doc.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      {getFileIcon(doc.mime_type)}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg">{doc.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {doc.category && (
                          <Badge className={categoryColors[doc.category as keyof typeof categoryColors] || categoryColors.Légal}>
                            {doc.category}
                          </Badge>
                        )}
                        <Badge variant={doc.source === 'google_drive' ? 'default' : 'outline'}>
                          {doc.source === 'google_drive' ? (
                            <>
                              <Cloud className="w-3 h-3 mr-1" />
                              Google Drive
                            </>
                          ) : 'Upload manuel'}
                        </Badge>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{formatFileSize(doc.file_size)}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {doc.description || 'Aucune description'}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Uploadé par {doc.uploaded_by} le {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handlePreview(doc)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => window.open(doc.file_url, '_blank')}>
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(doc.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal d'aperçu */}
      <DocumentPreview
        document={selectedDocument}
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setSelectedDocument(null);
        }}
      />
    </div>
  );
};
