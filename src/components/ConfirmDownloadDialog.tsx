
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

interface ConfirmDownloadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (format: 'jpg' | 'txt') => void;
}

const ConfirmDownloadDialog: React.FC<ConfirmDownloadDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  // This component is kept for compatibility but functionality is disabled
  return null;
};

export default ConfirmDownloadDialog;
