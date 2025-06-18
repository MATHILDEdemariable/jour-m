
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Download, ExternalLink, Folder, Eye } from 'lucide-react';
import { useLocalEventData } from '@/contexts/LocalEventDataContext';

export const ReadOnlyDocumentsList = () => {
  const { documents, getDocumentStats } = useLocalEventData();
  const stats = getDocumentStats();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'contrat': 'bg-blue-100 text-blue-800',
      'facture': 'bg-green-100 text-green-800',
      'photo': 'bg-purple-100 text-purple-800',
      'planning': 'bg-yellow-100 text-yellow-800',
      'autre': 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors['autre'];
  };

  const handleDocumentAction = (document: any) => {
    if (document.google_drive_url) {
      window.open(document.google_drive_url, '_blank');
    } else if (document.file_url || document.url) {
      window.open(document.file_url || document.url, '_blank');
    }
  };

  if (documents.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun document</h3>
          <p className="text-gray-500">
            Les documents apparaîtront ici une fois ajoutés.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Grouper par catégorie
  const documentsByCategory = documents.reduce((acc, doc) => {
    const category = doc.category || 'autre';
    if (!acc[category]) acc[category] = [];
    acc[category].push(doc);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <FileText className="w-5 h-5 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-900">Documents</h2>
        <Badge variant="outline" className="bg-indigo-50 text-indigo-700">
          {documents.length} document{documents.length > 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600">{stats.totalDocuments}</p>
            <p className="text-sm text-gray-600">Documents</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600">{stats.categoriesCount}</p>
            <p className="text-sm text-gray-600">Catégories</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600">{stats.googleDriveCount}</p>
            <p className="text-sm text-gray-600">Google Drive</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600">{formatFileSize(stats.totalSize)}</p>
            <p className="text-sm text-gray-600">Taille totale</p>
          </div>
        </Card>
      </div>

      {/* Documents par catégorie */}
      <div className="space-y-6">
        {Object.entries(documentsByCategory).map(([category, categoryDocs]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Folder className="w-5 h-5 text-indigo-600" />
                {category.charAt(0).toUpperCase() + category.slice(1)}
                <Badge className={getCategoryColor(category)}>
                  {categoryDocs.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryDocs.map((document) => (
                  <Card key={document.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <FileText className="w-8 h-8 text-indigo-600 flex-shrink-0 mt-1" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{document.name}</h4>
                          {document.description && (
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {document.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            {document.source === 'google_drive' && (
                              <Badge variant="outline" className="text-xs">
                                Google Drive
                              </Badge>
                            )}
                            {document.file_size && (
                              <span className="text-xs text-gray-500">
                                {formatFileSize(document.file_size)}
                              </span>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-3"
                            onClick={() => handleDocumentAction(document)}
                          >
                            {document.google_drive_url ? (
                              <>
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Ouvrir
                              </>
                            ) : (
                              <>
                                <Eye className="w-3 h-3 mr-1" />
                                Voir
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
