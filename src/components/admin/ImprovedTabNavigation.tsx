
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Settings, Users, Building2, Calendar, FileText } from 'lucide-react';
import { useLocalEventData } from '@/contexts/LocalEventDataContext';

interface ImprovedTabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const ImprovedTabNavigation: React.FC<ImprovedTabNavigationProps> = ({
  activeTab,
  onTabChange
}) => {
  const { people, vendors, timelineItems, planningItems, documents } = useLocalEventData();

  const getTabCount = (tab: string) => {
    switch (tab) {
      case 'people':
        return people.length;
      case 'vendors':
        return vendors.length;
      case 'planning':
        return timelineItems.length + planningItems.length;
      case 'documents':
        return documents.length;
      default:
        return 0;
    }
  };

  const TabButton = ({ value, icon: Icon, label, showCount = true }: {
    value: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    showCount?: boolean;
  }) => (
    <TabsTrigger 
      value={value}
      className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-200"
    >
      <Icon className="w-4 h-4" />
      <span className="hidden sm:inline font-medium">{label}</span>
      {showCount && getTabCount(value) > 0 && (
        <Badge 
          variant="secondary" 
          className="ml-1 h-5 text-xs data-[state=active]:bg-white/20 data-[state=active]:text-white"
        >
          {getTabCount(value)}
        </Badge>
      )}
    </TabsTrigger>
  );

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-5 h-auto p-2 bg-gray-50 rounded-none">
            <TabButton value="config" icon={Settings} label="Paramètres" showCount={false} />
            <TabButton value="people" icon={Users} label="Équipe" />
            <TabButton value="vendors" icon={Building2} label="Professionnels" />
            <TabButton value="planning" icon={Calendar} label="Planning" />
            <TabButton value="documents" icon={FileText} label="Documents" />
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};
