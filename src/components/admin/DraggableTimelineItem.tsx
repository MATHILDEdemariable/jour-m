
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash2, Clock, Users, GripVertical } from 'lucide-react';
import { TimelineItem } from '@/hooks/useTimelineItems';

interface DraggableTimelineItemProps {
  item: TimelineItem;
  index: number;
  onEdit: (item: TimelineItem) => void;
  onDelete: (id: string) => void;
  categoryColors: Record<string, string>;
  statusColors: Record<string, string>;
  formatDuration: (minutes: number) => string;
  calculateEndTime: (startTime: string, duration: number) => string;
  getPersonName: (personId: string | null) => string | null;
  getStatusLabel: (status: string) => string;
  isDragging: boolean;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
}

export const DraggableTimelineItem: React.FC<DraggableTimelineItemProps> = ({
  item,
  index,
  onEdit,
  onDelete,
  categoryColors,
  statusColors,
  formatDuration,
  calculateEndTime,
  getPersonName,
  getStatusLabel,
  isDragging,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  const endTime = calculateEndTime(item.time, item.duration);
  const personName = getPersonName(item.assigned_person_id);

  return (
    <Card 
      className={`transition-all duration-200 hover:shadow-md border-stone-200 ${isDragging ? 'opacity-50' : ''}`}
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Drag Handle */}
          <div className="flex flex-col items-center cursor-move">
            <GripVertical className="w-5 h-5 text-stone-400" />
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm mt-2">
              {item.time}
            </div>
          </div>
          
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-stone-800">{item.title}</h4>
                <Badge className={categoryColors[item.category] || categoryColors["Préparation"]}>
                  {item.category}
                </Badge>
                <Badge className={statusColors[item.status]}>
                  {getStatusLabel(item.status)}
                </Badge>
                {item.priority === 'high' && (
                  <Badge variant="destructive" className="text-xs">
                    🔴 Urgent
                  </Badge>
                )}
              </div>
              <Badge variant="outline" className="text-xs border-purple-200 text-purple-700">
                {item.time} - {endTime}
              </Badge>
            </div>
            
            {/* Description */}
            {item.description && (
              <p className="text-sm text-stone-600 mb-3">{item.description}</p>
            )}
            
            {/* Details */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-stone-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDuration(item.duration)}
                </div>
                {personName && (
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{personName}</span>
                  </div>
                )}
                {item.assigned_role && !personName && (
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{item.assigned_role.replace('-', ' ')}</span>
                  </div>
                )}
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(item)}
                  className="h-8 w-8 p-0 hover:bg-stone-100"
                >
                  <Edit className="w-3 h-3" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-red-50 text-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer "{item.title}" ? 
                        Cette action est irréversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(item.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            {/* Notes */}
            {item.notes && (
              <div className="mt-2 p-2 bg-stone-50 rounded text-xs text-stone-600">
                <strong>Note:</strong> {item.notes}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
