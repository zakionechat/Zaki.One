
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { t } from '@/utils/languageDetection';

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  language: 'ar' | 'en';
}

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  language,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent 
        className="max-w-md mx-4 rounded-lg shadow-xl backdrop-blur-md bg-white/90 dark:bg-white/90 border border-gray-200" 
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        <AlertDialogHeader className="space-y-4 pb-4">
          <AlertDialogTitle className={`text-xl font-semibold text-gray-800 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
            {t('deleteTitle', language)}
          </AlertDialogTitle>
          <AlertDialogDescription className={`text-base text-gray-600 leading-relaxed ${language === 'ar' ? 'text-right' : 'text-left'}`}>
            {t('deleteMessage', language)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className={`flex gap-3 pt-4 ${language === 'ar' ? 'flex-row-reverse sm:flex-row-reverse' : 'flex-col-reverse sm:flex-row sm:justify-end'}`}>
          <AlertDialogCancel className="min-w-[100px] px-6 py-2 flex-1 sm:flex-none bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300">
            {t('cancel', language)}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm} 
            className="bg-red-600 hover:bg-red-700 text-white min-w-[100px] px-6 py-2 flex-1 sm:flex-none"
          >
            {t('confirmDelete', language)}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDeleteDialog;
