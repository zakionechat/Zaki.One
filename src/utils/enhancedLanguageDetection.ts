export const detectBrowserLanguage = (): 'ar' | 'en' => {
  if (typeof window === 'undefined' || !window.navigator) {
    return 'ar'; // Default to Arabic for SEO
  }

  const language = window.navigator.language || 'ar';
  return language.startsWith('ar') ? 'ar' : 'en';
};

export const t = (key: string, language: 'ar' | 'en'): string => {
  const translations: Record<string, Record<string, string>> = {
    welcome: {
      en: 'Welcome to Zaki.One - Advanced AI Chat',
      ar: 'مرحباً بك في زكي.ون - دردشة الذكاء الاصطناعي المتطورة'
    },
    subtitle: {
      en: 'Your intelligent Arabic AI companion for smart conversations and business solutions.',
      ar: 'رفيقك الذكي في دردشة الذكاء الاصطناعي - أفضل روبوت دردشة عربي للشركات والأفراد'
    },
    startChat: {
      en: 'Start AI Chat',
      ar: 'ابدأ دردشة الذكاء الاصطناعي'
    },
    shareWithFriends: {
      en: 'Share Arabic AI Chat',
      ar: 'شارك روبوت الدردشة الذكي'
    },
    feature1Title: {
      en: 'Advanced AI Conversations',
      ar: 'دردشة الذكاء الاصطناعي المتطورة'
    },
    feature1Desc: {
      en: 'Experience intelligent Arabic conversations with our advanced AI chatbot technology.',
      ar: 'استمتع بمحادثات ذكية باللغة العربية مع تقنية روبوت الدردشة الذكي المتطورة'
    },
    feature2Title: {
      en: 'Business AI Solutions',
      ar: 'حلول الذكاء الاصطناعي للشركات'
    },
    feature2Desc: {
      en: 'Comprehensive AI solutions for businesses with enterprise-level security and privacy.',
      ar: 'حلول شاملة للذكاء الاصطناعي للشركات مع أمان وخصوصية على مستوى المؤسسات'
    },
    feature3Title: {
      en: 'Smart Arabic Processing',
      ar: 'معالجة ذكية للغة العربية'
    },
    feature3Desc: {
      en: 'Native Arabic language understanding with fast, accurate responses from your AI assistant.',
      ar: 'فهم طبيعي للغة العربية مع ردود سريعة ودقيقة من مساعدك الذكي'
    },
    footer: {
      en: '© 2024 Zaki.One - Leading Arabic AI Chat Platform. All rights reserved.',
      ar: '© 2024 زكي.ون - منصة دردشة الذكاء الاصطناعي العربية الرائدة. جميع الحقوق محفوظة.'
    },
    installApp: {
      en: 'Install App',
      ar: 'تثبيت التطبيق'
    },
    installTitle: {
      en: 'Install App',
      ar: 'تثبيت التطبيق'
    },
    installStep1: {
      en: 'Tap the Share button in Safari',
      ar: 'اضغط على زر المشاركة في سفاري'
    },
    installStep2: {
      en: 'Scroll down and tap "Add to Home Screen"',
      ar: 'مرر لأسفل واضغط على "إضافة إلى الشاشة الرئيسية"'
    },
    installStep3: {
      en: 'Tap "Add" to install the app',
      ar: 'اضغط على "إضافة" لتثبيت التطبيق'
    },
    installUnderstood: {
      en: 'Got it',
      ar: 'فهمت'
    },
    thinking: {
      en: 'Zaki is thinking...',
      ar: 'زكي يفكر...'
    },
    download: {
      en: 'Download Chat',
      ar: 'تحميل الدردشة'
    },
    deleted: {
      en: 'Chat Cleared!',
      ar: 'تم مسح الدردشة!'
    },
    deletedDesc: {
      en: 'The chat has been successfully cleared.',
      ar: 'تم مسح الدردشة بنجاح.'
    },
    clearChat: {
      en: 'Clear Chat',
      ar: 'مسح الدردشة'
    },
    deleteTitle: {
      en: 'Clear Chat',
      ar: 'مسح الدردشة'
    },
    deleteMessage: {
      en: 'Are you sure you want to clear all chat messages? This action cannot be undone.',
      ar: 'هل أنت متأكد من أنك تريد مسح جميع رسائل الدردشة؟ لا يمكن التراجع عن هذا الإجراء.'
    },
    confirmDelete: {
      en: 'Clear Chat',
      ar: 'مسح الدردشة'
    },
    downloadConfirm: {
      en: 'Download Chat History?',
      ar: 'تنزيل سجل الدردشة؟'
    },
    downloadConfirmDesc: {
      en: 'Choose the format to download your chat history.',
      ar: 'اختر التنسيق لتنزيل سجل الدردشة الخاص بك.'
    },
    downloadAsText: {
      en: 'Download as Text',
      ar: 'تنزيل كنص'
    },
    downloadAsImage: {
      en: 'Download as Image',
      ar: 'تنزيل كصورة'
    },
    error: {
      en: 'Error',
      ar: 'خطأ'
    },
    shared: {
      en: 'Shared!',
      ar: 'تمت المشاركة!'
    },
    sharedDesc: {
      en: 'Thanks for sharing Zaki with your friends!',
      ar: 'شكراً لمشاركة زكي مع أصدقائك!'
    },
    copied: {
      en: 'Copied!',
      ar: 'تم النسخ!'
    },
    copiedDesc: {
      en: 'Chat content copied to clipboard.',
      ar: 'تم نسخ محتوى الدردشة إلى الحافظة.'
    },
    instructionsTitle: {
      en: 'AI Chat Instructions',
      ar: 'تعليمات دردشة الذكاء الاصطناعي'
    },
    instructionsDesc: {
      en: 'Customize Zaki\'s AI behavior with specific instructions for enhanced chat experience.',
      ar: 'خصص سلوك زكي الذكي بتعليمات محددة لتجربة دردشة محسنة.'
    },
    preInstructions: {
      en: 'Insert Pre-Instructions For AI Chat',
      ar: 'أدخل تعليمات مسبقة لدردشة الذكاء الاصطناعي'
    },
    preInstructionsPlaceholder: {
      en: 'Pre-Instructions Will Be Applied For Current AI Chat Session',
      ar: 'التعليمات المسبقة ستطبق على جلسة دردشة الذكاء الاصطناعي الحالية'
    },
    save: {
      en: 'Save',
      ar: 'حفظ'
    },
    saved: {
      en: 'Saved',
      ar: 'تم الحفظ'
    },
    cancel: {
      en: 'Cancel',
      ar: 'إلغاء'
    },
    clear: {
      en: 'Clear',
      ar: 'مسح'
    },
    confirmClear: {
      en: 'Confirm Clear',
      ar: 'تأكيد المسح'
    },
    confirmClearDesc: {
      en: 'Are you sure you want to clear the AI chat history?',
      ar: 'هل أنت متأكد أنك تريد مسح سجل دردشة الذكاء الاصطناعي؟'
    },
    share: {
      en: 'Share',
      ar: 'شارك'
    },
    placeholder: {
      en: 'Ask Zaki anything about AI, business solutions, or start your intelligent conversation.',
      ar: 'اسأل زكي عن أي شيء حول الذكاء الاصطناعي أو حلول الأعمال أو ابدأ محادثتك الذكية.'
    },
    delete: {
      en: 'Clear AI Chat',
      ar: 'مسح دردشة الذكاء الاصطناعي'
    },
  };

  return translations[key]?.[language] || key;
};

// SEO Keywords for internal linking and content optimization
export const arabicSEOKeywords = [
  'دردشة الذكاء الاصطناعي',
  'روبوت الدردشة الذكي',
  'أفضل روبوت دردشة عربي',
  'حلول الذكاء الاصطناعي للشركات',
  'تطوير روبوتات الدردشة',
  'خدمات الذكاء الاصطناعي للمؤسسات',
  'تقنية الذكاء الاصطناعي في الأعمال',
  'حلول الدردشة الذكية',
  'برمجة روبوتات دردشة عربية',
  'أدوات الذكاء الاصطناعي للأعمال'
];

export const generateSEOContent = (language: 'ar' | 'en') => {
  if (language === 'ar') {
    return {
      title: 'زكي.ون - دردشة الذكاء الاصطناعي | أفضل روبوت دردشة عربي ذكي',
      description: 'استمتع بأفضل تجربة دردشة الذكاء الاصطناعي باللغة العربية مع زكي.ون. روبوت الدردشة الذكي المتطور للشركات والأفراد مع حلول الذكاء الاصطناعي المتقدمة.',
      keywords: arabicSEOKeywords
    };
  }
  
  return {
    title: 'Zaki.One - Advanced Arabic AI Chat | Smart Chatbot Solutions',
    description: 'Experience the best Arabic AI chat with Zaki.One. Advanced intelligent chatbot for businesses and individuals with cutting-edge AI solutions.',
    keywords: ['Arabic AI Chat', 'Smart Chatbot', 'AI Solutions', 'Business AI', 'Zaki One']
  };
};
