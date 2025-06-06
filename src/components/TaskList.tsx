
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface TaskListProps {
  viewMode: 'personal' | 'global';
  userRole: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  assignedTo: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  dueTime?: string;
}

const SAMPLE_TASKS: Task[] = [
  {
    id: '1',
    title: 'Confirm final headcount with caterer',
    description: 'Call catering team to confirm guest numbers',
    completed: false,
    assignedTo: 'wedding-planner',
    priority: 'high',
    category: 'Catering',
    dueTime: '12:00'
  },
  {
    id: '2',
    title: 'Set up welcome signs',
    description: 'Place welcome signs at venue entrance',
    completed: true,
    assignedTo: 'best-man',
    priority: 'medium',
    category: 'Decorations'
  },
  {
    id: '3',
    title: 'Test sound system',
    description: 'Check microphones and music playlist',
    completed: false,
    assignedTo: 'wedding-planner',
    priority: 'high',
    category: 'Audio/Visual',
    dueTime: '14:00'
  },
  {
    id: '4',
    title: 'Prepare emergency kit',
    description: 'Pack safety pins, stain remover, tissues',
    completed: false,
    assignedTo: 'maid-of-honor',
    priority: 'medium',
    category: 'Emergency Prep'
  },
  {
    id: '5',
    title: 'Charge camera batteries',
    description: 'Ensure all equipment is ready',
    completed: true,
    assignedTo: 'photographer',
    priority: 'high',
    category: 'Photography'
  }
];

const PRIORITY_CONFIG = {
  high: { color: 'bg-red-100 text-red-800', label: 'High' },
  medium: { color: 'bg-amber-100 text-amber-800', label: 'Medium' },
  low: { color: 'bg-emerald-100 text-emerald-800', label: 'Low' }
};

export const TaskList: React.FC<TaskListProps> = ({ viewMode, userRole }) => {
  const [tasks, setTasks] = useState(SAMPLE_TASKS);

  const filteredTasks = viewMode === 'personal' 
    ? tasks.filter(task => task.assignedTo === userRole)
    : tasks;

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const completedCount = filteredTasks.filter(task => task.completed).length;
  const totalCount = filteredTasks.length;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-stone-900">
          {viewMode === 'personal' ? 'My Tasks' : 'All Tasks'}
        </h2>
        <Badge variant="secondary" className="text-xs bg-stone-200 text-stone-700">
          {completedCount}/{totalCount} completed
        </Badge>
      </div>

      {/* Progress Summary */}
      <Card className="bg-gradient-to-r from-emerald-50 to-stone-100 border-emerald-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-stone-800">Progress</span>
            <span className="text-sm text-stone-600">{Math.round((completedCount / totalCount) * 100)}%</span>
          </div>
          <div className="w-full bg-stone-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-emerald-700 to-stone-700 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {filteredTasks.map((task) => {
          const priorityConfig = PRIORITY_CONFIG[task.priority];
          const isMyTask = task.assignedTo === userRole;
          
          return (
            <Card 
              key={task.id} 
              className={`transition-all hover:shadow-md ${task.completed ? 'opacity-60' : ''} ${isMyTask ? 'border-l-4 border-l-emerald-600 bg-emerald-50' : 'bg-stone-50'}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                    className="mt-1"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-medium ${task.completed ? 'line-through text-stone-500' : 'text-stone-900'}`}>
                        {task.title}
                      </h3>
                      <Badge className={priorityConfig.color} variant="secondary">
                        {priorityConfig.label}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-stone-600 mb-2">{task.description}</p>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-stone-300 text-stone-700">{task.category}</Badge>
                        <span className="text-stone-500">
                          Assigned to: {task.assignedTo.replace('-', ' ')}
                        </span>
                      </div>
                      
                      {task.dueTime && (
                        <Badge variant="outline" className="text-xs border-emerald-300 text-emerald-700">
                          Due: {task.dueTime}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
