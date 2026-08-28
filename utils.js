/**
 * CreatorOS — Utility helpers
 */
const Utils = {
  uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  },

  formatMoney(n, currency = 'USD') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(n);
  },

  formatDate(iso, lang = 'ar') {
    return new Date(iso).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  },

  formatRelative(iso, lang = 'ar') {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return lang === 'ar' ? 'الآن' : 'Just now';
    if (mins < 60) return lang === 'ar' ? `${mins} د` : `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return lang === 'ar' ? `${hrs} س` : `${hrs}h`;
    const days = Math.floor(hrs / 24);
    return lang === 'ar' ? `${days} ي` : `${days}d`;
  },

  sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  },

  /**
   * محاكاة تأخير شبكة مع شريط تقدم
   * Simulate network delay with progress callback
   */
  async mockProgress(durationMs, onProgress) {
    const steps = 20;
    const stepMs = durationMs / steps;
    for (let i = 1; i <= steps; i++) {
      await this.sleep(stepMs);
      if (onProgress) onProgress(Math.round((i / steps) * 100));
    }
  },

  /**
   * نصوص وهمية لتوليد المحتوى
   * Mock AI text generators
   */
  mockScripts: {
    video: [
      'مرحباً أصدقائي! اليوم هنتكلم عن موضوع مهم جداً...',
      'هل تعلم أن 90% من صناع المحتوى يفشلون في الشهر الأول؟ إليك السبب...',
      'في هذا الفيديو، سأشارككم 5 أسرار للنجاح على يوتيوب في 2026...'
    ],
    social: [
      '🚀 محتوى جديد قادم! انتظروا المفاجأة...',
      'نصيحة اليوم: الاتساق أهم من الكمال. انشر يومياً حتى لو بسيط.',
      'ما رأيكم في هذا؟ اكتبوا تعليقاً 👇'
    ],
    title: [
      '5 طرق تضاعف مشاهداتك في أسبوع',
      'السر الذي يخفيه المحترفون عنك',
      'كيف ربحت 10 آلاف دولار من محتوى قصير'
    ]
  },

  randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  /**
   * صور وهمية من Unsplash (لا تحتاج مفتاح)
   * Mock AI images via Unsplash Source
   */
  mockImage(w = 640, h = 360, query = 'technology') {
    return `https://source.unsplash.com/random/${w}x${h}/?${keyword}&sig=${Math.random()}`;
  },

  /**
   * احتفال بالإنجازات — confetti بسيط
   */
  celebrate() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    canvas.classList.remove('hidden');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    const particles = [];
    const colors = ['#8b5cf6', '#06b6d4', '#22c55e', '#f59e0b', '#ef4444', '#ec4899'];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 100,
        w: 6 + Math.random() * 6,
        h: 6 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        vy: 2 + Math.random() * 4,
        vx: -2 + Math.random() * 4,
        rot: Math.random() * 360
      });
    }
    let frame = 0;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.y += p.vy; p.x += p.vx; p.rot += 5;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      frame++;
      if (frame < 120) requestAnimationFrame(draw);
      else canvas.classList.add('hidden');
    }
    draw();
  },

  /**
   * تشفير بسيط للبيانات الحساسة (ليس إنتاجياً)
   * Simple obfuscation — replace with real crypto in production
   */
  encode(str) {
    return btoa(unescape(encodeURIComponent(str)));
  },
  decode(str) {
    try { return decodeURIComponent(escape(atob(str))); } catch { return ''; }
  }
};
