
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-50 border-t border-stone-200 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/cc0ac012-b601-4358-af13-fe715ec15146.png" 
            alt="Mariable Logo" 
            className="h-8 w-auto"
          />
        </div>
        <div className="text-stone-500 text-sm">
          © 2025 - Mariable
        </div>
      </div>
    </footer>
  );
};
