/**
 * CreatorOS — Orion AI Persona
 * مساعد ذكي يتذكر المشاريع ويقدم نصائح استباقية
 * 
 * للربط الحقيقي لاحقاً:
 * - استخدم OpenAI GPT-4 / Anthropic Claude / xAI Grok API
 * - Endpoint: POST /api/ai/chat
 * - Body: { messages: [...], context: userProjects }
 * - Headers: Authorization: Bearer <API_KEY>
 */
const Orion = {
  name: 'أوريون',
  personality: 'ودود، محترف، استباقي، يتكلم بالعربية الفصحى المبسطة',

  history: [],

  /**
   * ردود محاكاة ذكية حسب الكلمات المفتاحية
   * Mock intelligent replies based on keywords
   */
  replies: {
    greeting: [
      'أهلاً! أنا أوريون ✨ كيف أقدر أساعدك اليوم في صناعة محتوى يلفت الانتباه؟',
      'مرحباً بك! جاهز نحول فكرتك لفيديو أو منشور احترافي؟'
    ],
    video: [
      'للفيديو، أنصحك تبدأ بـ "المخرج الذكي" — يحلل المحتوى ويطبق أفضل القرارات تلقائياً. جرب استوديو الفيديو!',
      'نصيحة: الفيديوهات القصيرة (15-30 ثانية) تحقق تفاعلاً أعلى بـ 3 أضعاف. هل تريد توليد سكريبت؟'
    ],
    image: [
      'يمكنك توليد صور بالذكاء الاصطناعي من استوديو الصور، أو تصميم مصغرات يوتيوب جاهزة بضغطة.',
      'هل تريد مصغرة جذابة؟ أعطني عنوان الفيديو وسأقترح تصميماً.'
    ],
    social: [
      'أفضل أوقات النشر حسب بياناتك الوهمية: 7-9 مساءً بتوقيت جمهورك. هل أجدول لك محتوى؟',
      'لاحظت أن الهاشتاجات الترندية تزيد الوصول 40%. استخدم مولّد الهاشتاجات في إدارة السوشيال.'
    ],
    autopilot: [
      'وضع الطيار الآلي سينشئ لك 7 أيام محتوى كامل: سكريبتات + صور + جدولة. اضغط الزر في الشريط العلوي!',
      'الطيار الآلي يعتمد على هويتك البصرية ونشاطك السابق. تأكد من إعداد Brand Kit أولاً.'
    ],
    wallet: [
      'رصيدك الحالي يظهر في المحفظة. التسعير: $0.08/ثانية فيديو، $0.15/صورة، $0.02/كلمة. الباقات أوفر للمستمرين.',
      'كود WELCOME10 يعطيك خصم 10% على أول باقة!'
    ],
    tip: [
      'بناءً على نشاطك، أقترح التركيز على الريلز القصيرة — تحقق تفاعلاً أعلى.',
      'نصيحة ذهبية: انشر في نفس الوقت يومياً لبناء عادة لدى الجمهور.',
      'هل جربت A/B Testing للعناوين؟ يمكنه رفع النقرات بنسبة 25%.'
    ],
    default: [
      'فكرة ممتازة! يمكنني مساعدتك في استوديو الفيديو، الصور، الكتابة، أو الجدولة. ماذا تفضل؟',
      'أنا هنا. جرب الطيار الآلي لإنشاء أسبوع محتوى، أو افتح أي استوديو وابدأ.',
      'هل تريد اقتراح مهام لليوم بناءً على أهدافك؟'
    ]
  },

  detectIntent(text) {
    const t = text.toLowerCase();
    if (/مرحبا|اهلا|hello|hi|سلام/.test(t)) return 'greeting';
    if (/فيديو|video|مونتاج|تحرير/.test(t)) return 'video';
    if (/صورة|مصغرة|thumbnail|image/.test(t)) return 'image';
    if (/سوشيال|نشر|جدولة|social|post/.test(t)) return 'social';
    if (/طيار|autopilot|أتمتة|تلقائي/.test(t)) return 'autopilot';
    if (/محفظة|سعر|باقة|دفع|wallet|price/.test(t)) return 'wallet';
    if (/نصيحة|tip|اقتراح|نصيح/.test(t)) return 'tip';
    return 'default';
  },

  async chat(userMessage) {
    this.history.push({ role: 'user', text: userMessage });
    const intent = this.detectIntent(userMessage);
    const pool = this.replies[intent] || this.replies.default;

    // إضافة سياق من LocalStorage
    const user = Store.get('user');
    const xp = Store.get('xp');
    let contextNote = '';
    if (user && xp && xp.level > 1) {
      contextNote = ` (بالمناسبة، أنت في المستوى ${xp.level} — رائع!)`;
    }
    const projects = Store.get('projects') || [];
    if (projects.length > 0 && intent === 'default') {
      contextNote += ` لاحظت أن لديك ${projects.length} مشروع. هل تريد المتابعة على أحدها؟`;
    }

    await Utils.sleep(600 + Math.random() * 800); // محاكاة تفكير
    const reply = Utils.randomFrom(pool) + contextNote;
    this.history.push({ role: 'ai', text: reply });
    return reply;
  },

  proactiveTip() {
    const tips = this.replies.tip;
    return Utils.randomFrom(tips);
  }
};
