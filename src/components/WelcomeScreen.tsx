
import React from 'react';
import { MessageCircle, Shield, Zap, Sparkles, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PWAInstallButton from './PWAInstallButton';
import { t } from '@/utils/languageDetection';
import { toast } from '@/hooks/use-toast';

interface WelcomeScreenProps {
  onStartChat: () => void;
  language: 'ar' | 'en';
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartChat, language, darkMode, onToggleDarkMode }) => {
  const handleShareWithFriends = async () => {
    const shareData = {
      title: 'Zaki One - Your Intelligent Chat Assistant',
      text: language === 'ar' 
        ? 'اكتشف زكي ون - مساعدك الذكي للمحادثات' 
        : 'Discover Zaki One - Your Intelligent Chat Assistant',
      url: 'https://www.zaki.one/'
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast({
          title: t('shared', language),
          description: t('sharedDesc', language),
        });
      } else {
        // Fallback: copy URL to clipboard
        await navigator.clipboard.writeText('https://www.zaki.one/');
        toast({
          title: t('copied', language),
          description: language === 'ar' ? 'تم نسخ الرابط' : 'Link copied to clipboard',
        });
      }
    } catch (error) {
      // Fallback: copy URL to clipboard
      try {
        await navigator.clipboard.writeText('https://www.zaki.one/');
        toast({
          title: t('copied', language),
          description: language === 'ar' ? 'تم نسخ الرابط' : 'Link copied to clipboard',
        });
      } catch (fallbackError) {
        toast({
          title: t('error', language),
          description: language === 'ar' ? 'حدث خطأ في المشاركة' : 'Failed to share',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <div className="min-h-screen-mobile" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Glassy Header Bar */}
      <header className="fixed top-0 left-0 right-0 bg-white/10 backdrop-blur-md border-b border-white/20 h-16 z-30">
      </header>

      {/* Background - Updated to white and royal green gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-white via-emerald-50 to-emerald-100 dark:from-gray-900 dark:via-emerald-900 dark:to-black"></div>
      <div className="fixed inset-0 bg-emerald-600/10 dark:bg-black/40"></div>
      
      {/* Animated Background Elements - Updated to emerald colors */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen-mobile flex items-center justify-center p-6 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Centered Logo Only - moved lower with increased top margin */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center justify-center mb-6 mt-8">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl overflow-hidden shadow-2xl shadow-emerald-500/25 bg-white/20 backdrop-blur-sm border border-white/30">
                <img 
                  src="/lovable-uploads/f7072446-2cc0-4c29-9213-6109109a16e3.png" 
                  alt="Zaki.One Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            {/* Fixed height for Arabic welcome text with white color in dark mode */}
            <div className="min-h-[120px] flex items-center justify-center mb-4">
              <h1 className="text-5xl md:text-7xl font-bold text-emerald-800 dark:text-white leading-relaxed">
                {t('welcome', language)}
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-emerald-700 dark:text-emerald-200 mb-8 font-semibold">
              {t('subtitle', language)}
            </p>
          </div>

          {/* CTA Buttons - Fixed mobile layout with consistent heights */}
          <div className="animate-fade-in flex flex-col gap-4 justify-center items-center mb-8 max-w-lg mx-auto" style={{ animationDelay: '0.3s' }}>
            {/* Start Chat Button - Full width with standardized height */}
            <Button
              onClick={onStartChat}
              size="lg"
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-2xl shadow-emerald-500/25 hover-scale border-0 transition-all duration-300 flex items-center justify-center h-[60px]"
            >
              {language === 'ar' && <Sparkles className="mr-3 h-6 w-6" />}
              {language === 'en' && <MessageCircle className="mr-3 h-6 w-6" />}
              {t('startChat', language)}
              {language === 'ar' && <MessageCircle className="ml-3 h-6 w-6" />}
              {language === 'en' && <Sparkles className="ml-3 h-6 w-6" />}
            </Button>
            
            {/* Bottom row - Share and Install buttons with same height */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Button
                onClick={handleShareWithFriends}
                size="lg"
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-4 py-4 text-base font-semibold rounded-2xl shadow-2xl shadow-blue-500/25 hover-scale border-0 transition-all duration-300 flex items-center justify-center h-[60px]"
              >
                <Share className={`h-5 w-5 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                {t('shareWithFriends', language)}
              </Button>
              
              <div className="flex-1">
                <PWAInstallButton language={language} />
              </div>
            </div>
          </div>

          {/* Features Grid - Reduced spacing above and below */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 hover:bg-white/30 transition-all duration-300 hover-scale glass-effect">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {t('feature1Title', language)}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                {t('feature1Desc', language)}
              </p>
            </div>

            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 hover:bg-white/30 transition-all duration-300 hover-scale glass-effect">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-700 to-emerald-900 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {t('feature2Title', language)}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                {t('feature2Desc', language)}
              </p>
            </div>

            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 hover:bg-white/30 transition-all duration-300 hover-scale glass-effect">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {t('feature3Title', language)}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                {t('feature3Desc', language)}
              </p>
            </div>
          </div>

          {/* Footer - reduced top margin */}
          <div className="mt-6 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {t('footer', language)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
