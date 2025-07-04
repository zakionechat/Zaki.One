
import React, { useState } from 'react';
import { X, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { t } from '@/utils/languageDetection';

interface PreInstructionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onChange: (value: string) => void;
  language: 'ar' | 'en';
  onClearChat?: () => void;
}

const PreInstructionsDialog: React.FC<PreInstructionsDialogProps> = ({
  isOpen,
  onClose,
  value,
  onChange,
  language,
  onClearChat
}) => {
  const [tempValue, setTempValue] = useState(value);

  if (!isOpen) return null;

  const handleSave = () => {
    onChange(tempValue);
    onClose();
  };

  const handleClearChat = () => {
    if (onClearChat) {
      onClearChat();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div 
        className="bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-200 w-full max-w-md shadow-2xl"
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            {language === 'ar' ? 'الإعدادات' : 'Settings'}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 text-gray-600 hover:text-gray-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-800 mb-2">
              {t('preInstructions', language)}
            </label>
            <Textarea
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              placeholder={t('preInstructionsPlaceholder', language)}
              className="min-h-[120px] bg-gray-50 border-gray-300 text-gray-800 placeholder:text-gray-500"
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            />
          </div>

          {/* Clear Chat Option */}
          <div className="border-t border-gray-200 pt-4">
            <Button
              onClick={handleClearChat}
              variant="outline"
              className="w-full border-red-300 text-red-600 hover:bg-red-50 flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {t('delete', language)}
            </Button>
          </div>
        </div>
        
        <div className="flex gap-2 p-6 pt-0">
          <Button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white"
          >
            <Check className="h-4 w-4 mr-2" />
            {language === 'ar' ? 'حفظ' : 'Save'}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            {language === 'ar' ? 'إلغاء' : 'Cancel'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreInstructionsDialog;
