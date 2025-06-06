
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Download, Search, Filter, Clock4, Sparkles, Plus } from 'lucide-react';
import { usePlanningItems, PlanningItem } from '@/hooks/usePlanningItems';
import { PlanningItemModal } from './PlanningItemModal';
import { DraggablePlanningItem } from './DraggablePlanningItem';
import { LogisticsAISuggestions } from './LogisticsAISuggestions';
import { useToast } from '@/hooks/use-toast';

export const PlanningManagement = () => {
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar'>('timeline');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAISuggestionsOpen, setIsAISuggestionsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PlanningItem | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  const { 
    planningItems, 
    addPlanningItem,
    deletePlanningItem,
    updatePlanningItem, 
    reorderItems,
    calculateEndTime,
    getTotalDuration,
    getEndTime
  } = usePlanningItems();
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

  const formatTotalDuration = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h${minutes > 0 ? minutes : ''}`;
  };

  const handleEditItem = (item: PlanningItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCreateManualItem = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleSubmitItem = async (data: Partial<PlanningItem>) => {
    try {
      if (editingItem) {
        await updatePlanningItem(editingItem.id, data);
        toast({
          title: 'Succès',
          description: 'Étape modifiée avec succès',
        });
      } else {
        await addPlanningItem({
          ...data,
          duration: data.duration || 60,
          category: data.category || 'Préparation',
          status: 'scheduled',
          assignedTo: data.assignedTo || [],
          time: data.time || '08:00'
        } as Omit<PlanningItem, 'id'>);
        toast({
          title: 'Succès',
          description: 'Nouvelle étape ajoutée avec succès',
        });
      }
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder l\'étape',
        variant: 'destructive',
      });
    }
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

  const handleAddAISuggestion = (suggestion: Omit<PlanningItem, 'id' | 'time'>) => {
    // Add a default time for AI suggestions
    const suggestionWithTime = {
      ...suggestion,
      time: '08:00' // Default time, will be recalculated by the hook
    };
    addPlanningItem(suggestionWithTime);
  };

  const filteredItems = planningItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(planningItems.map(item => item.category)))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-stone-900">Rétro-planning Dynamique</h2>
          <p className="text-stone-600">Timeline interactive avec horaires calculés automatiquement</p>
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
          <Button variant="outline" className="border-stone-300 text-stone-700 hover:bg-stone-50">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Event Summary avec horaires */}
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-sage-50 rounded-lg border border-sage-200">
              <div className="text-2xl font-bold text-sage-700">{planningItems.length}</div>
              <div className="text-sm text-stone-600">Étapes principales</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-700">{formatTotalDuration(getTotalDuration())}</div>
              <div className="text-sm text-stone-600">Durée totale</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-700">08:00 - {getEndTime()}</div>
              <div className="text-sm text-stone-600">Horaires prévisionnels</div>
            </div>
            <div className="text-center p-4 bg-stone-50 rounded-lg border border-stone-200">
              <div className="text-2xl font-bold text-stone-700">12</div>
              <div className="text-sm text-stone-600">Personnes impliquées</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recherche et filtres */}
      <Card className="border-stone-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
              <Input
                placeholder="Rechercher une étape..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-stone-300 focus:border-sage-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="text-stone-500 w-4 h-4" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-stone-300 rounded-md focus:border-sage-500 focus:outline-none bg-white text-stone-700"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'Toutes catégories' : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline View */}
      {viewMode === 'timeline' && (
        <Card className="border-stone-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-stone-800 flex items-center gap-2">
                  <Clock4 className="w-5 h-5 text-sage-600" />
                  Timeline du Jour J - Horaires Dynamiques
                </CardTitle>
                <CardDescription className="text-stone-600">
                  Glissez-déposez pour réorganiser • Les horaires se recalculent automatiquement
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  onClick={() => setIsAISuggestionsOpen(true)}
                  className="bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white shadow-lg"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Ajouter une étape
                </Button>
                <Button 
                  onClick={handleCreateManualItem}
                  variant="outline"
                  className="border-sage-300 text-sage-700 hover:bg-sage-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajout Manuel
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredItems.length === 0 ? (
              <div className="text-center py-12 text-stone-500">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Aucune étape trouvée. Ajoutez une nouvelle étape ou modifiez vos filtres.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredItems.map((item, index) => (
                  <DraggablePlanningItem
                    key={item.id}
                    item={item}
                    index={index}
                    onEdit={handleEditItem}
                    onDelete={deletePlanningItem}
                    categoryColors={categoryColors}
                    formatDuration={formatDuration}
                    calculateEndTime={calculateEndTime}
                    isDragging={draggedIndex === index}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Calendar View avec amélioration de la visibilité */}
      {viewMode === 'calendar' && (
        <Card className="border-stone-200">
          <CardHeader>
            <CardTitle className="text-stone-800">Vue Calendrier - Visualisation Horaire</CardTitle>
            <CardDescription className="text-stone-600">Visualisation en grille horaire avec horaires calculés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-2">
                {Array.from({ length: 16 }, (_, i) => (
                  <div key={i} className="h-16 flex items-center text-sm font-bold border-b border-stone-200 text-stone-800 bg-stone-50 px-2 rounded-l">
                    {String(8 + i).padStart(2, '0')}:00
                  </div>
                ))}
              </div>
              
              <div className="col-span-10 relative">
                {filteredItems.map((item) => {
                  const startHour = parseInt(item.time.split(':')[0]);
                  const startMinute = parseInt(item.time.split(':')[1]);
                  const top = ((startHour - 8) * 64) + (startMinute * 64 / 60);
                  const height = (item.duration * 64) / 60;
                  
                  return (
                    <div
                      key={item.id}
                      className="absolute left-0 right-0 bg-gradient-to-r from-stone-800 to-stone-900 text-white p-3 rounded-lg text-sm cursor-pointer hover:from-stone-700 hover:to-stone-800 transition-all shadow-lg border border-stone-300"
                      style={{
                        top: `${top}px`,
                        height: `${height}px`,
                        zIndex: 1
                      }}
                      onClick={() => handleEditItem(item)}
                    >
                      <div className="font-bold text-white text-base">{item.time} - {item.title}</div>
                      <div className="text-xs text-stone-200 font-medium mt-1">{formatDuration(item.duration)}</div>
                    </div>
                  );
                })}
                
                {Array.from({ length: 16 }, (_, i) => (
                  <div key={i} className="h-16 border-b border-stone-200 bg-white"></div>
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

      <LogisticsAISuggestions 
        isOpen={isAISuggestionsOpen}
        onClose={() => setIsAISuggestionsOpen(false)}
        onAddSuggestion={handleAddAISuggestion} 
      />
    </div>
  );
};
