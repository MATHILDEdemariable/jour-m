
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Footer: React.FC = () => {
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);

  const handleLogoClick = () => {
    setClickCount(prev => prev + 1);
    
    // Si triple-clic dans les 2 secondes, accéder à la démo
    if (clickCount === 2) {
      navigate('/demo');
      setClickCount(0);
    }
    
    // Reset après 2 secondes
    setTimeout(() => {
      setClickCount(0);
    }, 2000);
  };

  return (
    <footer className="bg-stone-50 border-t border-stone-200 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/cc0ac012-b601-4358-af13-fe715ec15146.png" 
            alt="Mariable Logo" 
            className="h-8 w-auto cursor-pointer transition-opacity hover:opacity-80"
            onClick={handleLogoClick}
            title={clickCount > 0 ? `Clic ${clickCount}/3 pour la démo` : ''}
          />
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/equipe')}
            className="text-stone-600 hover:text-stone-800 text-sm underline transition-colors"
          >
            Accès Équipe
          </button>
          <div className="text-stone-500 text-sm">
            © 2025 - Mariable
          </div>
        </div>
      </div>
    </footer>
  );
};
