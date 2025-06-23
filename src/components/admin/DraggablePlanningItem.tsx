
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Edit, Trash2, Users } from 'lucide-react';
import { PlanningItem } from '@/hooks/usePlanningItems';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface DraggablePlanningItemProps {
  item: PlanningItem;
  index: number;
  onEdit: (item: PlanningItem) => void;
  onDelete: (id: number) => void;
  categoryColors: Record<string, string>;
  formatDuration: (minutes: number) => string;
  calculateEndTime: (startTime: string, duration: number) => string;
  isDragging?: boolean;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  availablePeople: string[];
}

export const DraggablePlanningItem: React.FC<DraggablePlanningItemProps> = ({
  item,
  index,
  onEdit,
  onDelete,
  categoryColors,
  formatDuration,
  calculateEndTime,
  isDragging = false,
  onDragStart,
  onDragOver,
  onDrop,
  availablePeople
}) => {
  const endTime = calculateEndTime(item.time, item.duration);

  return (
    <div
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
      className={`flex items-start gap-4 p-4 border rounded-lg transition-all cursor-move
        ${isDragging ? 'opacity-50 scale-95 rotate-2' : 'hover:bg-stone-50 hover:shadow-md'}
        border-stone-200
      `}
    >
      {/* Timeline avec horaires - Amélioration de la visibilité */}
      <div className="flex flex-col items-center min-w-[100px]">
        <div className="bg-gradient-to-br from-stone-800 to-stone-900 rounded-xl p-4 text-center shadow-lg border border-stone-300">
          <div className="font-bold text-lg leading-none text-white mb-1">{item.time}</div>
          <div className="text-xs text-stone-200 font-medium">à {endTime}</div>
        </div>
        {index < 5 && (
          <div className="w-0.5 h-16 bg-gradient-to-b from-stone-400 to-stone-200 mt-3"></div>
        )}
      </div>
      
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg text-stone-800">{item.title}</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(item);
                }}
                className="text-stone-600 hover:text-sage-600 h-8 w-8 p-0 hover:bg-sage-50"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => e.stopPropagation()}
                    className="text-stone-600 hover:text-red-600 h-8 w-8 p-0 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Supprimer cette étape ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Êtes-vous sûr de vouloir supprimer "{item.title}" ? 
                      Cette action est irréversible et recalculera automatiquement les horaires suivants.
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
        </div>
        
        <p className="text-stone-600 mb-3 leading-relaxed">{item.description}</p>
        
        <div className="flex items-center gap-4 text-sm text-stone-500">
          <div className="flex items-center gap-1 bg-stone-100 px-3 py-1 rounded-full">
            <Clock className="w-4 h-4 text-stone-600" />
            <span className="font-medium text-stone-700">{formatDuration(item.duration)}</span>
          </div>
          <div className="flex items-center gap-1 bg-stone-100 px-3 py-1 rounded-full">
            <Users className="w-4 h-4 text-stone-600" />
            <span className="font-medium text-stone-700">{item.assignedTo.length} assigné(s)</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 mt-2">
          {item.assignedTo.slice(0, 3).map(person => (
            <Badge key={person} variant="outline" className="text-xs border-stone-300 text-stone-600 bg-white">
              {person}
            </Badge>
          ))}
          {item.assignedTo.length > 3 && (
            <Badge variant="outline" className="text-xs border-stone-300 text-stone-600 bg-white">
              +{item.assignedTo.length - 3}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};
