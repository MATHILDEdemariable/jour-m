import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Upload, FileText, Eye, Download, Trash2, Link2, Users, Search, Filter, ExternalLink, RefreshCw } from 'lucide-react';
import { useEventDocuments } from '@/hooks/useEventDocuments';
import { useEvents } from '@/hooks/useEvents';
import { usePeople } from '@/hooks/usePeople';
import { DocumentAssignmentModal } from './DocumentAssignmentModal';
import { convertGoogleDriveUrl, convertToNavigableGoogleDriveUrl, isValidGoogleDriveUrl } from '@/utils/googleDriveUtils';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

export const DocumentManagement = () => {
  const { currentEvent, updateEventGoogleDriveUrl } = useEvents();
  const { people } = usePeople();
  const { 
    documents, 
    uploading, 
    uploadDocuments, 
    updateDocumentAssignment,
    deleteDocument, 
    getDocumentUrl 
  } = useEventDocuments(currentEvent?.id || null);
  
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [googleDriveUrl, setGoogleDriveUrl] = useState(currentEvent?.google_drive_url || '');
  const [iframeLoading, setIframeLoading] = useState(true);
  const [assignmentModal, setAssignmentModal] = useState<{
    isOpen: boolean;
    documentId: string;
    documentName: string;
    currentAssignment: string[];
  }>({
    isOpen: false,
    documentId: '',
    documentName: '',
    currentAssignment: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAssignment, setFilterAssignment] = useState<string>('all');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      uploadDocuments(files);
    }
  };

  const handleGoogleDriveSubmit = async () => {
    if (!currentEvent?.id) return;
    
    if (googleDriveUrl && !isValidGoogleDriveUrl(googleDriveUrl)) {
      toast({
        title: 'URL invalide',
        description: 'Veuillez entrer une URL Google Drive valide',
        variant: 'destructive',
      });
      return;
    }
    
    await updateEventGoogleDriveUrl(currentEvent.id, googleDriveUrl);
  };

  const handleAssignDocument = (documentId: string, documentName: string, currentAssignment: string[]) => {
    setAssignmentModal({
      isOpen: true,
      documentId,
      documentName,
      currentAssignment
    });
  };

  const handleSaveAssignment = (assignedTo: string[]) => {
    updateDocumentAssignment(assignmentModal.documentId, assignedTo);
    setAssignmentModal(prev => ({ ...prev, isOpen: false }));
  };

  const getPersonName = (personId: string) => {
    const person = people.find(p => p.id === personId);
    return person?.name || 'Personne inconnue';
  };

  const handleIframeLoad = () => {
    setIframeLoading(false);
  };

  const refreshIframe = () => {
    setIframeLoading(true);
    // Force iframe refresh by updating src
    const iframe = document.getElementById('google-drive-iframe') as HTMLIFrameElement;
    if (iframe && currentEvent?.google_drive_url) {
      iframe.src = convertToNavigableGoogleDriveUrl(currentEvent.google_drive_url);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAssignment = filterAssignment === 'all' || 
      (filterAssignment === 'assigned' && doc.assigned_to && doc.assigned_to.length > 0) ||
      (filterAssignment === 'unassigned' && (!doc.assigned_to || doc.assigned_to.length === 0)) ||
      (doc.assigned_to && doc.assigned_to.includes(filterAssignment));
    
    return matchesSearch && matchesAssignment;
  });

  const assignmentOptions = [
    { value: 'all', label: 'Tous les documents' },
    { value: 'assigned', label: 'Documents assignés' },
    { value: 'unassigned', label: 'Documents non assignés' },
    ...people.map(person => ({ value: person.id, label: person.name }))
  ];

  return (
    <div className="space-y-4 md:space-y-6 p-2 md:p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-stone-900">Gestion des Documents</h2>
          <p className="text-sm md:text-base text-stone-600">Gérez les documents avec intégration Google Drive et assignation</p>
        </div>
      </div>

      {/* Google Drive Integration - Amélioration mobile */}
      <Card className="border-stone-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-stone-800 text-lg md:text-xl">
            <Link2 className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
            Intégration Google Drive
          </CardTitle>
          <CardDescription className="text-sm">
            Connectez un dossier Google Drive pour centraliser tous vos documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 md:flex-row md:gap-2">
            <Input
              placeholder="URL du dossier Google Drive..."
              value={googleDriveUrl}
              onChange={(e) => setGoogleDriveUrl(e.target.value)}
              className="flex-1 text-sm md:text-base"
            />
            <Button 
              onClick={handleGoogleDriveSubmit}
              className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto"
              size={isMobile ? "sm" : "default"}
            >
              {isMobile ? 'Connecter' : 'Connecter'}
            </Button>
          </div>
          {currentEvent?.google_drive_url && (
            <div className="mt-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-blue-900 text-sm md:text-base">
                    Google Drive - Navigation complète
                  </h4>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={refreshIframe}
                      className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      {isMobile ? '' : 'Actualiser'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(currentEvent.google_drive_url, '_blank')}
                      className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      {isMobile ? '' : 'Ouvrir'}
                    </Button>
                  </div>
                </div>
                <div className="relative">
                  {iframeLoading && (
                    <div className="absolute inset-0 bg-blue-50 flex items-center justify-center rounded border border-blue-200">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                        <p className="text-blue-700 text-sm">Chargement de Google Drive...</p>
                      </div>
                    </div>
                  )}
                  <iframe
                    id="google-drive-iframe"
                    src={convertToNavigableGoogleDriveUrl(currentEvent.google_drive_url)}
                    width="100%"
                    height={isMobile ? "400" : "500"}
                    className="border border-blue-200 rounded"
                    title="Google Drive - Navigation complète"
                    onLoad={handleIframeLoad}
                    allow="fullscreen"
                    style={{ minHeight: isMobile ? '400px' : '500px' }}
                  />
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  💡 Vous pouvez naviguer, ouvrir et télécharger vos fichiers directement depuis cette interface
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Documents - responsive */}
      <Card className="border-stone-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-stone-800 text-lg md:text-xl">
            <Upload className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
            Upload de Documents
          </CardTitle>
          <CardDescription className="text-sm">
            Uploadez des documents directement sur la plateforme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-stone-300 rounded-lg p-4 md:p-8 text-center">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              disabled={uploading}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="w-8 h-8 md:w-12 md:h-12 text-stone-400 mx-auto mb-4" />
              <p className="text-stone-600 mb-2 text-sm md:text-base">
                {uploading ? 'Upload en cours...' : 'Cliquez pour sélectionner des fichiers'}
              </p>
              <p className="text-xs text-stone-500">PDF, Images, Documents Office acceptés</p>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters - responsive */}
      <Card className="border-stone-200">
        <CardContent className="pt-4 md:pt-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
              <Input
                placeholder="Rechercher un document..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-stone-300 focus:border-purple-500 text-sm md:text-base"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="text-stone-500 w-4 h-4" />
              <select
                value={filterAssignment}
                onChange={(e) => setFilterAssignment(e.target.value)}
                className="px-3 py-2 border border-stone-300 rounded-md focus:border-purple-500 focus:outline-none bg-white text-stone-700 text-sm w-full md:w-auto"
              >
                {assignmentOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents List - responsive */}
      <Card className="border-stone-200">
        <CardHeader>
          <CardTitle className="text-stone-800 text-lg md:text-xl">Documents Uploadés</CardTitle>
          <CardDescription className="text-sm">
            {filteredDocuments.length} document(s) • Cliquez sur "Assigner" pour affecter à des personnes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-6 md:py-8 text-stone-500">
              <FileText className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm md:text-base">Aucun document trouvé</p>
              <p className="text-xs mt-2">Uploadez des documents ou modifiez vos filtres</p>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {filteredDocuments.map((document) => (
                <div key={document.id} className="flex flex-col md:flex-row md:items-center justify-between p-3 md:p-4 border border-stone-200 rounded-lg hover:bg-stone-50">
                  <div className="flex items-center gap-3 mb-3 md:mb-0 flex-1">
                    <FileText className="w-6 h-6 md:w-8 md:h-8 text-stone-500" />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-stone-800 text-sm md:text-base truncate">{document.name}</h4>
                      <div className="flex flex-wrap items-center gap-1 md:gap-2 text-xs text-stone-500">
                        <span>
                          {document.file_size ? `${Math.round(document.file_size / 1024)} KB` : 'Taille inconnue'}
                        </span>
                        <span>•</span>
                        <span>{new Date(document.created_at).toLocaleDateString('fr-FR')}</span>
                        {document.assigned_to && document.assigned_to.length > 0 && (
                          <>
                            <span className="hidden md:inline">•</span>
                            <Badge variant="outline" className="text-xs">
                              {document.assigned_to.length} assignation(s)
                            </Badge>
                          </>
                        )}
                      </div>
                      {document.assigned_to && document.assigned_to.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {document.assigned_to.slice(0, isMobile ? 2 : 3).map(personId => (
                            <Badge key={personId} variant="secondary" className="text-xs">
                              {getPersonName(personId)}
                            </Badge>
                          ))}
                          {document.assigned_to.length > (isMobile ? 2 : 3) && (
                            <Badge variant="secondary" className="text-xs">
                              +{document.assigned_to.length - (isMobile ? 2 : 3)}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className={`flex ${isMobile ? 'justify-between' : 'items-center gap-2'}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAssignDocument(
                        document.id, 
                        document.name, 
                        document.assigned_to || []
                      )}
                      className="flex items-center gap-1"
                    >
                      <Users className="w-3 h-3" />
                      {isMobile ? '' : 'Assigner'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(getDocumentUrl(document.file_path), '_blank')}
                      className="flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      {isMobile ? '' : 'Voir'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const link = window.document.createElement('a');
                        link.href = getDocumentUrl(document.file_path);
                        link.download = document.name;
                        link.click();
                      }}
                      className="flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      {isMobile ? '' : 'Télécharger'}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer "{document.name}" ? 
                            Cette action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteDocument(document.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <DocumentAssignmentModal
        isOpen={assignmentModal.isOpen}
        onClose={() => setAssignmentModal(prev => ({ ...prev, isOpen: false }))}
        onSave={handleSaveAssignment}
        currentAssignment={assignmentModal.currentAssignment}
        documentName={assignmentModal.documentName}
      />
    </div>
  );
};
