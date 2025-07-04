
import React, { useState, useEffect } from 'react';
import { Download, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { t } from '@/utils/languageDetection';

interface PWAInstallButtonProps {
  language: 'ar' | 'en';
}

const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ language }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Handle Android install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstall(false);
    } else {
      // Show install button for iOS or when prompt is available
      setShowInstall(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (isIOS) {
      // Show iOS installation instructions
      setShowIOSInstructions(true);
      return;
    }

    if (!deferredPrompt) {
      toast({
        title: language === 'ar' ? "معلومات" : "Information",
        description: language === 'ar' ? "التطبيق متاح للتثبيت من متصفحك" : "App is available for installation from your browser"
      });
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      toast({
        title: t('saved', language),
        description: language === 'ar' ? "تم تثبيت التطبيق بنجاح" : "App installed successfully"
      });
    }
    setDeferredPrompt(null);
    setShowInstall(false);
  };

  const closeIOSInstructions = () => {
    setShowIOSInstructions(false);
  };

  if (!showInstall) return null;

  return (
    <>
      <Button
        onClick={handleInstall}
        size="lg"
        className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white px-4 py-4 text-base font-semibold rounded-2xl shadow-2xl shadow-purple-500/25 border-0 flex items-center justify-center h-[60px]"
      >
        <Download className={`h-5 w-5 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
        {t('installApp', language)}
      </Button>

      {/* iOS Installation Instructions Dialog */}
      <AlertDialog open={showIOSInstructions} onOpenChange={setShowIOSInstructions}>
        <AlertDialogContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 max-w-md" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <AlertDialogHeader>
            <div className="flex items-center justify-between">
              <AlertDialogTitle className={`text-gray-900 dark:text-white flex items-center gap-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                <Plus className="h-5 w-5" />
                {t('installTitle', language)}
              </AlertDialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeIOSInstructions}
                className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <AlertDialogDescription className={`text-gray-600 dark:text-gray-300 space-y-3 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              <p>{language === 'ar' ? 'لتثبيت التطبيق على جهاز iOS:' : 'To install the app on iOS device:'}</p>
              <div className="space-y-2 text-sm">
                <p>1. {t('installStep1', language)}</p>
                <p>2. {t('installStep2', language)}</p>
                <p>3. {t('installStep3', language)}</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-center pt-4">
            <AlertDialogAction 
              onClick={closeIOSInstructions}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {t('installUnderstood', language)}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PWAInstallButton;
