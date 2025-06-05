
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ViewToggleProps {
  viewMode: 'personal' | 'global';
  onViewChange: (mode: 'personal' | 'global') => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onViewChange }) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant={viewMode === 'personal' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onViewChange('personal')}
        className="text-xs"
      >
        My Tasks
      </Button>
      <Button
        variant={viewMode === 'global' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onViewChange('global')}
        className="text-xs"
      >
        All Tasks
      </Button>
    </div>
  );
};
