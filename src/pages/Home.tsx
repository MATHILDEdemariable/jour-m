
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header with Language Toggle */}
      <div className="flex justify-end p-4">
        <LanguageToggle />
      </div>

      {/* Main Content */}
      <div className="text-center py-12">
        <div className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Jour J
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto px-4">
          {t('simplify_organization')}
        </p>
      </div>

      {/* Main Options */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/event')}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">{t('access_event')}</CardTitle>
              <CardDescription className="text-lg">
                {t === undefined ? 'Rejoignez votre équipe et consultez vos tâches du jour J' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                size="lg"
              >
                {t('access_event')}
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin')}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">{t('organize_event')}</CardTitle>
              <CardDescription className="text-lg">
                {t === undefined ? 'Créez et gérez tous les aspects de votre événement' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full border-2 border-purple-200 hover:bg-purple-50"
                size="lg"
              >
                {t('admin_portal')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-purple-100 py-8 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-500 mb-4">{t('simplify_organization')}</p>
          <button 
            onClick={() => navigate('/admin')}
            className="text-sm text-purple-600 hover:text-purple-700 underline"
          >
            {t('admin_access')}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Home;
