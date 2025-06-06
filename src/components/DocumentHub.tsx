
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSharedEventData } from '@/hooks/useSharedEventData';

const CATEGORY_COLORS = {
  'Planning': 'bg-purple-100 text-purple-800',
  'Music': 'bg-blue-100 text-blue-800',
  'Speeches': 'bg-green-100 text-green-800',
  'Legal': 'bg-red-100 text-red-800',
  'Photos': 'bg-yellow-100 text-yellow-800',
  'Contract': 'bg-red-100 text-red-800',
  'Invoice': 'bg-orange-100 text-orange-800',
  'Other': 'bg-gray-100 text-gray-800'
};

const TYPE_ICONS = {
  'PDF': '📄',
  'Audio': '🎵',
  'Document': '📝',
  'Archive': '📦',
  'Spreadsheet': '📊',
  'Image': '🖼️',
  'Video': '🎥',
  'application/pdf': '📄',
  'image/': '🖼️',
  'audio/': '🎵',
  'video/': '🎥'
};

export const DocumentHub: React.FC = () => {
  const { loading } = useSharedEventData();

  // Pour l'instant, nous utilisons des données d'exemple car le système de documents
  // n'est pas encore complètement intégré avec la base de données
  const sampleDocuments = [
    {
      id: '1',
      name: 'Planning Final.pdf',
      file_type: 'application/pdf',
      category: 'Planning',
      file_size: 2100000,
      uploaded_by: 'Wedding Planner',
      created_at: '2024-06-01T10:00:00Z'
    },
    {
      id: '2',
      name: 'Contrat Traiteur.pdf',
      file_type: 'application/pdf',
      category: 'Legal',
      file_size: 1500000,
      uploaded_by: 'Admin',
      created_at: '2024-05-28T14:30:00Z'
    },
    {
      id: '3',
      name: 'Plan de Table.xlsx',
      file_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      category: 'Planning',
      file_size: 850000,
      uploaded_by: 'Wedding Planner',
      created_at: '2024-06-02T16:15:00Z'
    }
  ];

  const handleDownload = (documentId: string) => {
    console.log(`Downloading document ${documentId}`);
    // Dans une vraie app, cela déclencherait le téléchargement
  };

  const handleView = (documentId: string) => {
    console.log(`Viewing document ${documentId}`);
    // Dans une vraie app, cela ouvrirait le visualiseur de documents
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTypeIcon = (fileType: string) => {
    for (const [type, icon] of Object.entries(TYPE_ICONS)) {
      if (fileType.includes(type)) return icon;
    }
    return '📄';
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
          <p className="text-purple-600">Chargement des documents...</p>
        </div>
      </div>
    );
  }

  const highPriorityDocs = sampleDocuments.filter(doc => 
    doc.category === 'Planning' || doc.category === 'Legal'
  );
  const otherDocs = sampleDocuments.filter(doc => 
    doc.category !== 'Planning' && doc.category !== 'Legal'
  );

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Documents</h2>
        <Badge variant="secondary" className="text-xs">
          {sampleDocuments.length} fichiers
        </Badge>
      </div>

      {/* Quick Access - High Priority Documents */}
      {highPriorityDocs.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-md font-medium text-purple-600 flex items-center gap-2">
            ⚡ Accès rapide
          </h3>
          {highPriorityDocs.map((document) => (
            <DocumentCard 
              key={document.id} 
              document={document} 
              onDownload={handleDownload}
              onView={handleView}
              isHighPriority={true}
              formatFileSize={formatFileSize}
              getTypeIcon={getTypeIcon}
            />
          ))}
        </div>
      )}

      {/* All Documents */}
      {otherDocs.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-md font-medium text-gray-700">Autres documents</h3>
          {otherDocs.map((document) => (
            <DocumentCard 
              key={document.id} 
              document={document} 
              onDownload={handleDownload}
              onView={handleView}
              isHighPriority={false}
              formatFileSize={formatFileSize}
              getTypeIcon={getTypeIcon}
            />
          ))}
        </div>
      )}

      {sampleDocuments.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Aucun document trouvé</p>
          <p className="text-xs mt-2">Les documents ajoutés dans l'admin apparaîtront ici</p>
        </div>
      )}
    </div>
  );
};

interface DocumentCardProps {
  document: any;
  onDownload: (id: string) => void;
  onView: (id: string) => void;
  isHighPriority: boolean;
  formatFileSize: (bytes: number) => string;
  getTypeIcon: (fileType: string) => string;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ 
  document, 
  onDownload, 
  onView, 
  isHighPriority,
  formatFileSize,
  getTypeIcon
}) => {
  const categoryColor = CATEGORY_COLORS[document.category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.Other;
  const typeIcon = getTypeIcon(document.file_type);

  return (
    <Card className={`hover:shadow-md transition-all ${isHighPriority ? 'border-l-4 border-l-purple-500 bg-purple-50' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">{typeIcon}</div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium truncate">{document.name}</h3>
              <Badge className={categoryColor} variant="secondary">
                {document.category}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
              <span>{formatFileSize(document.file_size)}</span>
              <span>•</span>
              <span>par {document.uploaded_by}</span>
              <span>•</span>
              <span>{new Date(document.created_at).toLocaleDateString('fr-FR')}</span>
            </div>

            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={() => onView(document.id)}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                👁️ Voir
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onDownload(document.id)}
                className="flex-1"
              >
                ⬇️ Télécharger
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
