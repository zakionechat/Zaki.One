
import React from 'react';
import { X, Globe, Moon, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface Settings {
  language: 'en' | 'ar';
  darkMode: boolean;
  preInstructions: string;
}

interface SettingsPanelProps {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, setSettings, onClose }) => {
  const updateSettings = (key: keyof Settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-80 h-full bg-white/90 dark:bg-white/90 backdrop-blur-md border-r border-gray-200 p-6 pt-32 overflow-y-auto" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          الإعدادات
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-gray-700 hover:bg-gray-100 h-10 w-10 touch-manipulation"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Settings Options */}
      <div className="space-y-6">
        {/* Chatbot Language Setting */}
        <div className="space-y-3">
          <Label className="text-gray-800 flex items-center gap-2 text-base">
            <Globe className="h-4 w-4" />
            لغة الردود
          </Label>
          <p className="text-xs text-gray-600 mb-2">
            اختر لغة ردود المساعد الذكي
          </p>
          <div className="flex gap-2">
            <Button
              variant={settings.language === 'ar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateSettings('language', 'ar')}
              className={`flex-1 text-sm h-9 touch-manipulation ${settings.language === 'ar' 
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300'
              }`}
            >
              العربية
            </Button>
            <Button
              variant={settings.language === 'en' ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateSettings('language', 'en')}
              className={`flex-1 text-sm h-9 touch-manipulation ${settings.language === 'en' 
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300'
              }`}
            >
              English
            </Button>
          </div>
        </div>

        {/* Dark Mode Setting with Electrical Plug Switch */}
        <div className="flex items-center justify-between">
          <Label className="text-gray-800 flex items-center gap-2 text-base">
            <Moon className="h-4 w-4" />
            الوضع المظلم
          </Label>
          
          {/* Electrical Plug Switch */}
          <div className="relative">
            <div className="w-8 h-16 bg-gray-200 rounded-lg border-2 border-gray-300 relative overflow-hidden">
              {/* Switch Track Background */}
              <div className="absolute inset-1 bg-gray-100 rounded-md">
                {/* Upper and Lower Positions */}
                <div className="absolute top-0 left-0 right-0 h-6 flex items-center justify-center">
                  <div className={`w-1 h-3 rounded-full ${!settings.darkMode ? 'bg-emerald-400' : 'bg-gray-400'}`}></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-6 flex items-center justify-center">
                  <div className={`w-1 h-3 rounded-full ${settings.darkMode ? 'bg-emerald-400' : 'bg-gray-400'}`}></div>
                </div>
              </div>
              
              {/* Switch Handle - Green Gradient Circle (Half Size & Centered) */}
              <button
                onClick={() => updateSettings('darkMode', !settings.darkMode)}
                className={`absolute w-3 h-3 rounded-full shadow-lg transition-all duration-200 ease-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                  settings.darkMode ? 'top-9' : 'top-4'
                } bg-gradient-to-b from-emerald-400 to-emerald-600`}
                style={{
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}
              >
                {/* Inner circle highlight */}
                <div className="w-full h-full rounded-full bg-gradient-to-b from-emerald-300 to-emerald-500 border border-emerald-300/50 flex items-center justify-center">
                  <div className="w-1 h-1 bg-white/80 rounded-full"></div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Pre-instructions Setting */}
        <div className="space-y-3">
          <Label className="text-gray-800 flex items-center gap-2 text-base">
            <FileText className="h-4 w-4" />
            تعليمات مسبقة
          </Label>
          <Textarea
            value={settings.preInstructions}
            onChange={(e) => updateSettings('preInstructions', e.target.value)}
            placeholder="أدخل تعليمات لتطبيقها على كل محادثة..."
            className="bg-gray-50 border-gray-300 text-gray-800 placeholder:text-gray-500 resize-none text-base"
            rows={4}
            style={{ fontSize: '16px' }}
          />
          <p className="text-xs text-gray-600">
            سيتم تطبيق هذه التعليمات على كل جلسة محادثة جديدة.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-600 text-center">
          يتم حفظ الإعدادات تلقائياً
        </p>
      </div>
    </div>
  );
};

export default SettingsPanel;
