
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface TimelineProps {
  viewMode: 'personal' | 'global';
  userRole: string;
}

interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  status: 'done' | 'in-progress' | 'upcoming' | 'delayed';
  assignedTo: string[];
  priority: 'high' | 'medium' | 'low';
}

const SAMPLE_EVENTS: TimelineEvent[] = [
  {
    id: '1',
    time: '09:00',
    title: 'Hair & Makeup Start',
    description: 'Bride and bridesmaids hair and makeup',
    status: 'done',
    assignedTo: ['bride', 'maid-of-honor'],
    priority: 'high'
  },
  {
    id: '2',
    time: '11:00',
    title: 'Photography - Getting Ready',
    description: 'Capture preparation moments',
    status: 'in-progress',
    assignedTo: ['photographer', 'bride'],
    priority: 'medium'
  },
  {
    id: '3',
    time: '13:00',
    title: 'Ceremony Setup',
    description: 'Final venue setup and decorations',
    status: 'upcoming',
    assignedTo: ['wedding-planner', 'best-man'],
    priority: 'high'
  },
  {
    id: '4',
    time: '15:00',
    title: 'Wedding Ceremony',
    description: 'The main event!',
    status: 'upcoming',
    assignedTo: ['bride', 'groom'],
    priority: 'high'
  },
  {
    id: '5',
    time: '16:30',
    title: 'Cocktail Hour',
    description: 'Guests enjoy appetizers and drinks',
    status: 'upcoming',
    assignedTo: ['caterer', 'wedding-planner'],
    priority: 'medium'
  }
];

const STATUS_CONFIG = {
  done: { color: 'bg-emerald-100 text-emerald-800', icon: '✅', label: 'Done' },
  'in-progress': { color: 'bg-amber-100 text-amber-800', icon: '🟡', label: 'In Progress' },
  upcoming: { color: 'bg-stone-100 text-stone-800', icon: '⏰', label: 'Upcoming' },
  delayed: { color: 'bg-red-100 text-red-800', icon: '🔴', label: 'Delayed' }
};

export const Timeline: React.FC<TimelineProps> = ({ viewMode, userRole }) => {
  const [events, setEvents] = useState(SAMPLE_EVENTS);

  const filteredEvents = viewMode === 'personal' 
    ? events.filter(event => event.assignedTo.includes(userRole))
    : events;

  const updateEventStatus = (eventId: string, newStatus: TimelineEvent['status']) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, status: newStatus } : event
    ));
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-stone-900">
          {viewMode === 'personal' ? 'My Timeline' : 'Full Timeline'}
        </h2>
        <Badge variant="secondary" className="text-xs bg-stone-200 text-stone-700">
          {filteredEvents.length} events
        </Badge>
      </div>

      <div className="space-y-3">
        {filteredEvents.map((event, index) => {
          const statusConfig = STATUS_CONFIG[event.status];
          const isMyTask = event.assignedTo.includes(userRole);
          
          return (
            <Card 
              key={event.id} 
              className={`border-l-4 ${isMyTask ? 'border-l-emerald-600 bg-emerald-50' : 'border-l-stone-300 bg-stone-50'} transition-all hover:shadow-md`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-emerald-700">{event.time}</span>
                    <Badge className={statusConfig.color} variant="secondary">
                      {statusConfig.icon} {statusConfig.label}
                    </Badge>
                  </div>
                  {event.priority === 'high' && (
                    <Badge className="bg-red-800 text-red-100" variant="destructive">High Priority</Badge>
                  )}
                </div>
                <CardTitle className="text-base text-stone-900">{event.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-stone-600 mb-3">{event.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-500">Assigned to:</span>
                    <div className="flex gap-1">
                      {event.assignedTo.map(role => (
                        <Badge key={role} variant="outline" className="text-xs border-stone-300 text-stone-700">
                          {role.replace('-', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {isMyTask && event.status === 'upcoming' && (
                    <Button 
                      size="sm" 
                      onClick={() => updateEventStatus(event.id, 'in-progress')}
                      className="text-xs bg-emerald-700 hover:bg-emerald-800 text-stone-100"
                    >
                      Start Task
                    </Button>
                  )}
                  
                  {isMyTask && event.status === 'in-progress' && (
                    <Button 
                      size="sm" 
                      onClick={() => updateEventStatus(event.id, 'done')}
                      className="text-xs bg-emerald-700 hover:bg-emerald-800 text-stone-100"
                    >
                      Complete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
