
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Edit } from 'lucide-react';
import { PlanningItem } from '@/hooks/usePlanningItems';

interface DraggablePlanningItemProps {
  item: PlanningItem;
  index: number;
  onEdit: (item: PlanningItem) => void;
  categoryColors: Record<string, string>;
  formatDuration: (minutes: number) => string;
  isDragging?: boolean;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
}

export const DraggablePlanningItem: React.FC<DraggablePlanningItemProps> = ({
  item,
  index,
  onEdit,
  categoryColors,
  formatDuration,
  isDragging = false,
  onDragStart,
  onDragOver,
  onDrop
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`flex items-start gap-4 p-4 border rounded-lg transition-all cursor-move
        ${isDragging ? 'opacity-50 scale-95' : 'hover:bg-stone-50 hover:shadow-md'}
        ${isHovered ? 'border-sage-300' : 'border-stone-200'}
      `}
    >
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 bg-gradient-to-r from-sage-500 to-sage-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
          {item.time}
        </div>
        {index < 5 && (
          <div className="w-0.5 h-16 bg-stone-200 mt-2"></div>
        )}
      </div>
      
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg text-stone-800">{item.title}</h3>
          <div className="flex items-center gap-2">
            <Badge className={categoryColors[item.category as keyof typeof categoryColors]}>
              {item.category}
            </Badge>
            {isHovered && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(item);
                }}
                className="opacity-70 hover:opacity-100 text-stone-600 hover:text-sage-600"
              >
                <Edit className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        
        <p className="text-stone-600 mb-3">{item.description}</p>
        
        <div className="flex items-center gap-4 text-sm text-stone-500">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {formatDuration(item.duration)}
          </div>
          <div className="flex items-center gap-1">
            <span>{item.assignedTo.length} assigné(s)</span>
          </div>
          <div className="flex gap-1">
            {item.assignedTo.slice(0, 3).map(person => (
              <Badge key={person} variant="outline" className="text-xs border-stone-300 text-stone-600">
                {person.replace('-', ' ')}
              </Badge>
            ))}
            {item.assignedTo.length > 3 && (
              <Badge variant="outline" className="text-xs border-stone-300 text-stone-600">
                +{item.assignedTo.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
