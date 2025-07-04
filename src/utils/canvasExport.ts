
export const createCanvasExport = async (
  messages: Array<{ id: string; content: string; isUser: boolean; timestamp: Date }>,
  darkMode: boolean,
  language: 'ar' | 'en'
): Promise<Blob | null> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Enhanced canvas dimensions and settings for higher quality
  const width = 1200; // Increased width
  const padding = 50; // Increased padding
  const messageSpacing = 50; // Increased spacing
  const avatarSize = 60; // Increased avatar size
  const maxMessageWidth = width - (padding * 2) - 40;

  // Colors - Updated to white and royal green theme
  const bgColor = darkMode ? '#1f2937' : '#ffffff';
  const userBubbleColor = '#059669';
  const userTextColor = '#ffffff';
  const botTextColor = darkMode ? '#ffffff' : '#1f2937';
  const timestampColor = darkMode ? '#9ca3af' : '#6b7280';
  const headerColor = '#059669';

  // Enhanced font setup with better sizing
  const arabicFont = '20px "Noto Sans Arabic", "Arial Unicode MS", "Tahoma", sans-serif';
  const englishFont = '20px "Segoe UI", "Roboto", "Arial", sans-serif';
  const titleFont = 'bold 22px "Noto Sans Arabic", "Arial Unicode MS", "Tahoma", sans-serif';
  const headerFont = 'bold 36px "Segoe UI", Arial, sans-serif';

  // Function to detect message language
  const detectMessageLanguage = (text: string): 'ar' | 'en' => {
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    const arabicChars = (text.match(new RegExp(arabicRegex, 'g')) || []).length;
    const totalChars = text.replace(/\s+/g, '').length;
    return arabicChars / totalChars > 0.3 ? 'ar' : 'en';
  };

  // Enhanced height calculation
  let totalHeight = 140; // Header space
  
  messages.forEach(message => {
    const msgLang = detectMessageLanguage(message.content);
    ctx.font = message.isUser ? englishFont : (msgLang === 'ar' ? arabicFont : englishFont);
    const lines = wrapText(ctx, message.content, maxMessageWidth - 60, msgLang);
    const messageHeight = Math.max(100, (lines.length * 30) + 80); // Increased line height
    totalHeight += messageHeight + messageSpacing;
  });

  // Set high resolution canvas
  const devicePixelRatio = window.devicePixelRatio || 1;
  canvas.width = width * devicePixelRatio;
  canvas.height = (totalHeight + 100) * devicePixelRatio; // Extra bottom padding
  ctx.scale(devicePixelRatio, devicePixelRatio);

  // Clear canvas with background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, totalHeight + 100);

  // Draw enhanced header with branding
  ctx.fillStyle = headerColor;
  ctx.fillRect(0, 0, width, 120);
  
  ctx.font = headerFont;
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Zaki.One', width / 2, 50);
  
  ctx.font = '18px Arial, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.globalAlpha = 0.9;
  ctx.fillText('AI Chatbot Conversation', width / 2, 80);
  
  ctx.font = '14px Arial, sans-serif';
  ctx.fillText(`Generated on ${new Date().toLocaleDateString()}`, width / 2, 100);
  ctx.globalAlpha = 1;

  let currentY = 160;

  // Draw messages with enhanced formatting
  messages.forEach(message => {
    const isUser = message.isUser;
    const msgLang = detectMessageLanguage(message.content);
    
    // Set font based on message type and language
    ctx.font = isUser ? englishFont : (msgLang === 'ar' ? arabicFont : englishFont);
    
    const lines = wrapText(ctx, message.content, maxMessageWidth - 60, msgLang);
    const messageHeight = Math.max(100, (lines.length * 30) + 80);

    if (isUser) {
      // User messages with avatar and bubble (right side)
      const avatarX = width - padding - avatarSize;
      const avatarY = currentY;
      
      // Draw avatar background
      ctx.fillStyle = userBubbleColor;
      ctx.beginPath();
      ctx.roundRect(avatarX, avatarY, avatarSize, avatarSize, 30);
      ctx.fill();

      // Draw avatar icon
      ctx.fillStyle = '#ffffff';
      ctx.font = '28px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('👤', avatarX + avatarSize / 2, avatarY + avatarSize / 2);

      // Message bubble
      const bubbleWidth = Math.min(maxMessageWidth * 0.7, 500);
      const bubbleX = avatarX - bubbleWidth - 20;
      const bubbleY = currentY;
      const bubbleHeight = messageHeight - 40;
      
      ctx.fillStyle = userBubbleColor;
      ctx.beginPath();
      ctx.roundRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, 20);
      ctx.fill();

      // User message text
      ctx.fillStyle = userTextColor;
      ctx.font = englishFont;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';

      lines.forEach((line, lineIndex) => {
        ctx.fillText(line, bubbleX + 25, bubbleY + 25 + (lineIndex * 30));
      });

      // Timestamp
      ctx.fillStyle = timestampColor;
      ctx.font = '14px Arial, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(
        message.timestamp.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        bubbleX + bubbleWidth - 25,
        bubbleY + bubbleHeight - 25
      );
    } else {
      // Bot messages - full width, properly formatted like in chat
      ctx.fillStyle = botTextColor;
      ctx.font = msgLang === 'ar' ? arabicFont : englishFont;
      ctx.textAlign = msgLang === 'ar' ? 'right' : 'left';
      ctx.textBaseline = 'top';

      const textX = msgLang === 'ar' ? width - padding - 20 : padding + 20;
      
      lines.forEach((line, lineIndex) => {
        // Enhanced formatting detection
        const shouldBeBold = isTitle(line, msgLang) || isSubtitle(line, msgLang);
        
        if (shouldBeBold) {
          ctx.font = msgLang === 'ar' ? titleFont : 'bold 20px "Segoe UI", "Roboto", "Arial", sans-serif';
        } else {
          ctx.font = msgLang === 'ar' ? arabicFont : englishFont;
        }
        
        // Enhanced text rendering with proper spacing
        const lineY = currentY + 20 + (lineIndex * 30);
        ctx.fillText(line, textX, lineY);
        
        // Add subtle underline for titles
        if (shouldBeBold && lineIndex === 0) {
          ctx.strokeStyle = botTextColor;
          ctx.lineWidth = 1;
          ctx.beginPath();
          const textWidth = ctx.measureText(line).width;
          const underlineX = msgLang === 'ar' ? textX - textWidth : textX;
          ctx.moveTo(underlineX, lineY + 25);
          ctx.lineTo(underlineX + textWidth, lineY + 25);
          ctx.stroke();
        }
      });

      // Timestamp for bot messages
      ctx.fillStyle = timestampColor;
      ctx.font = '14px Arial, sans-serif';
      ctx.textAlign = msgLang === 'ar' ? 'right' : 'left';
      const timestampY = currentY + messageHeight - 30;
      ctx.fillText(
        message.timestamp.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        textX,
        timestampY
      );
    }

    currentY += messageHeight + messageSpacing;
  });

  // Enhanced footer
  ctx.fillStyle = headerColor;
  ctx.fillRect(0, currentY, width, 60);
  ctx.fillStyle = '#ffffff';
  ctx.font = '16px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Generated by Zaki.One - AI Chatbot', width / 2, currentY + 35);

  // Convert to high-quality blob
  return new Promise((resolve) => {
    canvas.toBlob(resolve, 'image/jpeg', 0.98); // Increased quality
  });
};

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, language: 'ar' | 'en'): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.length > 0 ? lines : [text];
}

function isTitle(text: string, language: 'ar' | 'en'): boolean {
  const trimmed = text.trim();
  
  if (language === 'ar') {
    return trimmed.endsWith('؟') || 
           (trimmed.endsWith(':') && (
             trimmed.startsWith('بالطبع') ||
             trimmed.startsWith('هل ترغب') ||
             trimmed.includes('##') ||
             trimmed.length > 25
           ));
  } else {
    return trimmed.endsWith('?') || 
           (trimmed.endsWith(':') && (trimmed.length > 30 || trimmed.includes('##')));
  }
}

function isSubtitle(text: string, language: 'ar' | 'en'): boolean {
  const trimmed = text.trim();
  const wordCount = trimmed.split(' ').length;
  
  return (trimmed.endsWith(':') || trimmed.includes('**')) && 
         !isTitle(text, language) && 
         wordCount >= 2 && 
         wordCount <= 8;
}
