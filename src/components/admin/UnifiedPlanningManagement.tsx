import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Download, Search, Filter, Clock4, Sparkles, Plus, Users, Star } from 'lucide-react';
import { useTimelineItems, TimelineItem } from '@/hooks/useTimelineItems';
import { useEvents } from '@/hooks/useEvents';
import { usePeople } from '@/hooks/usePeople';
import { TimelineItemModal } from './TimelineItemModal';
import { TimelineAISuggestions } from './TimelineAISuggestions';
import { DraggableTimelineItem } from './DraggableTimelineItem';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useVendors } from '@/hooks/useVendors';

// Type for preview times during drag and drop
interface PreviewTime {
  startTime: string;
  endTime: string;
  itemId: string;
}

export const UnifiedPlanningManagement = () => {
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar'>('timeline');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAISuggestionsOpen, setIsAISuggestionsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TimelineItem | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedOverIndex, setDraggedOverIndex] = useState<number | null>(null);
  const [previewItems, setPreviewItems] = useState<PreviewTime[] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  const isMobile = useIsMobile();
  
  const { 
    timelineItems, 
    addTimelineItem,
    deleteTimelineItem,
    updateTimelineItem, 
    reorderItems,
    calculateEndTime,
    getTotalDuration,
    getEndTime,
    loading
  } = useTimelineItems();
  
  const { currentEvent } = useEvents();
  const { people } = usePeople();
  const { vendors } = useVendors();
  const { toast } = useToast();

  const categoryColors = {
    "Préparation": "bg-blue-100 text-blue-800 border-blue-200",
    "Logistique": "bg-purple-100 text-purple-800 border-purple-200",
    "Cérémonie": "bg-pink-100 text-pink-800 border-pink-200",
    "Photos": "bg-green-100 text-green-800 border-green-200",
    "Réception": "bg-orange-100 text-orange-800 border-orange-200"
  };

  const statusColors = {
    "scheduled": "bg-gray-100 text-gray-800",
    "in_progress": "bg-blue-100 text-blue-800", 
    "completed": "bg-green-100 text-green-800",
    "delayed": "bg-red-100 text-red-800"
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h${mins > 0 ? mins : ''}` : `${mins}min`;
  };

  const formatTotalDuration = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h${minutes > 0 ? minutes : ''}`;
  };

  const getPersonName = (personId: string | null) => {
    if (!personId) return null;
    const person = people.find(p => p.id === personId);
    return person?.name || null;
  };

  const getPersonNames = (personIds: string[]): string[] => {
    return personIds
      .map(id => people.find(p => p.id === id)?.name)
      .filter(Boolean) as string[];
  };

  const getVendorName = (vendorId: string | null) => {
    if (!vendorId) return null;
    const vendor = vendors.find(v => v.id === vendorId);
    return vendor?.name ?? null;
  };

  // Calculate preview times for drag and drop
  const calculatePreviewTimes = (items: TimelineItem[], draggedIndex: number, dropIndex: number): PreviewTime[] => {
    const newItems = [...items];
    const [draggedItem] = newItems.splice(draggedIndex, 1);
    newItems.splice(dropIndex, 0, draggedItem);

    // Recalculate times starting from the first item
    let currentTime = newItems.length > 0 ? newItems[0].time : '08:00';
    
    return newItems.map((item, index) => {
      if (index === 0) {
        // First item keeps its original time
        const endTime = calculateEndTime(currentTime, item.duration);
        return {
          startTime: currentTime,
          endTime: endTime,
          itemId: item.id
        };
      } else {
        // Subsequent items start when previous item ends
        const startTime = calculateEndTime(currentTime, newItems[index - 1].duration);
        const endTime = calculateEndTime(startTime, item.duration);
        currentTime = startTime;
        return {
          startTime: startTime,
          endTime: endTime,
          itemId: item.id
        };
      }
    });
  };

  const handleEditItem = (item: TimelineItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCreateItem = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleSubmitItem = async (data: Partial<TimelineItem>) => {
    try {
      if (editingItem) {
        await updateTimelineItem(editingItem.id, data);
      } else {
        await addTimelineItem({
          ...data,
          duration: data.duration || 60,
          category: data.category || 'Préparation',
          status: 'scheduled',
          time: data.time || '08:00',
          order_index: timelineItems.length,
          priority: data.priority || 'medium'
        } as Omit<TimelineItem, 'id' | 'event_id' | 'created_at' | 'updated_at'>);
      }
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving timeline item:', error);
    }
  };

  const handleAddAISuggestion = async (suggestion: Omit<TimelineItem, 'id' | 'event_id' | 'created_at' | 'updated_at'>) => {
    try {
      await addTimelineItem({
        ...suggestion,
        order_index: timelineItems.length
      });
      toast({
        title: 'Succès',
        description: 'Étape IA ajoutée avec succès',
      });
    } catch (error) {
      console.error('Error adding AI suggestion:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter la suggestion IA',
        variant: 'destructive',
      });
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
    setPreviewItems(null);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      setDraggedOverIndex(index);
      // Calculate preview times
      const preview = calculatePreviewTimes(timelineItems, draggedIndex, index);
      setPreviewItems(preview);
    }
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      try {
        await reorderItems(draggedIndex, dropIndex);
        toast({
          title: 'Succès',
          description: 'Ordre des étapes mis à jour avec recalcul automatique',
        });
      } catch (error) {
        console.error('Error reordering items:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de réorganiser les étapes',
          variant: 'destructive',
        });
      }
    }
    handleDragEnd();
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDraggedOverIndex(null);
    setPreviewItems(null);
  };

  const getPreviewTimesForItem = (item: TimelineItem, index: number) => {
    if (!previewItems) return null;
    const previewItem = previewItems.find(p => p.itemId === item.id);
    if (!previewItem) return null;
    return {
      startTime: previewItem.startTime,
      endTime: previewItem.endTime
    };
  };

  const filteredItems = timelineItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = ['all', ...Array.from(new Set(timelineItems.map(item => item.category)))];
  const statuses = ['all', 'scheduled', 'in_progress', 'completed', 'delayed'];

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled': return '📅 Planifié';
      case 'in_progress': return '🔄 En cours';
      case 'completed': return '✅ Terminé';
      case 'delayed': return '⚠️ Retardé';
      default: return status;
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 p-2 md:p-4">
      {/* Header responsive */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-stone-900">Planning & Tâches Unifié</h2>
          <p className="text-sm md:text-base text-stone-600">Timeline interactive avec tâches et horaires calculés automatiquement</p>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
          <div className="flex bg-stone-100 rounded-lg p-1">
            <Button
              variant={viewMode === 'timeline' ? 'default' : 'ghost'}
              size={isMobile ? "sm" : "sm"}
              onClick={() => setViewMode('timeline')}
              className={`flex-1 md:flex-none text-xs md:text-sm ${viewMode === 'timeline' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'text-stone-600'}`}
            >
              Timeline
            </Button>
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'ghost'}
              size={isMobile ? "sm" : "sm"}
              onClick={() => setViewMode('calendar')}
              className={`flex-1 md:flex-none text-xs md:text-sm ${viewMode === 'calendar' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'text-stone-600'}`}
            >
              Calendrier
            </Button>
          </div>
          <Button 
            variant="outline" 
            size={isMobile ? "sm" : "default"}
            className="border-stone-300 text-stone-700 hover:bg-stone-50 w-full md:w-auto"
          >
            <Download className="w-4 h-4 mr-2" />
            {isMobile ? 'Export' : 'Exporter'}
          </Button>
        </div>
      </div>

      {/* Event Summary responsive */}
      <Card className="border-stone-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-stone-800 text-lg md:text-xl">
            <Calendar className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
            <span className="truncate">Événement: {currentEvent?.name || 'Événement'}</span>
          </CardTitle>
          <CardDescription className="text-stone-600 text-sm">
            {currentEvent?.event_type} • {currentEvent?.event_date && new Date(currentEvent.event_date).toLocaleDateString('fr-FR')} • {currentEvent?.location}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            <div className="text-center p-3 md:p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-xl md:text-2xl font-bold text-purple-700">{timelineItems.length}</div>
              <div className="text-xs md:text-sm text-stone-600">Étapes totales</div>
            </div>
            <div className="text-center p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-xl md:text-2xl font-bold text-blue-700">{formatTotalDuration(getTotalDuration())}</div>
              <div className="text-xs md:text-sm text-stone-600">Durée totale</div>
            </div>
            <div className="text-center p-3 md:p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-lg md:text-2xl font-bold text-green-700">
                {timelineItems.length > 0 ? `08:00 - ${getEndTime()}` : '08:00 - 08:00'}
              </div>
              <div className="text-xs md:text-sm text-stone-600">Horaires prévisionnels</div>
            </div>
            <div className="text-center p-3 md:p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-xl md:text-2xl font-bold text-orange-700">
                {timelineItems.filter(item => item.status === 'completed').length}
              </div>
              <div className="text-xs md:text-sm text-stone-600">Tâches terminées</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtres et recherche responsive */}
      <Card className="border-stone-200">
        <CardContent className="pt-4 md:pt-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
              <Input
                placeholder="Rechercher une étape ou tâche..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-stone-300 focus:border-purple-500 text-sm md:text-base"
              />
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-2">
              <div className="flex items-center gap-2">
                <Filter className="text-stone-500 w-4 h-4" />
                <span className="text-sm text-stone-600 md:hidden">Filtres:</span>
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-stone-300 rounded-md focus:border-purple-500 focus:outline-none bg-white text-stone-700 text-sm w-full md:w-auto"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'Toutes catégories' : cat}
                  </option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-stone-300 rounded-md focus:border-purple-500 focus:outline-none bg-white text-stone-700 text-sm w-full md:w-auto"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'Tous statuts' : getStatusLabel(status)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline View responsive */}
      {viewMode === 'timeline' && (
        <Card className="border-stone-200">
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-stone-800 flex items-center gap-2 text-lg md:text-xl">
                  <Clock4 className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                  Planning & Tâches - Horaires Dynamiques
                </CardTitle>
                <CardDescription className="text-stone-600 text-sm">
                  {isMobile ? 'Touchez pour réorganiser' : 'Glissez-déposez pour réorganiser'} • Les horaires se recalculent automatiquement
                </CardDescription>
              </div>
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
                <Button 
                  onClick={() => setIsAISuggestionsOpen(true)}
                  size={isMobile ? "sm" : "default"}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg w-full md:w-auto"
                >
                  <Star className="w-4 h-4 mr-2" />
                  {isMobile ? 'IA Suggestions' : 'Ajouter Étape/Tâche - Suggestions'}
                </Button>
                <Button 
                  onClick={handleCreateItem}
                  variant="outline"
                  size={isMobile ? "sm" : "default"}
                  className="border-purple-300 text-purple-700 hover:bg-purple-50 w-full md:w-auto"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {isMobile ? 'Manuel' : 'Ajout Manuel'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 md:py-12 text-stone-500">
                <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-sm md:text-base">Chargement...</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-8 md:py-12 text-stone-500">
                <Clock className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm md:text-base">Aucune étape trouvée. Ajoutez une nouvelle étape ou modifiez vos filtres.</p>
              </div>
            ) : (
              <div className="space-y-3 md:space-y-4">
                {filteredItems.map((item, index) => (
                  <DraggableTimelineItem
                    key={item.id}
                    item={item}
                    index={index}
                    onEdit={handleEditItem}
                    onDelete={deleteTimelineItem}
                    categoryColors={categoryColors}
                    statusColors={statusColors}
                    formatDuration={formatDuration}
                    calculateEndTime={calculateEndTime}
                    getPersonNames={getPersonNames}
                    getStatusLabel={getStatusLabel}
                    isDragging={draggedIndex === index}
                    draggedOverIndex={draggedOverIndex}
                    previewTimes={getPreviewTimesForItem(item, index)}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onDragEnd={handleDragEnd}
                    getVendorName={getVendorName}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <TimelineItemModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleSubmitItem}
        item={editingItem}
      />

      <TimelineAISuggestions
        isOpen={isAISuggestionsOpen}
        onClose={() => setIsAISuggestionsOpen(false)}
        onAddSuggestion={handleAddAISuggestion}
      />
    </div>
  );
};
