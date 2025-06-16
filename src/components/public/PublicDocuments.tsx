
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Download, ExternalLink, Folder } from 'lucide-react';

interface PublicDocumentsProps {
  documents: any[];
  selectedPersonId: string | null;
}

export const PublicDocuments: React.FC<PublicDocumentsProps> = ({
  documents,
  selectedPersonId
}) => {
  // Filtrer les documents selon la personne sélectionnée
  const filteredDocuments = selectedPersonId 
    ? documents.filter(doc => doc.assigned_to && doc.assigned_to.includes(selectedPersonId))
    : documents;

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Taille inconnue';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string | null) => {
    if (!mimeType) return <FileText className="w-4 h-4" />;
    
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return '📊';
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return '📈';
    
    return <FileText className="w-4 h-4" />;
  };

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'google_drive':
        return <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">📁 Google Drive</Badge>;
      case 'manual':
        return <Badge variant="outline" className="text-xs border-green-200 text-green-700">📎 Manuel</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{source}</Badge>;
    }
  };

  const handleDownload = (document: any) => {
    // Pour les documents publics, on génère l'URL de téléchargement
    // Note: En production, il faudrait un endpoint sécurisé pour générer des URLs temporaires
    const downloadUrl = `https://sceapjnljmuuvgugqrsd.supabase.co/storage/v1/object/public/documents/${document.file_path}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = document.name;
    link.click();
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
              <Folder className="w-5 h-5 text-purple-500" />
              Documents
              {selectedPersonId && ' - Assignés'}
            </CardTitle>
            <p className="text-sm text-gray-600">
              {selectedPersonId 
                ? 'Documents assignés à la personne sélectionnée' 
                : 'Tous les documents de l\'événement'
              }
            </p>
          </div>
          <Badge variant="outline" className="border-purple-200 text-purple-700">
            {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Folder className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>
              {selectedPersonId 
                ? 'Aucun document assigné à cette personne' 
                : 'Aucun document disponible'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDocuments.map((document) => (
              <div 
                key={document.id} 
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all"
              >
                {/* File Icon */}
                <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center border">
                  {typeof getFileIcon(document.mime_type) === 'string' ? (
                    <span className="text-lg">{getFileIcon(document.mime_type)}</span>
                  ) : (
                    getFileIcon(document.mime_type)
                  )}
                </div>
                
                {/* Document Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900 truncate">{document.name}</h4>
                    {getSourceBadge(document.source)}
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{formatFileSize(document.file_size)}</span>
                    <span>•</span>
                    <span>Ajouté le {new Date(document.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(document)}
                    className="h-8 w-8 p-0"
                    title="Télécharger"
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`https://sceapjnljmuuvgugqrsd.supabase.co/storage/v1/object/public/documents/${document.file_path}`, '_blank')}
                    className="h-8 w-8 p-0"
                    title="Ouvrir"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
