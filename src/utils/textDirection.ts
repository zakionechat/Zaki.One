
export const detectTextDirection = (text: string): 'rtl' | 'ltr' => {
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
  const arabicChars = (text.match(new RegExp(arabicRegex, 'g')) || []).length;
  const totalChars = text.replace(/\s+/g, '').length;
  
  // If more than 30% of characters are Arabic, consider it RTL
  return arabicChars / totalChars > 0.3 ? 'rtl' : 'ltr';
};
