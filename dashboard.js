/**
 * CreatorOS — Dashboard (لوحة اليوم)
 * Predictive Intelligence + suggested tasks from user behavior
 */
const DashboardModule = {
  render(container) {
    const user = Store.get('user');
    const name = user?.name || (I18n.current === 'ar' ? 'مبدع' : 'Creator');
    const xp = Store.get('xp') || { points: 0, level: 1 };
    const wallet = Store.get('wallet') || { balance: 0 };
    const analytics = Store.get('analytics') || { views: 1240, engagement: 8.5, followers: 320 };
    const activity = (Store.get('activity') || []).slice(0, 5);
    const tasks = this.getSuggestedTasks();

    container.innerHTML = `
      <div class="module-header fade-in">
        <div>
          <h1>${I18n.t('dash.greeting')}، ${name} 👋</h1>
          <p>${I18n.t('dash.tasks')}</p>
        </div>
        <div class="flex gap-1" style="align-items:center">
          <span class="badge-pill"><i class="fa-solid fa-star"></i> Lv.${xp.level}</span>
          <span class="badge-pill">${xp.points} XP</span>
        </div>
      </div>

      <div class="grid-4 mb-2">
        <div class="stat-card fade-in">
          <div class="stat-icon" style="background:rgba(139,92,246,0.15);color:var(--primary)"><i class="fa-solid fa-eye"></i></div>
          <div class="stat-value">${analytics.views.toLocaleString()}</div>
          <div class="stat-label">مشاهدات</div>
          <div class="stat-change up">+12% هذا الأسبوع</div>
        </div>
        <div class="stat-card fade-in">
          <div class="stat-icon" style="background:rgba(6,182,212,0.15);color:var(--accent)"><i class="fa-solid fa-heart"></i></div>
          <div class="stat-value">${analytics.engagement}%</div>
          <div class="stat-label">تفاعل</div>
          <div class="stat-change up">+2.1%</div>
        </div>
        <div class="stat-card fade-in">
          <div class="stat-icon" style="background:rgba(34,197,94,0.15);color:var(--success)"><i class="fa-solid fa-users"></i></div>
          <div class="stat-value">${analytics.followers}</div>
          <div class="stat-label">متابعون</div>
          <div class="stat-change up">+28</div>
        </div>
        <div class="stat-card fade-in">
          <div class="stat-icon" style="background:rgba(245,158,11,0.15);color:var(--warning)"><i class="fa-solid fa-wallet"></i></div>
          <div class="stat-value">${Utils.formatMoney(wallet.balance)}</div>
          <div class="stat-label">الرصيد</div>
        </div>
      </div>

      <div class="grid-2">
        <div>
          <h3 class="mb-2" style="font-size:1.05rem">${I18n.t('dash.tasks')}</h3>
          <div style="display:flex;flex-direction:column;gap:0.75rem">
            ${tasks.map(t => `
              <div class="task-card" data-goto="${t.module}">
                <div class="task-icon"><i class="fa-solid ${t.icon}"></i></div>
                <div>
                  <h4>${t.title}</h4>
                  <p>${t.desc}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        <div>
          <h3 class="mb-2" style="font-size:1.05rem">${I18n.t('dash.activity')}</h3>
          <div class="card">
            ${activity.length ? activity.map(a => `
              <div class="flex gap-1" style="padding:0.6rem 0;border-bottom:1px solid var(--border);align-items:center">
                <i class="fa-solid ${a.icon}" style="color:var(--primary);width:20px"></i>
                <span style="flex:1;font-size:0.85rem">${a.text}</span>
                <span class="text-dim" style="font-size:0.75rem">${Utils.formatRelative(a.date, I18n.current)}</span>
              </div>
            `).join('') : '<div class="empty-state"><p>لا نشاط بعد — ابدأ بإنشاء محتوى!</p></div>'}
          </div>
          <div class="card mt-2">
            <h4 style="margin-bottom:0.75rem"><i class="fa-solid fa-lightbulb" style="color:var(--warning)"></i> نصيحة أوريون</h4>
            <p class="text-muted" style="font-size:0.9rem">${Orion.proactiveTip()}</p>
          </div>
        </div>
      </div>
    `;

    container.querySelectorAll('[data-goto]').forEach(el => {
      el.addEventListener('click', () => {
        const mod = el.getAttribute('data-goto');
        if (window.App) App.navigate(mod);
      });
    });
  },

  getSuggestedTasks() {
    const projects = Store.get('projects') || [];
    const brand = Store.get('brand');
    const tasks = [];
    if (!brand?.colors?.length) {
      tasks.push({ title: 'إعداد الهوية البصرية', desc: 'ارفع شعارك وألوانك لتطبيقها تلقائياً', icon: 'fa-palette', module: 'brand' });
    }
    tasks.push({ title: 'إنشاء فيديو قصير', desc: 'استخدم المخرج الذكي لإنتاج ريلز في دقائق', icon: 'fa-video', module: 'video' });
    tasks.push({ title: 'جدولة منشورات الأسبوع', desc: 'الطيار الآلي أو التقويم الذكي', icon: 'fa-calendar', module: 'social' });
    if (projects.length === 0) {
      tasks.push({ title: 'توليد مصغرة يوتيوب', desc: 'قوالب جاهزة بضغطة واحدة', icon: 'fa-image', module: 'image' });
    }
    return tasks.slice(0, 4);
  }
};
