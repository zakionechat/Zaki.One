
import React, { useState, useEffect, useRef } from 'react';
import MessageRenderer from './MessageRenderer';

interface StreamingMessageProps {
  content: string;
  isStreaming: boolean;
  language: 'en' | 'ar';
}

const StreamingMessage: React.FC<StreamingMessageProps> = ({ 
  content, 
  isStreaming, 
  language 
}) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const streamingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isStreaming && currentIndex < content.length) {
      // Enhanced streaming with variable speed based on content
      const getStreamingSpeed = (char: string, index: number) => {
        // Faster for spaces and punctuation
        if (char === ' ' || char === '\n') return 3;
        if (['.', '!', '?', ',', ';', ':'].includes(char)) return 25;
        // Slower for the beginning to create anticipation
        if (index < 10) return 40;
        // Normal speed for regular characters
        return 12;
      };

      const char = content[currentIndex];
      const speed = getStreamingSpeed(char, currentIndex);

      streamingIntervalRef.current = setTimeout(() => {
        setDisplayedContent(content.slice(0, currentIndex + 1));
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => {
        if (streamingIntervalRef.current) {
          clearTimeout(streamingIntervalRef.current);
        }
      };
    } else if (!isStreaming) {
      // Immediately show full content when not streaming
      setDisplayedContent(content);
      setCurrentIndex(content.length);
    }
  }, [content, currentIndex, isStreaming]);

  useEffect(() => {
    // Reset when content changes
    if (content !== displayedContent && !isStreaming) {
      setDisplayedContent(content);
      setCurrentIndex(content.length);
    }
  }, [content, isStreaming]);

  useEffect(() => {
    // Clean up on unmount
    return () => {
      if (streamingIntervalRef.current) {
        clearTimeout(streamingIntervalRef.current);
      }
    };
  }, []);

  return (
    <div 
      className="relative selectable-bot-content chat-message-mobile text-lg"
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
    >
      <div 
        className="selectable-bot-content text-lg"
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
      >
        <MessageRenderer content={displayedContent} language={language} />
      </div>
      {isStreaming && (
        <span 
          className="inline-block w-2 h-4 bg-emerald-500 animate-pulse ml-1 rounded-sm"
          style={{
            animation: 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            boxShadow: '0 0 8px rgba(16, 185, 129, 0.5)'
          }}
        />
      )}
    </div>
  );
};

export default StreamingMessage;
