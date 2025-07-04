import React, { useState } from 'react';
import { Copy, Download, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface BetterMessageRendererProps {
  content: string;
  language: 'en' | 'ar';
}

const BetterMessageRenderer: React.FC<BetterMessageRendererProps> = ({ content, language }) => {
  const [copiedBlocks, setCopiedBlocks] = useState<Set<number>>(new Set());

  const copyToClipboard = async (text: string, blockIndex: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedBlocks(prev => new Set([...prev, blockIndex]));
      toast({
        title: 'Copied',
        description: 'Code copied to clipboard'
      });
      setTimeout(() => {
        setCopiedBlocks(prev => {
          const newSet = new Set(prev);
          newSet.delete(blockIndex);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: 'Error',
        description: 'Failed to copy text',
        variant: 'destructive'
      });
    }
  };

  const downloadAsFile = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Downloaded',
      description: 'File downloaded successfully'
    });
  };

  const renderContent = () => {
    const codeBlockRegex = /```([\w]*)\n?([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    let codeBlockIndex = 0;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        const textBefore = content.slice(lastIndex, match.index);
        if (textBefore.trim()) {
          parts.push(
            <div key={`text-${lastIndex}`}>
              {formatText(textBefore)}
            </div>
          );
        }
      }

      const detectedLanguage = match[1] || 'code';
      const code = match[2].trim();
      const currentBlockIndex = codeBlockIndex;

      parts.push(
        <div key={`code-${currentBlockIndex}`} className="my-4 rounded-lg border border-emerald-200 dark:border-emerald-700 overflow-hidden bg-emerald-50 dark:bg-emerald-900 shadow-sm glass-effect">
          <div className="flex items-center justify-between bg-emerald-100 dark:bg-emerald-800 px-3 py-2 border-b border-emerald-200 dark:border-emerald-700">
            <span className="text-sm text-emerald-700 dark:text-emerald-300 font-mono font-medium">
              {detectedLanguage}
            </span>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(code, currentBlockIndex)}
                className="h-8 w-8 p-0 hover:bg-emerald-200 dark:hover:bg-emerald-700 touch-manipulation rounded-md transition-colors button-touch-target"
                title="Copy code"
              >
                {copiedBlocks.has(currentBlockIndex) ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => downloadAsFile(code, `code-${Date.now()}.${detectedLanguage === 'code' ? 'txt' : detectedLanguage}`)}
                className="h-8 w-8 p-0 hover:bg-emerald-200 dark:hover:bg-emerald-700 touch-manipulation rounded-md transition-colors button-touch-target"
                title="Download code"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <pre className="p-4 text-sm font-mono leading-relaxed">
              <code className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words block">
                {code}
              </code>
            </pre>
          </div>
        </div>
      );

      lastIndex = match.index + match[0].length;
      codeBlockIndex++;
    }

    if (lastIndex < content.length) {
      const remainingText = content.slice(lastIndex);
      if (remainingText.trim()) {
        parts.push(
          <div key={`text-${lastIndex}`}>
            {formatText(remainingText)}
          </div>
        );
      }
    }

    if (parts.length === 0) {
      parts.push(
        <div key="text-only">
          {formatText(content)}
        </div>
      );
    }

    return parts;
  };

  const formatText = (text: string) => {
    return text
      .split("\n")
      .map((line, lineIndex) => {
        if (!line.trim()) {
          return <br key={lineIndex} />;
        }

        const trimmedLine = line.trim();
        
        // Enhanced title detection
        const isTitle = 
          trimmedLine.endsWith("?") || 
          trimmedLine.endsWith("؟") || 
          (trimmedLine.endsWith(":") && (
            trimmedLine.startsWith("بالطبع") ||
            trimmedLine.startsWith("هل ترغب") ||
            trimmedLine.startsWith("كيف يمكن") ||
            trimmedLine.startsWith("ما هي") ||
            trimmedLine.startsWith("How to") ||
            trimmedLine.startsWith("What is") ||
            trimmedLine.startsWith("Where to") ||
            trimmedLine.startsWith("When to") ||
            trimmedLine.startsWith("Why") ||
            trimmedLine.length > 25
          ));

        if (isTitle) {
          return (
            <h3
              key={lineIndex}
              className={`text-2xl mb-4 mt-6 font-bold text-emerald-800 dark:text-emerald-300 ${language === "ar" ? "text-right" : "text-left"} leading-tight`}
              style={{ fontWeight: 700 }}
            >
              {formatInlineElements(line)}
            </h3>
          );
        }

        // Enhanced subtitle detection
        const wordCount = trimmedLine.split(" ").length;
        const isSubtitle = trimmedLine.endsWith(":") && !isTitle && wordCount >= 2 && wordCount <= 8;

        if (isSubtitle) {
          return (
            <h4
              key={lineIndex}
              className={`text-xl mb-3 mt-4 font-semibold text-emerald-700 dark:text-emerald-400 ${language === "ar" ? "text-right" : "text-left"} leading-snug`}
              style={{ fontWeight: 600 }}
            >
              {formatInlineElements(line)}
            </h4>
          );
        }

        // List items - Fixed English bullet point alignment
        if (line.match(/^[\s]*[-*+]\s/)) {
          const content = line.replace(/^[\s]*[-*+]\s/, "");
          const formattedContent = formatInlineElements(content);

          if (language === "ar") {
            return (
              <div
                key={lineIndex}
                className="mb-3 mr-4"
                style={{
                  direction: "rtl",
                  textAlign: "right",
                  paddingRight: "1rem",
                }}
              >
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">
                  •{" "}
                </span>
                <span className="text-gray-800 dark:text-gray-200 text-lg">{formattedContent}</span>
              </div>
            );
          } else {
            return (
              <div
                key={lineIndex}
                className="flex items-start mb-3 ml-4"
              >
                <span className="text-emerald-600 dark:text-emerald-400 font-bold mr-3 text-lg">
                  •
                </span>
                <span className="flex-1 text-left text-gray-800 dark:text-gray-200 text-lg">{formattedContent}</span>
              </div>
            );
          }
        }

        // Numbered lists - Fixed English number alignment
        if (line.match(/^[\s]*\d+\.\s/)) {
          const content = line.replace(/^[\s]*\d+\.\s/, "");
          const formattedContent = formatInlineElements(content);
          const number = line.match(/^[\s]*(\d+)\./)?.[1];

          if (language === "ar") {
            return (
              <div
                key={lineIndex}
                className="mb-3 mr-4"
                style={{ direction: "rtl", textAlign: "right" }}
              >
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">
                  {number}.
                </span>
                <span className="mr-3 text-gray-800 dark:text-gray-200 text-lg">{formattedContent}</span>
              </div>
            );
          } else {
            return (
              <div className="flex items-start mb-3 ml-4" key={lineIndex}>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold min-w-[24px] mr-3 text-lg">
                  {number}.
                </span>
                <span className="flex-1 text-left text-gray-800 dark:text-gray-200 text-lg">
                  {formattedContent}
                </span>
              </div>
            );
          }
        }

        // Inline code
        if (line.includes("`") && !line.startsWith("```")) {
          const formattedLine = formatInlineElements(line);
          return (
            <p
              key={lineIndex}
              className={`mb-4 text-gray-800 dark:text-gray-200 leading-relaxed text-lg ${language === "ar" ? "text-right" : "text-left"}`}
            >
              {formattedLine}
            </p>
          );
        }

        // Regular paragraphs
        const formattedLine = formatInlineElements(line);
        return (
          <p
            key={lineIndex}
            className={`mb-4 text-gray-800 dark:text-gray-200 leading-relaxed text-lg ${language === "ar" ? "text-right" : "text-left"}`}
          >
            {formattedLine}
          </p>
        );
      });
  };

  const formatInlineElements = (text: string) => {
    const parts = [];
    let currentIndex = 0;

    // Handle inline code first
    const inlineCodeRegex = /`([^`]+)`/g;
    let codeMatch;
    const codeMatches = [];
    
    while ((codeMatch = inlineCodeRegex.exec(text)) !== null) {
      codeMatches.push(codeMatch);
    }

    // Handle bold formatting, but avoid asterisks inside code blocks
    const boldRegex = /\*\*((?:(?!\*\*).)*?)\*\*|__((?:(?!__).)*?)__/g;
    let match;
    const allMatches = [];

    // Collect all bold matches that don't overlap with code
    while ((match = boldRegex.exec(text)) !== null) {
      const isInsideCode = codeMatches.some(codeMatch => 
        match.index >= codeMatch.index && match.index < codeMatch.index + codeMatch[0].length
      );
      
      if (!isInsideCode) {
        allMatches.push({ ...match, type: 'bold' });
      }
    }

    // Add code matches
    codeMatches.forEach(codeMatch => {
      allMatches.push({ ...codeMatch, type: 'code' });
    });

    // Sort by position
    allMatches.sort((a, b) => a.index - b.index);

    allMatches.forEach(match => {
      if (match.index > currentIndex) {
        parts.push(text.slice(currentIndex, match.index));
      }

      if (match.type === 'bold') {
        const boldText = match[1] || match[2];
        parts.push(
          <strong key={`bold-${match.index}`} className="font-bold text-emerald-800 dark:text-emerald-300">
            {boldText}
          </strong>
        );
      } else if (match.type === 'code') {
        parts.push(
          <code
            key={`inline-${match.index}`}
            className="bg-emerald-100 dark:bg-emerald-800 px-2 py-1 rounded text-sm font-mono text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-700"
          >
            {match[1]}
          </code>
        );
      }
      
      currentIndex = match.index + match[0].length;
    });

    if (currentIndex < text.length) {
      parts.push(text.slice(currentIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className={`prose dark:prose-invert max-w-none ${language === 'ar' ? 'text-right' : 'text-left'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {renderContent()}
    </div>
  );
};

export default BetterMessageRenderer;
