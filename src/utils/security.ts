
import DOMPurify from 'dompurify';

// Input sanitization
export const sanitizeInput = (input: string): string => {
  // Remove potentially dangerous HTML/script content
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [], 
    ALLOWED_ATTR: [] 
  }).trim();
};

// Message validation
export const validateMessage = (message: string): { isValid: boolean; error?: string } => {
  if (!message || typeof message !== 'string') {
    return { isValid: false, error: 'Invalid message format' };
  }
  
  const sanitized = sanitizeInput(message);
  
  if (sanitized.length === 0) {
    return { isValid: false, error: 'Message cannot be empty' };
  }
  
  if (sanitized.length > 4000) {
    return { isValid: false, error: 'Message too long' };
  }
  
  return { isValid: true };
};

// Rate limiting helper
export const createRateLimiter = (maxRequests: number, windowMs: number) => {
  const requests: number[] = [];
  
  return (): boolean => {
    const now = Date.now();
    // Remove old requests outside the window
    while (requests.length > 0 && requests[0] <= now - windowMs) {
      requests.shift();
    }
    
    if (requests.length >= maxRequests) {
      return false; // Rate limited
    }
    
    requests.push(now);
    return true;
  };
};

// Sanitize error messages to prevent information disclosure
export const sanitizeErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    // Only return safe, user-friendly error messages
    if (error.message.includes('Network') || error.message.includes('fetch')) {
      return 'Connection error. Please check your internet connection.';
    }
    if (error.message.includes('API')) {
      return 'Service temporarily unavailable. Please try again later.';
    }
    return 'An unexpected error occurred. Please try again.';
  }
  return 'An unexpected error occurred. Please try again.';
};
