
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock, Users, FileText, Calendar, Settings } from 'lucide-react';

interface TutorialStep {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  steps: TutorialStep[];
}

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  steps
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-purple-900">{title}</DialogTitle>
          <DialogDescription className="text-gray-600">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {steps.map((step, index) => (
            <Card key={index} className="border-l-4 border-l-purple-500">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{step.title}</h4>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-end mt-6">
          <Button onClick={onClose} className="bg-purple-600 hover:bg-purple-700">
            Compris !
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
