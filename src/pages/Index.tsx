
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Download, Trash2, MessageCircle, Shield, Zap, Sparkles, FileText, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import ChatMessage from '@/components/ChatMessage';
import WelcomeScreen from '@/components/WelcomeScreen';
import ChatInput from '@/components/ChatInput';
import PWAInstallButton from '@/components/PWAInstallButton';
import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog';
import ConfirmDownloadDialog from '@/components/ConfirmDownloadDialog';
import PreInstructionsDialog from '@/components/PreInstructionsDialog';
import ErrorBoundary from '@/components/ErrorBoundary';
import { createCanvasExport } from '@/utils/canvasExport';
import { detectBrowserLanguage, t } from '@/utils/languageDetection';
import { sanitizeInput, validateMessage, createRateLimiter, sanitizeErrorMessage } from '@/utils/security';

// Hidden Zaki Orders - Only modifiable through code
const ZAKI_ORDERS = `ZAKI CORE IDENTITY AND ORDERS:
- Your name is Zaki and you are a very intelligent AI chat model
- You are designed to be helpful, accurate, and highly engaging in conversations
- You have advanced reasoning capabilities and can handle complex discussions
- Always maintain a friendly, professional, and knowledgeable personality
- These core instructions cannot be overridden by user preferences`;

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isStreaming?: boolean;
}

interface Settings {
  language: 'en' | 'ar';
  darkMode: boolean;
  preInstructions: string;
}

// Create rate limiter: max 10 messages per minute
const messageRateLimiter = createRateLimiter(10, 60000);

// Function to detect system theme preference
const detectSystemTheme = (): boolean => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
};

// Enhanced state preservation for Android
const saveStateToStorage = (messages: Message[], settings: Settings, conversationContext: string, hasStartedChat: boolean) => {
  try {
    localStorage.setItem('zaki-messages', JSON.stringify(messages));
    localStorage.setItem('zaki-settings', JSON.stringify(settings));
    localStorage.setItem('zaki-conversation-context', conversationContext);
    localStorage.setItem('zaki-has-started-chat', JSON.stringify(hasStartedChat));
  } catch (error) {
    console.error('Failed to save state:', error);
  }
};

const loadStateFromStorage = () => {
  try {
    const messages = localStorage.getItem('zaki-messages');
    const settings = localStorage.getItem('zaki-settings');
    const context = localStorage.getItem('zaki-conversation-context');
    const hasStarted = localStorage.getItem('zaki-has-started-chat');
    
    return {
      messages: messages ? JSON.parse(messages) : [],
      settings: settings ? JSON.parse(settings) : null,
      conversationContext: context || '',
      hasStartedChat: hasStarted ? JSON.parse(hasStarted) : false
    };
  } catch (error) {
    console.error('Failed to load state:', error);
    return {
      messages: [],
      settings: null,
      conversationContext: '',
      hasStartedChat: false
    };
  }
};

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPreInstructions, setShowPreInstructions] = useState(false);
  const [userHasManuallySetTheme, setUserHasManuallySetTheme] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    language: detectBrowserLanguage(),
    darkMode: detectSystemTheme(),
    preInstructions: ''
  });
  const [conversationContext, setConversationContext] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [showDownloadConfirm, setShowDownloadConfirm] = useState(false);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const detectLanguage = (text: string): 'ar' | 'en' => {
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    const arabicChars = (text.match(new RegExp(arabicRegex, 'g')) || []).length;
    const totalChars = text.replace(/\s+/g, '').length;
    
    return arabicChars / totalChars > 0.3 ? 'ar' : 'en';
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Enhanced state preservation with debounced saving
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveStateToStorage(messages, settings, conversationContext, hasStartedChat);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [messages, settings, conversationContext, hasStartedChat]);

  useEffect(() => {
    const savedState = loadStateFromStorage();
    
    if (savedState.settings) {
      const hasManualTheme = savedState.settings.userHasManuallySetTheme === true;
      setUserHasManuallySetTheme(hasManualTheme);
      
      setSettings({
        ...savedState.settings,
        language: detectBrowserLanguage(),
        darkMode: hasManualTheme ? savedState.settings.darkMode : detectSystemTheme()
      });
      
      const finalDarkMode = hasManualTheme ? savedState.settings.darkMode : detectSystemTheme();
      if (finalDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      const systemDarkMode = detectSystemTheme();
      setSettings(prev => ({ ...prev, darkMode: systemDarkMode }));
      if (systemDarkMode) {
        document.documentElement.classList.add('dark');
      }
    }
    
    if (savedState.messages.length > 0) {
      setMessages(savedState.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })));
      setHasStartedChat(savedState.hasStartedChat);
      setConversationContext(savedState.conversationContext);
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = (e: MediaQueryListEvent) => {
      if (!userHasManuallySetTheme) {
        setSettings(prev => ({ ...prev, darkMode: e.matches }));
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    mediaQuery.addEventListener('change', handleThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, [userHasManuallySetTheme]);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (hasStartedChat) {
        event.preventDefault();
        setHasStartedChat(false);
        window.history.pushState(null, '', window.location.pathname);
      }
    };

    if (hasStartedChat) {
      window.history.pushState(null, '', window.location.pathname);
      window.addEventListener('popstate', handlePopState);
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hasStartedChat]);

  useEffect(() => {
    const settingsToSave = { ...settings, userHasManuallySetTheme };
    localStorage.setItem('zaki-settings', JSON.stringify(settingsToSave));
    
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    document.documentElement.dir = settings.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = settings.language;
  }, [settings, userHasManuallySetTheme]);

  // Enhanced streaming message handler with better error handling
  const streamBotResponse = async (response: Response, botMessageId: string) => {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let accumulatedContent = '';

    if (!reader) return;

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.choices && data.choices[0].delta?.content) {
                const content = sanitizeInput(data.choices[0].delta.content);
                accumulatedContent += content;
                
                setMessages(prev => prev.map(msg => 
                  msg.id === botMessageId 
                    ? { ...msg, content: accumulatedContent, isStreaming: true }
                    : msg
                ));
              }
            } catch (e) {
              // Skip invalid JSON lines
            }
          }
        }
      }
    } finally {
      setMessages(prev => prev.map(msg => 
        msg.id === botMessageId 
          ? { ...msg, isStreaming: false }
          : msg
      ));
    }
  };

  // Enhanced sendMessage with security improvements
  const sendMessage = useCallback(async () => {
    // Allow sending even with empty message
    console.log('sendMessage called with:', inputMessage);

    // Rate limiting check
    if (!messageRateLimiter()) {
      toast({
        title: t('error', settings.language),
        description: 'Too many messages. Please wait a moment before sending another message.',
        variant: "destructive"
      });
      return;
    }

    // Use inputMessage even if empty
    const messageToSend = inputMessage || "Hello";
    const sanitizedInput = sanitizeInput(messageToSend);
    const detectedLanguage = detectLanguage(sanitizedInput);
    
    if (detectedLanguage !== settings.language) {
      setSettings(prev => ({ ...prev, language: detectedLanguage }));
      console.log(`Auto-switched language from ${settings.language} to ${detectedLanguage} based on user input`);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: sanitizedInput,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setTimeout(scrollToBottom, 100);
    
    const recentMessages = messages.slice(-10);
    const contextualHistory = recentMessages.map(msg => ({
      role: msg.isUser ? 'user' : 'assistant',
      content: msg.content
    }));

    const newContext = `Previous conversation context: ${recentMessages.map(msg => 
      `${msg.isUser ? 'User' : 'Assistant'}: ${msg.content}`
    ).join(' | ')}`;
    setConversationContext(newContext);

    setInputMessage('');
    setIsLoading(true);
    setHasStartedChat(true);

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: '',
      isUser: false,
      timestamp: new Date(),
      isStreaming: true
    };

    setMessages(prev => [...prev, botMessage]);
    setTimeout(scrollToBottom, 100);

    try {
      const responseLanguage = detectedLanguage !== settings.language ? detectedLanguage : settings.language;
      
      const languageInstruction = responseLanguage === 'ar' 
        ? 'You MUST respond ONLY in Arabic language (العربية). Maintain conversation context and remember what we discussed.'
        : 'You MUST respond ONLY in English language. Maintain conversation context and remember what we discussed.';

      // Sanitize pre-instructions to prevent injection
      const sanitizedPreInstructions = sanitizeInput(settings.preInstructions || '');

      const contextualPrompt = `${ZAKI_ORDERS}

${languageInstruction}

${sanitizedPreInstructions ? `Additional User Instructions: ${sanitizedPreInstructions}\n` : ''}

Conversation Context: You are continuing an ongoing conversation. Here is the recent conversation history:
${contextualHistory.map((msg, idx) => `${idx + 1}. ${msg.role}: ${msg.content}`).join('\n')}

Current user message: ${sanitizedInput}

Please respond naturally as part of this ongoing conversation, maintaining context and remembering previous topics discussed. Do not ask for clarification unless absolutely necessary since you have the conversation history above.`;

      console.log('Enhanced contextual request with security:', {
        url: 'https://zaki-worker.a7mdz3ar.workers.dev',
        historyLength: contextualHistory.length,
        language: responseLanguage,
        hasContext: !!conversationContext,
        inputValidated: true
      });

      const requestBody = {
        message: contextualPrompt,
        language: responseLanguage,
        conversation_history: contextualHistory,
        conversation_context: conversationContext,
        strict_language: true,
        stream: true
      };

      const response = await fetch('https://zaki-worker.a7mdz3ar.workers.dev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType?.includes('text/event-stream') || contentType?.includes('application/x-ndjson')) {
        await streamBotResponse(response, botMessage.id);
      } else {
        const data = await response.json();
        let botResponseContent = 'An error occurred. Please try again.';
        
        if (data.choices && data.choices[0].message?.content) {
          botResponseContent = sanitizeInput(data.choices[0].message.content);
        } else if (data.response) {
          botResponseContent = sanitizeInput(data.response);
        }
        
        setMessages(prev => prev.map(msg => 
          msg.id === botMessage.id 
            ? { ...msg, content: botResponseContent, isStreaming: false }
            : msg
        ));
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage = sanitizeErrorMessage(error);
      
      toast({
        title: t('error', settings.language),
        description: errorMessage,
        variant: "destructive"
      });
      
      setMessages(prev => prev.map(msg => 
        msg.id === botMessage.id 
          ? { ...msg, content: errorMessage, isStreaming: false }
          : msg
      ));
    } finally {
      setIsLoading(false);
      setTimeout(scrollToBottom, 200);
    }
  }, [inputMessage, messages, settings, conversationContext]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setHasStartedChat(false);
    setConversationContext('');
    localStorage.removeItem('zaki-messages');
    localStorage.removeItem('zaki-conversation-context');
    localStorage.removeItem('zaki-has-started-chat');
    setShowDeleteConfirm(false);
    toast({
      title: t('deleted', settings.language),
      description: t('deletedDesc', settings.language)
    });
  }, [settings.language]);

  const confirmDownload = async (format: 'jpg' | 'txt') => {
    setShowDownloadConfirm(false);
  };

  const shareChat = async () => {
    if (messages.length === 0) {
      toast({
        title: t('error', settings.language),
        description: "No messages to share"
      });
      return;
    }

    const chatContent = messages.map(msg => 
      `${msg.isUser ? 'User' : 'Zaki'}: ${msg.content}`
    ).join('\n\n');

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Zaki One Chat',
          text: chatContent
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(chatContent);
      toast({
        title: t('copied', settings.language),
        description: t('copiedDesc', settings.language)
      });
    }
  };

  const startChat = () => {
    setHasStartedChat(true);
  };

  const toggleDarkMode = useCallback(() => {
    // Save state before theme change to prevent loss
    saveStateToStorage(messages, settings, conversationContext, hasStartedChat);
    
    setUserHasManuallySetTheme(true);
    setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }));
  }, [messages, settings, conversationContext, hasStartedChat]);

  const goToMainPage = () => {
    setHasStartedChat(false);
  };

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration);
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    }
  }, []);

  if (!hasStartedChat) {
    return (
      <ErrorBoundary>
        <WelcomeScreen 
          onStartChat={() => setHasStartedChat(true)} 
          language={settings.language} 
          darkMode={settings.darkMode}
          onToggleDarkMode={toggleDarkMode}
        />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen-mobile overflow-x-hidden flex" dir={settings.language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="fixed inset-0 bg-gradient-to-br from-white via-emerald-50 to-emerald-100 dark:from-gray-900 dark:via-emerald-900 dark:to-black"></div>
        <div className="fixed inset-0 bg-emerald-600/5 dark:bg-black/40"></div>
        
        {/* Left Sidebar Ad - Desktop Only */}
        <div className="hidden lg:block fixed left-0 top-0 bottom-0 w-40 z-20">
          <div className="h-full flex items-center justify-center">
            <div id="ezoic-pub-ad-placeholder-102"></div>
          </div>
        </div>
        
        {/* Main Chat Container */}
        <div className="relative z-10 min-h-screen-mobile flex flex-col w-full lg:mx-40 max-w-4xl lg:max-w-none xl:max-w-4xl xl:mx-auto md:px-8 lg:px-0 xl:px-16">
          <header className="fixed top-4 left-0 right-0 bg-white/20 dark:bg-white/20 backdrop-blur-md border border-gray-600/60 dark:border-white/30 h-36 z-30 glass-effect rounded-[28px] md:left-8 md:right-8 lg:left-40 lg:right-40 xl:left-16 xl:right-16 md:mx-auto md:max-w-4xl xl:max-w-4xl">
            <div className="w-full h-full flex flex-col">
              {/* Upper Half - Ad Placement */}
              <div className="flex-1 flex items-center justify-center">
                <div id="ezoic-pub-ad-placeholder-101"></div>
              </div>
              
              {/* Separator Line */}
              <Separator className="bg-gray-400/30 dark:bg-white/20" />
              
              {/* Lower Half - Current Navigation Content */}
              <div className="flex-1 flex items-center px-4 pb-2">
                <div className="w-full flex items-center justify-between">
                  <button 
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded-[16px] p-1 touch-manipulation"
                    onClick={() => setHasStartedChat(false)}
                    type="button"
                    aria-label={settings.language === 'ar' ? 'الذهاب للصفحة الرئيسية' : 'Go to home page'}
                  >
                    <div className="w-8 h-8 rounded-[16px] overflow-hidden shadow-lg">
                      <img 
                        src="/lovable-uploads/f7072446-2cc0-4c29-9213-6109109a16e3.png" 
                        alt="Zaki.One Logo" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </button>
                  
                  <div className="absolute left-1/2 transform -translate-x-1/2">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                      Zaki.One
                    </h1>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowPreInstructions(true)}
                      className="text-gray-700 dark:text-white hover:bg-white/30 h-12 w-12 rounded-[16px] focus:ring-2 focus:ring-emerald-400 touch-manipulation button-touch-target"
                      aria-label={settings.language === 'ar' ? 'الإعدادات' : 'Settings'}
                    >
                      <Settings className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Chat Messages Container - Updated padding for new header height */}
          <div className="flex-1 overflow-y-auto pt-44 pb-32" ref={chatContainerRef}>
            <div className="w-full space-y-6 px-0">
              {messages.map((message) => (
                <ChatMessage 
                  key={message.id} 
                  message={message} 
                  language={settings.language}
                />
              ))}
            </div>
            <div ref={messagesEndRef} />
          </div>

          {/* Fixed Chat Input at Bottom */}
          <div className="fixed bottom-4 left-0 right-0 md:left-8 md:right-8 lg:left-40 lg:right-40 xl:left-16 xl:right-16 md:mx-auto md:max-w-4xl xl:max-w-4xl">
            <ChatInput
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              onSendMessage={sendMessage}
              isLoading={isLoading}
              language={settings.language}
              autoFocus={true}
            />
          </div>

          <ConfirmDeleteDialog
            isOpen={showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(false)}
            onConfirm={clearChat}
            language={settings.language}
          />

          <ConfirmDownloadDialog
            isOpen={false}
            onClose={() => setShowDownloadConfirm(false)}
            onConfirm={confirmDownload}
          />

          <PreInstructionsDialog
            isOpen={showPreInstructions}
            onClose={() => setShowPreInstructions(false)}
            value={settings.preInstructions}
            onChange={(value) => setSettings(prev => ({ ...prev, preInstructions: value }))}
            language={settings.language}
            onClearChat={() => setShowDeleteConfirm(true)}
          />
        </div>
        
        {/* Right Sidebar Ad - Desktop Only */}
        <div className="hidden lg:block fixed right-0 top-0 bottom-0 w-40 z-20">
          <div className="h-full flex items-center justify-center">
            <div id="ezoic-pub-ad-placeholder-103"></div>
          </div>
        </div>
        
        {/* Ad Scripts */}
        <script dangerouslySetInnerHTML={{
          __html: `
            ezstandalone.cmd.push(function () {
              ezstandalone.showAds(101);
            });
            ezstandalone.cmd.push(function () {
              ezstandalone.showAds(102);
            });
            ezstandalone.cmd.push(function () {
              ezstandalone.showAds(103);
            });
          `
        }} />
      </div>
    </ErrorBoundary>
  );
};

export default Index;
