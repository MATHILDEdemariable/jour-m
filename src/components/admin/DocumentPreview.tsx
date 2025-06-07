
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, ExternalLink, FileText, Image, Music, Video, Archive } from 'lucide-react';
import { Document } from '@/hooks/useDocuments';

interface DocumentPreviewProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ document, isOpen, onClose }) => {
  if (!document) return null;

  const getFileIcon = (mimeType: string | null) => {
    if (!mimeType) return <FileText className="w-5 h-5" />;
    
    if (mimeType.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (mimeType.startsWith('video/')) return <Video className="w-5 h-5" />;
    if (mimeType.startsWith('audio/')) return <Music className="w-5 h-5" />;
    if (mimeType.includes('zip') || mimeType.includes('rar')) return <Archive className="w-5 h-5" />;
    
    return <FileText className="w-5 h-5" />;
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Taille inconnue';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const canPreview = document.mime_type?.startsWith('image/') || 
                    document.mime_type === 'application/pdf' ||
                    document.source === 'google_drive';

  const handleDownload = () => {
    if (document.file_url) {
      const link = window.document.createElement('a');
      link.href = document.file_url;
      link.download = document.name;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    }
  };

  const handleOpenExternal = () => {
    if (document.google_drive_url) {
      window.open(document.google_drive_url, '_blank');
    } else if (document.file_url) {
      window.open(document.file_url, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {getFileIcon(document.mime_type)}
            <div className="flex-1">
              <DialogTitle className="text-left">{document.name}</DialogTitle>
              <DialogDescription className="text-left">
                {document.description || 'Aucune description'}
              </DialogDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-2 pt-2">
            {document.category && (
              <Badge variant="secondary">{document.category}</Badge>
            )}
            <Badge variant={document.source === 'google_drive' ? 'default' : 'outline'}>
              {document.source === 'google_drive' ? 'Google Drive' : 'Upload manuel'}
            </Badge>
            <span className="text-sm text-gray-500">{formatFileSize(document.file_size)}</span>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Zone d'aperçu */}
          <div className="bg-gray-50 rounded-lg p-4 min-h-[300px] flex items-center justify-center">
            {canPreview ? (
              <div className="w-full">
                {document.mime_type?.startsWith('image/') && (
                  <img 
                    src={document.file_url} 
                    alt={document.name}
                    className="max-w-full max-h-[400px] mx-auto rounded"
                  />
                )}
                
                {document.mime_type === 'application/pdf' && (
                  <iframe
                    src={document.file_url}
                    className="w-full h-[400px] border-0 rounded"
                    title={document.name}
                  />
                )}
                
                {document.source === 'google_drive' && document.preview_url && (
                  <iframe
                    src={document.preview_url}
                    className="w-full h-[400px] border-0 rounded"
                    title={document.name}
                  />
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Aperçu non disponible pour ce type de fichier</p>
                <p className="text-sm">{document.mime_type || 'Type inconnu'}</p>
              </div>
            )}
          </div>

          {/* Métadonnées */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Uploadé par :</span>
              <p className="text-gray-600">{document.uploaded_by || 'Inconnu'}</p>
            </div>
            <div>
              <span className="font-medium">Date d'upload :</span>
              <p className="text-gray-600">
                {new Date(document.created_at).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div>
              <span className="font-medium">Type de fichier :</span>
              <p className="text-gray-600">{document.mime_type || 'Inconnu'}</p>
            </div>
            <div>
              <span className="font-medium">Taille :</span>
              <p className="text-gray-600">{formatFileSize(document.file_size)}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={handleDownload} variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Télécharger
            </Button>
            <Button onClick={handleOpenExternal} variant="outline" className="flex-1">
              <ExternalLink className="w-4 h-4 mr-2" />
              Ouvrir dans un nouvel onglet
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
