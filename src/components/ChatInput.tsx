
import React, { useRef, useEffect, useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { t } from '@/utils/languageDetection';
import { detectTextDirection } from '@/utils/textDirection';

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
  language: 'ar' | 'en';
  autoFocus?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  inputMessage, 
  setInputMessage, 
  onSendMessage, 
  isLoading,
  language,
  autoFocus = false
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [inputDirection, setInputDirection] = useState<'rtl' | 'ltr'>('ltr');

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = Math.min(scrollHeight, 200) + 'px';
    }
  };

  useEffect(() => {
    adjustHeight();
    // Detect text direction based on input content
    if (inputMessage.trim()) {
      const direction = detectTextDirection(inputMessage);
      setInputDirection(direction);
    } else {
      setInputDirection(language === 'ar' ? 'rtl' : 'ltr');
    }
  }, [inputMessage, language]);

  // Auto focus the textarea when autoFocus prop is true
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      // Small delay to ensure the component is fully rendered
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [autoFocus]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    // Enter key now acts as new line (like Shift+Enter)
    // No automatic sending on Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      // Allow default behavior (new line)
      return;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
  };

  const handleSendMessage = () => {
    // Always allow sending, even with empty message
    if (!isLoading) {
      console.log('ChatInput: Sending message:', inputMessage);
      onSendMessage();
    }
  };

  return (
    <div className="bg-white/30 dark:bg-white/30 backdrop-blur-xl rounded-[28px] border border-gray-600/60 dark:border-white/30">
      <div className="w-full">
        <div className="relative">
          <div className="px-4 py-4">
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={t('placeholder', language)}
              className="w-full bg-transparent border-none text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 resize-none focus:ring-0 focus:outline-none text-base leading-relaxed min-h-[50px] max-h-[200px] placeholder:text-sm"
              disabled={isLoading}
              dir={inputDirection}
              style={{ 
                fontSize: '16px',
                fontFamily: inputDirection === 'rtl' ? 'Noto Sans Arabic, sans-serif' : 'Inter, sans-serif',
                textAlign: inputDirection === 'rtl' ? 'right' : 'left'
              }}
              rows={1}
            />
            
            {/* Action Buttons - moved up */}
            <div className="flex justify-end items-center mt-1 gap-2">
              {/* Send Button - Always active, no disabled state based on input */}
              <Button
                onClick={handleSendMessage}
                disabled={isLoading}
                className="bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white h-10 w-10 rounded-[16px] shadow-lg hover:shadow-emerald-500/25 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none p-0"
                size="icon"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send className={`h-4 w-4 ${language === 'ar' ? 'scale-x-[-1]' : ''}`} />
                )}
              </Button>
            </div>
          </div>
          
          {/* Typing Indicator - moved up */}
          {isLoading && (
            <div className="px-4 pb-4">
              <div className={`flex items-center gap-3 text-gray-600 dark:text-gray-400 text-sm ${language === 'ar' ? 'justify-end' : 'justify-start'}`}>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                </div>
                <span>{t('thinking', language)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
