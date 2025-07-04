
export const detectBrowserLanguage = (): 'ar' | 'en' => {
  if (typeof window === 'undefined' || !window.navigator) {
    return 'en';
  }

  const language = window.navigator.language || 'en';
  return language.startsWith('ar') ? 'ar' : 'en';
};

export const t = (key: string, language: 'ar' | 'en'): string => {
  const translations: Record<string, Record<string, string>> = {
    welcome: {
      en: 'Welcome to Zaki.One',
      ar: 'مرحباً بك في زكي.ون'
    },
    subtitle: {
      en: 'Your AI companion for insightful conversations.',
      ar: 'رفيقك الذكي في محادثات ثرية.'
    },
    startChat: {
      en: 'Start Chatting',
      ar: 'ابدأ الدردشة'
    },
    shareWithFriends: {
      en: 'Share with Friends',
      ar: 'شارك مع الأصدقاء'
    },
    feature1Title: {
      en: 'Intelligent Conversations',
      ar: 'محادثات ذكية'
    },
    feature1Desc: {
      en: 'Engage in meaningful dialogues with an AI that understands.',
      ar: 'انخرط في حوارات هادفة مع ذكاء اصطناعي يفهم.'
    },
    feature2Title: {
      en: 'Privacy Focused',
      ar: 'التركيز على الخصوصية'
    },
    feature2Desc: {
      en: 'Your conversations are secure and private.',
      ar: 'محادثاتك آمنة وخاصة.'
    },
    feature3Title: {
      en: 'Fast Replies',
      ar: 'ردود سريعة'
    },
    feature3Desc: {
      en: 'Get quick and responsive answers from your AI assistant.',
      ar: 'احصل على إجابات سريعة ومتجاوبة من مساعدك الذكي.'
    },
    footer: {
      en: '© 2025 Zaki.One. All rights reserved.',
      ar: '© 2025 زكي.ون. جميع الحقوق محفوظة.'
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
      en: 'Instructions for Zaki',
      ar: 'تعليمات لزكي'
    },
    instructionsDesc: {
      en: 'Customize Zaki\'s behavior with specific instructions.',
      ar: 'خصص سلوك زكي بتعليمات محددة.'
    },
    preInstructions: {
      en: 'Insert Pre-Instructions For Zaki',
      ar: 'أدخل تعليمات مسبقة لزكي'
    },
    preInstructionsPlaceholder: {
      en: 'Pre-Instructions Will Be Applied For Current Chat',
      ar: 'التعليمات المسبقة ستطبق على الدردشة الحالية'
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
      en: 'Are you sure you want to clear the chat history?',
      ar: 'هل أنت متأكد أنك تريد مسح سجل الدردشة؟'
    },
    share: {
      en: 'Share',
      ar: 'شارك'
    },
    placeholder: {
      en: 'Ask Zaki anything you want to know.',
      ar: 'اسأل زكي عن أي شيء تريد معرفته.'
    },
    delete: {
      en: 'Clear Chat',
      ar: 'مسح الدردشة'
    },
  };

  return translations[key]?.[language] || key;
};
