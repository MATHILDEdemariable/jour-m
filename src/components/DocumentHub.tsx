
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Document {
  id: string;
  name: string;
  type: string;
  category: string;
  size: string;
  uploadedBy: string;
  uploadDate: string;
  priority: 'high' | 'medium' | 'low';
}

const SAMPLE_DOCUMENTS: Document[] = [
  {
    id: '1',
    name: 'Wedding Timeline Final.pdf',
    type: 'PDF',
    category: 'Planning',
    size: '2.1 MB',
    uploadedBy: 'Patricia Wilson',
    uploadDate: '2024-06-01',
    priority: 'high'
  },
  {
    id: '2',
    name: 'Ceremony Music Playlist.mp3',
    type: 'Audio',
    category: 'Music',
    size: '45.2 MB',
    uploadedBy: 'Harmony Music',
    uploadDate: '2024-05-28',
    priority: 'high'
  },
  {
    id: '3',
    name: 'Bride Speech Notes.docx',
    type: 'Document',
    category: 'Speeches',
    size: '156 KB',
    uploadedBy: 'Sarah',
    uploadDate: '2024-06-02',
    priority: 'medium'
  },
  {
    id: '4',
    name: 'Vendor Contracts.zip',
    type: 'Archive',
    category: 'Legal',
    size: '8.7 MB',
    uploadedBy: 'Patricia Wilson',
    uploadDate: '2024-05-20',
    priority: 'medium'
  },
  {
    id: '5',
    name: 'Seating Chart Final.xlsx',
    type: 'Spreadsheet',
    category: 'Planning',
    size: '892 KB',
    uploadedBy: 'Wedding Planner',
    uploadDate: '2024-06-03',
    priority: 'high'
  }
];

const CATEGORY_COLORS = {
  'Planning': 'bg-purple-100 text-purple-800',
  'Music': 'bg-blue-100 text-blue-800',
  'Speeches': 'bg-green-100 text-green-800',
  'Legal': 'bg-red-100 text-red-800',
  'Photos': 'bg-yellow-100 text-yellow-800'
};

const TYPE_ICONS = {
  'PDF': '📄',
  'Audio': '🎵',
  'Document': '📝',
  'Archive': '📦',
  'Spreadsheet': '📊',
  'Image': '🖼️'
};

export const DocumentHub: React.FC = () => {
  const handleDownload = (documentId: string) => {
    console.log(`Downloading document ${documentId}`);
    // In a real app, this would trigger the download
  };

  const handleView = (documentId: string) => {
    console.log(`Viewing document ${documentId}`);
    // In a real app, this would open the document viewer
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Document Hub</h2>
        <Badge variant="secondary" className="text-xs">
          {SAMPLE_DOCUMENTS.length} files
        </Badge>
      </div>

      {/* Quick Access - High Priority Documents */}
      <div className="space-y-3">
        <h3 className="text-md font-medium text-purple-600 flex items-center gap-2">
          ⚡ Quick Access
        </h3>
        {SAMPLE_DOCUMENTS.filter(doc => doc.priority === 'high').map((document) => (
          <DocumentCard 
            key={document.id} 
            document={document} 
            onDownload={handleDownload}
            onView={handleView}
            isHighPriority={true}
          />
        ))}
      </div>

      {/* All Documents */}
      <div className="space-y-3">
        <h3 className="text-md font-medium text-gray-700">All Documents</h3>
        {SAMPLE_DOCUMENTS.filter(doc => doc.priority !== 'high').map((document) => (
          <DocumentCard 
            key={document.id} 
            document={document} 
            onDownload={handleDownload}
            onView={handleView}
            isHighPriority={false}
          />
        ))}
      </div>
    </div>
  );
};

interface DocumentCardProps {
  document: Document;
  onDownload: (id: string) => void;
  onView: (id: string) => void;
  isHighPriority: boolean;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, onDownload, onView, isHighPriority }) => {
  const categoryColor = CATEGORY_COLORS[document.category as keyof typeof CATEGORY_COLORS] || 'bg-gray-100 text-gray-800';
  const typeIcon = TYPE_ICONS[document.type as keyof typeof TYPE_ICONS] || '📄';

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
              <span>{document.size}</span>
              <span>•</span>
              <span>by {document.uploadedBy}</span>
              <span>•</span>
              <span>{new Date(document.uploadDate).toLocaleDateString()}</span>
            </div>

            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={() => onView(document.id)}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                👁️ View
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onDownload(document.id)}
                className="flex-1"
              >
                ⬇️ Download
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
