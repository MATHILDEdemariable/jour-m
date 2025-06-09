
import React from 'react';
import { Button } from '@/components/ui/button';

interface ViewToggleProps {
  viewMode: 'personal' | 'global';
  onViewChange: (mode: 'personal' | 'global') => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onViewChange }) => {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant={viewMode === 'personal' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onViewChange('personal')}
        className="text-xs py-1 h-7 lg:h-8"
      >
        Mes Tâches
      </Button>
      <Button
        variant={viewMode === 'global' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onViewChange('global')}
        className="text-xs py-1 h-7 lg:h-8"
      >
        Toutes
      </Button>
    </div>
  );
};
