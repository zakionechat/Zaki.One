
import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import StreamingMessage from './StreamingMessage';
import BetterMessageRenderer from './BetterMessageRenderer';
import { t } from '@/utils/languageDetection';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isStreaming?: boolean;
}

interface ChatMessageProps {
  message: Message;
  language: 'en' | 'ar';
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, language }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      toast({
        title: t('copied', language),
        description: t('copiedDesc', language)
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: t('error', language),
        description: language === 'ar' ? 'فشل في نسخ النص' : 'Failed to copy text',
        variant: 'destructive'
      });
    }
  };

  // Detect message language for auto-positioning
  const detectMessageLanguage = (text: string): 'ar' | 'en' => {
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    const arabicChars = (text.match(new RegExp(arabicRegex, 'g')) || []).length;
    const totalChars = text.replace(/\s+/g, '').length;
    return arabicChars / totalChars > 0.3 ? 'ar' : 'en';
  };

  const messageLanguage = detectMessageLanguage(message.content);

  if (message.isUser) {
    // User messages without avatar
    return (
      <div className="flex justify-end group chat-message-mobile px-4">
        <div className="flex gap-3 max-w-[85%]">
          {/* Message Content */}
          <div className="flex flex-col items-end">
            <div className="rounded-2xl px-4 py-3 backdrop-blur-sm border bg-gradient-to-r from-emerald-600/90 to-emerald-800/90 text-white border-emerald-400/30 glass-effect chat-message-bubble select-text">
              <p className="whitespace-pre-wrap break-words select-text">{message.content}</p>
            </div>

            {/* Timestamp and Actions */}
            <div className="flex items-center gap-2 mt-1 flex-row-reverse">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {message.timestamp.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>

              {/* Copy button - always visible */}
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="h-6 w-6 p-0 text-gray-600 dark:text-gray-400 hover:text-emerald-600 hover:bg-white/20 transition-all duration-300 touch-manipulation"
                title={t('copied', language)}
                style={{ minHeight: '24px', minWidth: '24px' }}
              >
                {copied ? (
                  <Check className="h-3 w-3 text-green-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Bot messages - Full width with no padding/margins
  return (
    <div className="flex justify-start group chat-message-mobile w-full">
      <div className="w-full">
        {/* Message Content - truly edge-to-edge */}
        <div 
          className={`w-full selectable-bot-content chat-message-mobile text-lg ${messageLanguage === 'ar' ? 'text-right' : 'text-left'}`} 
          dir={messageLanguage === 'ar' ? 'rtl' : 'ltr'}
          style={{
            userSelect: 'text',
            WebkitUserSelect: 'text',
            MozUserSelect: 'text',
            msUserSelect: 'text',
            WebkitTouchCallout: 'default',
            cursor: 'text',
            margin: 0,
            padding: 0
          }}
          onMouseDown={(e) => {
            // Prevent any interference with text selection
            e.stopPropagation();
          }}
        >
          {message.isStreaming ? (
            <StreamingMessage 
              content={message.content} 
              isStreaming={message.isStreaming || false}
              language={messageLanguage}
            />
          ) : (
            <BetterMessageRenderer content={message.content} language={messageLanguage} />
          )}
        </div>

        {/* Timestamp and Actions - small padding for controls only */}
        <div className={`flex items-center gap-2 mt-2 px-2 mb-4 ${messageLanguage === 'ar' ? 'justify-end' : 'justify-start'}`}>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {message.timestamp.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>

          {/* Copy button - always visible */}
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="h-6 w-6 p-0 text-gray-600 dark:text-gray-400 hover:text-emerald-600 hover:bg-white/20 transition-all duration-300 touch-manipulation"
            title={t('copied', language)}
            style={{ minHeight: '24px', minWidth: '24px' }}
          >
            {copied ? (
              <Check className="h-3 w-3 text-green-600" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
