
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Download, Plus } from 'lucide-react';
import { usePlanningItems, PlanningItem } from '@/hooks/usePlanningItems';
import { PlanningItemModal } from './PlanningItemModal';
import { DraggablePlanningItem } from './DraggablePlanningItem';
import { useToast } from '@/hooks/use-toast';

export const PlanningManagement = () => {
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar'>('timeline');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PlanningItem | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  
  const { planningItems, updatePlanningItem, reorderItems } = usePlanningItems();
  const { toast } = useToast();

  const categoryColors = {
    "Préparation": "bg-blue-100 text-blue-800 border-blue-200",
    "Logistique": "bg-purple-100 text-purple-800 border-purple-200",
    "Cérémonie": "bg-pink-100 text-pink-800 border-pink-200",
    "Photos": "bg-green-100 text-green-800 border-green-200",
    "Réception": "bg-orange-100 text-orange-800 border-orange-200"
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h${mins > 0 ? mins : ''}` : `${mins}min`;
  };

  const handleEditItem = (item: PlanningItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCreateItem = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleSubmitItem = (data: Partial<PlanningItem>) => {
    if (editingItem) {
      updatePlanningItem(editingItem.id, data);
    } else {
      // Logic for creating new item would go here
      toast({
        title: 'Fonctionnalité à venir',
        description: 'La création de nouveaux éléments sera bientôt disponible',
      });
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      reorderItems(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  const getTotalDuration = () => {
    return planningItems.reduce((total, item) => total + item.duration, 0);
  };

  const formatTotalDuration = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h${minutes > 0 ? minutes : ''}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-stone-900">Rétro-planning Dynamique</h2>
          <p className="text-stone-600">Visualisez et organisez le planning de votre événement</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-stone-100 rounded-lg p-1">
            <Button
              variant={viewMode === 'timeline' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('timeline')}
              className={viewMode === 'timeline' ? 'bg-sage-600 text-white' : 'text-stone-600'}
            >
              Timeline
            </Button>
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('calendar')}
              className={viewMode === 'calendar' ? 'bg-sage-600 text-white' : 'text-stone-600'}
            >
              Calendrier
            </Button>
          </div>
          <Button 
            onClick={handleCreateItem}
            className="bg-sage-600 hover:bg-sage-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </Button>
          <Button variant="outline" className="border-stone-300 text-stone-700 hover:bg-stone-50">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Event Summary */}
      <Card className="border-stone-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-stone-800">
            <Calendar className="w-5 h-5 text-sage-600" />
            Événement: Mariage Sarah & James
          </CardTitle>
          <CardDescription className="text-stone-600">
            Samedi 15 Juin 2024 - Château de Malmaison, Paris
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-sage-50 rounded-lg border border-sage-200">
              <div className="text-2xl font-bold text-sage-700">{planningItems.length}</div>
              <div className="text-sm text-stone-600">Étapes principales</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-700">{formatTotalDuration(getTotalDuration())}</div>
              <div className="text-sm text-stone-600">Durée totale</div>
            </div>
            <div className="text-center p-4 bg-stone-50 rounded-lg border border-stone-200">
              <div className="text-2xl font-bold text-stone-700">12</div>
              <div className="text-sm text-stone-600">Personnes impliquées</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline View */}
      {viewMode === 'timeline' && (
        <Card className="border-stone-200">
          <CardHeader>
            <CardTitle className="text-stone-800">Timeline du Jour J</CardTitle>
            <CardDescription className="text-stone-600">
              Planning détaillé heure par heure - Glissez-déposez pour réorganiser
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {planningItems.map((item, index) => (
                <DraggablePlanningItem
                  key={item.id}
                  item={item}
                  index={index}
                  onEdit={handleEditItem}
                  categoryColors={categoryColors}
                  formatDuration={formatDuration}
                  isDragging={draggedIndex === index}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <Card className="border-stone-200">
          <CardHeader>
            <CardTitle className="text-stone-800">Vue Calendrier</CardTitle>
            <CardDescription className="text-stone-600">Visualisation en grille horaire</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-12 gap-2">
              {/* Time labels */}
              <div className="col-span-2">
                {Array.from({ length: 12 }, (_, i) => (
                  <div key={i} className="h-16 flex items-center text-sm font-medium border-b border-stone-200 text-stone-700">
                    {String(8 + i).padStart(2, '0')}:00
                  </div>
                ))}
              </div>
              
              {/* Timeline bars */}
              <div className="col-span-10 relative">
                {planningItems.map((item) => {
                  const startHour = parseInt(item.time.split(':')[0]);
                  const startMinute = parseInt(item.time.split(':')[1]);
                  const top = ((startHour - 8) * 64) + (startMinute * 64 / 60);
                  const height = (item.duration * 64) / 60;
                  
                  return (
                    <div
                      key={item.id}
                      className="absolute left-0 right-0 bg-gradient-to-r from-sage-500 to-sage-600 text-white p-2 rounded text-sm cursor-pointer hover:from-sage-600 hover:to-sage-700 transition-all"
                      style={{
                        top: `${top}px`,
                        height: `${height}px`,
                        zIndex: 1
                      }}
                      onClick={() => handleEditItem(item)}
                    >
                      <div className="font-semibold">{item.title}</div>
                      <div className="text-xs opacity-90">{formatDuration(item.duration)}</div>
                    </div>
                  );
                })}
                
                {/* Hour grid lines */}
                {Array.from({ length: 12 }, (_, i) => (
                  <div key={i} className="h-16 border-b border-stone-200"></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <PlanningItemModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleSubmitItem}
        item={editingItem}
      />
    </div>
  );
};
