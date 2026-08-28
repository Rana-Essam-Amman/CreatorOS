/**
 * CreatorOS — i18n (Internationalization)
 * 10+ languages with RTL/LTR auto-switch
 * تخزين اختيار اللغة في LocalStorage
 */
const I18n = {
  langs: {
    ar: {
      name: 'العربية', dir: 'rtl',
      'splash.tagline': 'منصة صناعة المحتوى الذكية',
      'ob.welcome': 'مرحباً بك في CreatorOS',
      'ob.welcomeDesc': 'استوديو متكامل لصناعة فيديوهات وصور وصوتيات بالذكاء الاصطناعي',
      'ob.autopilot': 'وضع الطيار الآلي',
      'ob.autopilotDesc': 'أنشئ محتوى أسبوع كامل بضغطة واحدة — التطبيق يخطط ويكتب ويصمم ويجدول',
      'ob.growth': 'حلقة النمو الفيروسي',
      'ob.growthDesc': 'اكسب نقاطاً، ارتقِ بالمستويات، وادعُ أصدقاءك مقابل رصيد مجاني',
      'ob.skip': 'تخطي', 'ob.next': 'التالي', 'ob.start': 'ابدأ الآن',
      'auth.login': 'تسجيل الدخول', 'auth.register': 'إنشاء حساب',
      'auth.email': 'البريد الإلكتروني', 'auth.password': 'كلمة المرور', 'auth.name': 'الاسم',
      'auth.loginBtn': 'دخول', 'auth.registerBtn': 'إنشاء حساب',
      'auth.demo': 'للتجربة: أي بريد + أي كلمة مرور (محاكاة محلية)',
      'nav.dashboard': 'لوحة اليوم', 'nav.video': 'استوديو الفيديو', 'nav.image': 'استوديو الصور',
      'nav.audio': 'استوديو الصوت', 'nav.writing': 'استوديو الكتابة', 'nav.social': 'إدارة السوشيال',
      'nav.repurpose': 'إعادة التدوير', 'nav.brand': 'العلامة التجارية', 'nav.analytics': 'التحليلات',
      'nav.community': 'المجتمع', 'nav.assets': 'مكتبة الأصول', 'nav.wallet': 'المحفظة والتسعير',
      'nav.collab': 'التعاون', 'nav.support': 'الدعم', 'nav.admin': 'لوحة المالك',
      'nav.autopilot': 'الطيار الآلي',
      'search.placeholder': 'ابحث في المشاريع...',
      'chat.placeholder': 'اسأل أوريون أي شيء...',
      'video.export': 'تصدير نهائي',
      'dash.greeting': 'أهلاً', 'dash.tasks': 'مهام مقترحة اليوم', 'dash.stats': 'إحصائيات سريعة',
      'dash.activity': 'آخر النشاطات',
      'common.save': 'حفظ', 'common.cancel': 'إلغاء', 'common.delete': 'حذف',
      'common.upload': 'رفع', 'common.generate': 'توليد', 'common.download': 'تحميل',
      'common.loading': 'جاري التحميل...', 'common.done': 'تم!', 'common.error': 'حدث خطأ'
    },
    en: {
      name: 'English', dir: 'ltr',
      'splash.tagline': 'AI-Powered Content Creation Platform',
      'ob.welcome': 'Welcome to CreatorOS',
      'ob.welcomeDesc': 'All-in-one studio for AI video, images & audio',
      'ob.autopilot': 'Autopilot Mode',
      'ob.autopilotDesc': 'Generate a full week of content with one click',
      'ob.growth': 'Viral Growth Loop',
      'ob.growthDesc': 'Earn XP, level up, invite friends for free credits',
      'ob.skip': 'Skip', 'ob.next': 'Next', 'ob.start': 'Get Started',
      'auth.login': 'Log in', 'auth.register': 'Sign up',
      'auth.email': 'Email', 'auth.password': 'Password', 'auth.name': 'Name',
      'auth.loginBtn': 'Log in', 'auth.registerBtn': 'Create account',
      'auth.demo': 'Demo: any email + password (local mock)',
      'nav.dashboard': 'Today', 'nav.video': 'Video Studio', 'nav.image': 'Image Studio',
      'nav.audio': 'Audio Studio', 'nav.writing': 'Writing Studio', 'nav.social': 'Social Manager',
      'nav.repurpose': 'Repurposer', 'nav.brand': 'Brand Kit', 'nav.analytics': 'Analytics',
      'nav.community': 'Community', 'nav.assets': 'Asset Library', 'nav.wallet': 'Wallet & Pricing',
      'nav.collab': 'Collaboration', 'nav.support': 'Support', 'nav.admin': 'Admin',
      'nav.autopilot': 'Autopilot',
      'search.placeholder': 'Search projects...',
      'chat.placeholder': 'Ask Orion anything...',
      'video.export': 'Final Export',
      'dash.greeting': 'Hello', 'dash.tasks': 'Suggested tasks today', 'dash.stats': 'Quick stats',
      'dash.activity': 'Recent activity',
      'common.save': 'Save', 'common.cancel': 'Cancel', 'common.delete': 'Delete',
      'common.upload': 'Upload', 'common.generate': 'Generate', 'common.download': 'Download',
      'common.loading': 'Loading...', 'common.done': 'Done!', 'common.error': 'Error occurred'
    },
    fr: { name: 'Français', dir: 'ltr', 'nav.dashboard': "Aujourd'hui", 'nav.video': 'Studio Vidéo', 'splash.tagline': 'Plateforme de création IA' },
    es: { name: 'Español', dir: 'ltr', 'nav.dashboard': 'Hoy', 'nav.video': 'Estudio de Video', 'splash.tagline': 'Plataforma de creación con IA' },
    de: { name: 'Deutsch', dir: 'ltr', 'nav.dashboard': 'Heute', 'nav.video': 'Video-Studio', 'splash.tagline': 'KI-Content-Plattform' },
    tr: { name: 'Türkçe', dir: 'ltr', 'nav.dashboard': 'Bugün', 'nav.video': 'Video Stüdyosu', 'splash.tagline': 'YZ İçerik Platformu' },
    pt: { name: 'Português', dir: 'ltr', 'nav.dashboard': 'Hoje', 'nav.video': 'Estúdio de Vídeo', 'splash.tagline': 'Plataforma de criação com IA' },
    hi: { name: 'हिन्दी', dir: 'ltr', 'nav.dashboard': 'आज', 'nav.video': 'वीडियो स्टूडियो', 'splash.tagline': 'एआई सामग्री मंच' },
    id: { name: 'Bahasa', dir: 'ltr', 'nav.dashboard': 'Hari Ini', 'nav.video': 'Studio Video', 'splash.tagline': 'Platform Konten AI' },
    zh: { name: '中文', dir: 'ltr', 'nav.dashboard': '今日', 'nav.video': '视频工作室', 'splash.tagline': 'AI内容创作平台' }
  },

  current: 'ar',

  t(key) {
    const dict = this.langs[this.current] || this.langs.ar;
    return dict[key] || this.langs.en[key] || this.langs.ar[key] || key;
  },

  setLang(code) {
    if (!this.langs[code]) code = 'ar';
    this.current = code;
    const dir = this.langs[code].dir || 'ltr';
    document.documentElement.lang = code;
    document.documentElement.dir = dir;
    Store.set('settings.lang', code);
    this.apply();
  },

  apply() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = this.t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.placeholder = this.t(el.getAttribute('data-i18n-placeholder'));
    });
  },

  init() {
    const saved = Store.get('settings.lang') || 'ar';
    this.setLang(saved);
  }
};
