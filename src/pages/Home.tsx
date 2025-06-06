
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LanguageToggle } from '@/components/LanguageToggle';

const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-stone-100 to-emerald-50">
      {/* Header with Language Toggle */}
      <div className="flex justify-end p-4">
        <LanguageToggle />
      </div>

      {/* Main Content */}
      <div className="text-center py-12">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img 
            src="/lovable-uploads/c61b205f-3139-48aa-a515-9f787c11f446.png" 
            alt="Jour M Logo" 
            className="w-32 h-32 md:w-40 md:h-40 object-contain"
          />
        </div>
        
        <div className="text-6xl font-bold bg-gradient-to-r from-stone-800 via-emerald-800 to-stone-900 bg-clip-text text-transparent mb-4">
          Jour M
        </div>
        <p className="text-xl text-stone-700 max-w-2xl mx-auto px-4">
          {t('simplify_organization')}
        </p>
      </div>

      {/* Main Options */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-stone-50 border-emerald-200" onClick={() => navigate('/event')}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-emerald-700 to-emerald-800 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-stone-100" />
              </div>
              <CardTitle className="text-2xl text-stone-900">{t('access_event')}</CardTitle>
              <CardDescription className="text-lg text-stone-600">
                {t === undefined ? 'Rejoignez votre équipe et consultez vos tâches du jour M' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-stone-100"
                size="lg"
              >
                {t('access_event')}
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-stone-50 border-emerald-200" onClick={() => navigate('/admin')}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-stone-700 to-stone-800 rounded-full flex items-center justify-center mb-4">
                <Settings className="w-8 h-8 text-stone-100" />
              </div>
              <CardTitle className="text-2xl text-stone-900">{t('organize_event')}</CardTitle>
              <CardDescription className="text-lg text-stone-600">
                {t === undefined ? 'Créez et gérez tous les aspects de votre événement' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full border-2 border-emerald-700 bg-stone-100 text-emerald-800 hover:bg-emerald-50"
                size="lg"
              >
                {t('admin_portal')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-stone-100/80 backdrop-blur-sm border-t border-emerald-200 py-8 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-stone-600 mb-4">{t('simplify_organization')}</p>
          <button 
            onClick={() => navigate('/admin')}
            className="text-sm text-emerald-700 hover:text-emerald-800 underline"
          >
            {t('admin_access')}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Home;
