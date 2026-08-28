/**
 * CreatorOS — Main Application Controller
 */
const App = {
  modules: {
    dashboard: DashboardModule,
    video: VideoModule,
    image: ImageModule,
    audio: AudioModule,
    writing: WritingModule,
    social: SocialModule,
    repurpose: RepurposeModule,
    brand: BrandModule,
    analytics: AnalyticsModule,
    community: CommunityModule,
    assets: AssetsModule,
    wallet: WalletModule,
    collab: CollabModule,
    support: SupportModule,
    admin: AdminModule
  },

  current: 'dashboard',

  async init() {
    // Splash
    await Utils.sleep(1800);
    document.getElementById('splash').classList.add('hidden');

    I18n.init();
    this.applyTheme(Store.get('settings.theme') || 'dark');
    this.updateUserChip();

    // Onboarding
    if (!Store.get('settings.onboardingDone')) {
      document.getElementById('onboarding').classList.remove('hidden');
      this.setupOnboarding();
    } else {
      document.getElementById('app').classList.remove('hidden');
      this.navigate('dashboard');
    }

    this.bindGlobal();
    this.setupChat();
  },

  setupOnboarding() {
    let step = 1;
    const total = 3;
    const nextBtn = document.getElementById('ob-next');
    const skipBtn = document.getElementById('ob-skip');
    const dots = document.querySelectorAll('.ob-dots span');

    const showStep = (n) => {
      document.querySelectorAll('.ob-step').forEach(s => s.classList.toggle('active', +s.dataset.step === n));
      dots.forEach((d, i) => d.classList.toggle('active', i === n - 1));
      nextBtn.textContent = n === total ? I18n.t('ob.start') : I18n.t('ob.next');
    };

    nextBtn.addEventListener('click', () => {
      if (step < total) { step++; showStep(step); }
      else this.finishOnboarding();
    });
    skipBtn.addEventListener('click', () => this.finishOnboarding());
  },

  finishOnboarding() {
    Store.set('settings.onboardingDone', true);
    document.getElementById('onboarding').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    this.navigate('dashboard');
  },

  navigate(mod) {
    this.current = mod;
    document.querySelectorAll('.nav-item').forEach(n => {
      n.classList.toggle('active', n.dataset.module === mod);
    });
    const container = document.getElementById('module-container');
    container.innerHTML = '';
    const module = this.modules[mod];
    if (module && module.render) {
      module.render(container);
    } else {
      container.innerHTML = `<div class="empty-state"><h3>قريباً</h3><p>هذه الوحدة قيد التطوير</p></div>`;
    }
    // Close mobile sidebar
    document.getElementById('sidebar').classList.remove('open');
    window.location.hash = mod;
  },

  bindGlobal() {
    // Sidebar nav
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', e => {
        e.preventDefault();
        this.navigate(item.dataset.module);
      });
    });

    // Sidebar toggle
    document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('collapsed');
    });
    document.getElementById('mobile-menu')?.addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('open');
    });

    // Theme
    document.getElementById('theme-toggle')?.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      this.applyTheme(next);
    });

    // Language
    document.getElementById('lang-toggle')?.addEventListener('click', () => {
      const langs = Object.keys(I18n.langs);
      const idx = langs.indexOf(I18n.current);
      const next = langs[(idx + 1) % langs.length];
      I18n.setLang(next);
      Toast.info(I18n.langs[next].name);
      this.navigate(this.current);
    });

    // Focus mode
    document.getElementById('focus-mode-btn')?.addEventListener('click', () => {
      document.body.classList.toggle('focus-mode');
      Toast.info(document.body.classList.contains('focus-mode') ? 'وضع التركيز مفعّل' : 'تم إلغاء وضع التركيز');
    });

    // Autopilot
    document.getElementById('autopilot-btn')?.addEventListener('click', async () => {
      Toast.info('الطيار الآلي يعمل...');
      await Utils.mockProgress(4000, () => {});
      const days = ['الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
      days.forEach((d, i) => {
        Store.push('social.scheduled', {
          id: Utils.uid(), title: `محتوى ${d} — طيار آلي`, platform: 'TikTok', day: i, time: '20:00'
        });
      });
      Store.addXP(100);
      Store.addTransaction('debit', -4.90, 'الطيار الآلي — أسبوع محتوى');
      Store.logActivity('الطيار الآلي أنشأ 7 أيام محتوى', 'fa-robot');
      Utils.celebrate();
      Toast.success('تم إنشاء محتوى أسبوع كامل! راجع الجدولة');
    });

    // Auth
    document.getElementById('auth-btn')?.addEventListener('click', () => {
      if (Store.get('user')) {
        if (confirm('تسجيل الخروج؟')) {
          Store.set('user', null);
          this.updateUserChip();
          Toast.info('تم تسجيل الخروج');
        }
      } else {
        document.getElementById('auth-modal').classList.remove('hidden');
      }
    });
    document.querySelector('#auth-modal .modal-close')?.addEventListener('click', () => {
      document.getElementById('auth-modal').classList.add('hidden');
    });
    document.querySelectorAll('.auth-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('login-form').classList.toggle('hidden', tab.dataset.tab !== 'login');
        document.getElementById('register-form').classList.toggle('hidden', tab.dataset.tab !== 'register');
      });
    });
    document.getElementById('login-form')?.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const name = email.split('@')[0];
      Store.set('user', { id: Utils.uid(), name, email, role: email.includes('admin') ? 'admin' : 'user' });
      document.getElementById('auth-modal').classList.add('hidden');
      this.updateUserChip();
      Toast.success('مرحباً ' + name);
      Store.logActivity('تسجيل دخول', 'fa-right-to-bracket');
    });
    document.getElementById('register-form')?.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('reg-name').value;
      const email = document.getElementById('reg-email').value;
      Store.set('user', { id: Utils.uid(), name, email, role: 'user' });
      Store.addTransaction('credit', 5, 'مكافأة ترحيب');
      document.getElementById('auth-modal').classList.add('hidden');
      this.updateUserChip();
      Toast.success('تم إنشاء الحساب + $5 هدية!');
      Utils.celebrate();
    });

    // Notifications
    document.getElementById('notif-btn')?.addEventListener('click', () => {
      Toast.info('جمهورك نشط الآن — حان وقت النشر!');
    });

    // Hash routing
    window.addEventListener('hashchange', () => {
      const hash = location.hash.slice(1);
      if (hash && this.modules[hash]) this.navigate(hash);
    });
  },

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    Store.set('settings.theme', theme);
    const icon = document.querySelector('#theme-toggle i');
    if (icon) icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  },

  updateUserChip() {
    const user = Store.get('user');
    const sub = Store.get('subscription') || { plan: 'free' };
    document.getElementById('user-name').textContent = user?.name || 'زائر';
    document.getElementById('user-plan').textContent = (sub.plan || 'free').toUpperCase();
    document.getElementById('user-avatar').textContent = (user?.name || 'U')[0].toUpperCase();
    const authBtn = document.getElementById('auth-btn');
    if (authBtn) authBtn.textContent = user ? 'خروج' : I18n.t('auth.login');
    // Admin link
    const adminNav = document.querySelector('.admin-only');
    if (adminNav) {
      adminNav.classList.toggle('hidden', !(user && (user.role === 'admin' || user.email?.includes('admin'))));
    }
  },

  setupChat() {
    const input = document.getElementById('chat-input');
    const send = document.getElementById('chat-send');
    const messages = document.getElementById('chat-messages');
    const toggle = document.getElementById('chat-toggle');

    toggle?.addEventListener('click', () => messages.classList.toggle('hidden'));

    const sendMsg = async () => {
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      messages.classList.remove('hidden');
      messages.innerHTML += `<div class="chat-msg user">${text}</div>`;
      messages.scrollTop = messages.scrollHeight;
      const reply = await Orion.chat(text);
      messages.innerHTML += `<div class="chat-msg ai"><strong>أوريون:</strong> ${reply}</div>`;
      messages.scrollTop = messages.scrollHeight;
    };
    send?.addEventListener('click', sendMsg);
    input?.addEventListener('keydown', e => { if (e.key === 'Enter') sendMsg(); });
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
