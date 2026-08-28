/**
 * Admin Dashboard
 * Password: admin / creatoros123 (mock)
 * REAL: GET /api/admin/stats with admin JWT
 */
const AdminModule = {
  authenticated: false,

  render(container) {
    if (!this.authenticated) {
      container.innerHTML = `
        <div class="flex-center fade-in" style="min-height:50vh">
          <div class="card" style="max-width:360px;width:100%">
            <h2 class="mb-2"><i class="fa-solid fa-crown" style="color:var(--warning)"></i> لوحة المالك</h2>
            <div class="form-group"><label>اسم المستخدم</label><input type="text" id="admin-user" value="admin" /></div>
            <div class="form-group"><label>كلمة المرور</label><input type="password" id="admin-pass" placeholder="creatoros123" /></div>
            <button class="btn btn-primary btn-block" id="admin-login">دخول</button>
          </div>
        </div>
      `;
      document.getElementById('admin-login').addEventListener('click', () => {
        const u = document.getElementById('admin-user').value;
        const p = document.getElementById('admin-pass').value;
        if (u === 'admin' && p === 'creatoros123') {
          this.authenticated = true;
          Toast.success('مرحباً أيها المالك');
          this.render(container);
        } else Toast.error('بيانات غير صحيحة');
      });
      return;
    }

    const users = 1284;
    const revenue = 18420;
    const active = 892;
    const growth = 12.4;

    container.innerHTML = `
      <div class="module-header fade-in">
        <div><h1><i class="fa-solid fa-crown" style="color:var(--warning)"></i> لوحة المالك</h1>
        <p>نظرة عامة · مستخدمون · إيرادات · سجل</p></div>
        <button class="btn btn-ghost btn-sm" id="admin-logout">خروج</button>
      </div>
      <div class="grid-4 fade-in mb-2">
        <div class="stat-card"><div class="stat-value">${users.toLocaleString()}</div><div class="stat-label">المستخدمون</div><div class="stat-change up">+${growth}%</div></div>
        <div class="stat-card"><div class="stat-value">$${revenue.toLocaleString()}</div><div class="stat-label">الإيرادات</div><div class="stat-change up">+$2.1K</div></div>
        <div class="stat-card"><div class="stat-value">${active}</div><div class="stat-label">نشطون اليوم</div></div>
        <div class="stat-card"><div class="stat-value">$${Math.round(revenue/users)}</div><div class="stat-label">ARPU</div></div>
      </div>
      <div class="grid-2 fade-in">
        <div class="card">
          <h4 class="mb-2">الإيرادات (30 يوم)</h4>
          <div class="chart-wrap"><canvas id="admin-chart"></canvas></div>
        </div>
        <div class="card">
          <h4 class="mb-2">آخر الأنشطة</h4>
          ${(Store.get('activity') || []).slice(0, 8).map(a => `
            <div class="flex gap-1" style="padding:0.5rem 0;border-bottom:1px solid var(--border);font-size:0.85rem">
              <i class="fa-solid ${a.icon}" style="color:var(--primary)"></i>
              <span style="flex:1">${a.text}</span>
              <span class="text-dim">${Utils.formatRelative(a.date)}</span>
            </div>
          `).join('') || '<p class="text-muted">لا نشاط</p>'}
        </div>
      </div>
      <div class="card mt-2 fade-in">
        <h4 class="mb-2">إدارة الباقات (محاكاة)</h4>
        <p class="text-muted">عدّل الأسعار من هنا في الإنتاج عبر API</p>
        <div class="flex gap-1 flex-wrap mt-1">
          <span class="badge-pill">Free: $0</span>
          <span class="badge-pill">Starter: $19</span>
          <span class="badge-pill">Pro: $49</span>
          <span class="badge-pill">Agency: $149</span>
        </div>
      </div>
    `;
    document.getElementById('admin-logout').addEventListener('click', () => {
      this.authenticated = false;
      this.render(container);
    });
    setTimeout(() => {
      const ctx = document.getElementById('admin-chart');
      if (ctx && window.Chart) {
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: Array.from({length: 15}, (_, i) => (i + 1) + ''),
            datasets: [{
              data: [400,520,480,610,700,650,800,920,850,1100,1050,1200,1150,1300,1400],
              borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.1)', fill: true, tension: 0.4
            }]
          },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } }, x: { grid: { display: false } } } }
        });
      }
    }, 100);
  }
};
