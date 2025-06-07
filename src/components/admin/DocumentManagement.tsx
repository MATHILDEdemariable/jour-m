
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Link, Upload, X, FileText, Download, Trash2, Eye } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { useEventDocuments } from '@/hooks/useEventDocuments';
import { convertGoogleDriveUrl, isValidGoogleDriveUrl } from '@/utils/googleDriveUtils';
import { useToast } from '@/hooks/use-toast';

export const DocumentManagement = () => {
  const { currentEvent, updateEventGoogleDriveUrl } = useEvents();
  const { documents, uploading, uploadDocuments, deleteDocument, getDocumentUrl } = useEventDocuments(currentEvent?.id || null);
  const { toast } = useToast();
  
  const [googleDriveUrl, setGoogleDriveUrl] = useState(currentEvent?.google_drive_url || '');
  const [showIframe, setShowIframe] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGoogleDriveUrlChange = (value: string) => {
    setGoogleDriveUrl(value);
    setShowIframe(isValidGoogleDriveUrl(value));
    
    // Auto-save after typing stops
    const timeoutId = setTimeout(() => {
      if (currentEvent && value !== currentEvent.google_drive_url) {
        updateEventGoogleDriveUrl(currentEvent.id, value);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  };

  const handleClearUrl = () => {
    setGoogleDriveUrl('');
    setShowIframe(false);
    if (currentEvent) {
      updateEventGoogleDriveUrl(currentEvent.id, '');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      uploadDocuments(files);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDownloadDocument = (document: any) => {
    const url = getDocumentUrl(document.file_path);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = document.name;
    link.click();
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string | null) => {
    if (!mimeType) return '📄';
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.includes('pdf')) return '📋';
    if (mimeType.includes('word') || mimeType.includes('doc')) return '📝';
    if (mimeType.includes('excel') || mimeType.includes('sheet')) return '📊';
    return '📄';
  };

  if (!currentEvent) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-gray-500">
          <p>Aucun événement sélectionné</p>
          <p className="text-sm">Veuillez sélectionner un événement dans la configuration</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestion des Documents</h2>
          <p className="text-gray-600">Centralisez vos documents pour {currentEvent.name}</p>
        </div>
        <Badge variant="outline" className="text-sm">
          {documents.length} document(s)
        </Badge>
      </div>

      {/* Section URL Google Drive */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="w-5 h-5 text-blue-600" />
            Lien Google Drive
          </CardTitle>
          <CardDescription>
            Collez votre lien Google Drive pour un accès direct à vos documents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="google-drive-url">URL Google Drive</Label>
              <div className="relative">
                <Input
                  id="google-drive-url"
                  type="url"
                  placeholder="Collez votre lien Google Drive ici..."
                  value={googleDriveUrl}
                  onChange={(e) => handleGoogleDriveUrlChange(e.target.value)}
                  className="pr-10"
                />
                {googleDriveUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearUrl}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {!isValidGoogleDriveUrl(googleDriveUrl) && googleDriveUrl && (
            <p className="text-sm text-amber-600">
              ⚠️ URL non reconnue. Utilisez un lien Google Drive valide.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Section iframe Google Drive */}
      {showIframe && googleDriveUrl && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-600" />
              Aperçu Google Drive
            </CardTitle>
            <CardDescription>
              Accès direct à vos documents Google Drive
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <iframe
                src={convertGoogleDriveUrl(googleDriveUrl)}
                className="w-full h-[500px] border-0"
                title="Google Drive Preview"
                loading="lazy"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section Upload Manuel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-purple-600" />
            Import Manuel
          </CardTitle>
          <CardDescription>
            Uploadez vos documents directement sur la plateforme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-600 mb-2">
                📁 Ajouter des documents
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Cliquez ici ou glissez-déposez vos fichiers
              </p>
              <p className="text-xs text-gray-400">
                Formats acceptés : PDF, DOC, DOCX, XLS, XLSX, JPG, JPEG, PNG
              </p>
              <Button 
                variant="outline" 
                disabled={uploading}
                className="mt-4"
              >
                {uploading ? 'Upload en cours...' : 'Choisir des fichiers'}
              </Button>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.xlsx,.xls,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Liste des documents uploadés */}
      {documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Documents Uploadés
            </CardTitle>
            <CardDescription>
              Gérez vos documents uploadés localement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {documents.map((document) => (
                <div key={document.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {getFileIcon(document.mime_type)}
                    </div>
                    <div>
                      <h4 className="font-medium">{document.name}</h4>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span>{formatFileSize(document.file_size)}</span>
                        <span>•</span>
                        <span>{new Date(document.created_at).toLocaleDateString('fr-FR')}</span>
                        <Badge variant="outline" className="text-xs">
                          Upload manuel
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const url = getDocumentUrl(document.file_path);
                        window.open(url, '_blank');
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadDocument(document)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
                          deleteDocument(document.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
