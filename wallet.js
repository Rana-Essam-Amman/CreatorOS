/**
 * Pricing & Wallet
 * REAL: Stripe Checkout — POST /api/payments/create-checkout
 * Webhook: /api/payments/webhook for subscription updates
 * Coupon: WELCOME10
 */
const WalletModule = {
  plans: [
    { id: 'free', name: 'Free', price: 0, features: ['5 فيديوهات/شهر', '10 صور', 'دعم أساسي'] },
    { id: 'starter', name: 'Starter', price: 19, features: ['50 فيديو', '100 صورة', 'TTS', 'جدولة'] },
    { id: 'pro', name: 'Pro', price: 49, features: ['غير محدود', 'المخرج الذكي', 'طيار آلي', 'تحليلات'], featured: true },
    { id: 'agency', name: 'Agency', price: 149, features: ['فرق متعددة', 'API', 'مدير حساب', 'White-label'] }
  ],

  render(container) {
    const wallet = Store.get('wallet') || { balance: 0, transactions: [] };
    const sub = Store.get('subscription') || { plan: 'free' };
    container.innerHTML = `
      <div class="module-header fade-in">
        <div><h1><i class="fa-solid fa-wallet"></i> المحفظة والتسعير</h1>
        <p>رصيدك: <strong>${Utils.formatMoney(wallet.balance)}</strong> · الباقة: <span class="badge-pill">${sub.plan}</span></p></div>
      </div>
      <div class="pricing-grid fade-in mb-2">
        ${this.plans.map(p => `
          <div class="pricing-card ${p.featured ? 'featured' : ''}">
            ${p.featured ? '<span class="badge-pill" style="position:absolute;top:12px;inset-inline-end:12px">الأشهر</span>' : ''}
            <h3>${p.name}</h3>
            <div class="price">$${p.price}<span>/شهر</span></div>
            <ul>${p.features.map(f => `<li><i class="fa-solid fa-check"></i>${f}</li>`).join('')}</ul>
            <button class="btn ${p.id === sub.plan ? 'btn-ghost' : 'btn-primary'} btn-block" data-plan="${p.id}" ${p.id === sub.plan ? 'disabled' : ''}>
              ${p.id === sub.plan ? 'باقتك الحالية' : 'اشترك'}
            </button>
          </div>
        `).join('')}
      </div>
      <div class="grid-2 fade-in">
        <div class="card">
          <h4 class="mb-2">شحن الرصيد</h4>
          <div class="flex gap-1 flex-wrap">
            ${[10, 25, 50, 100].map(a => `<button class="btn btn-ghost" data-topup="${a}">$${a}</button>`).join('')}
          </div>
          <div class="form-group mt-2">
            <label>كوبون خصم</label>
            <div class="flex gap-1">
              <input type="text" id="coupon" placeholder="WELCOME10" />
              <button class="btn btn-primary" id="apply-coupon">تطبيق</button>
            </div>
          </div>
          <p class="text-dim mt-1" style="font-size:0.8rem">التسعير: $0.08/ث فيديو · $0.15/صورة · $0.02/كلمة</p>
        </div>
        <div class="card">
          <h4 class="mb-2">سجل العمليات</h4>
          <div style="max-height:280px;overflow-y:auto">
            ${(wallet.transactions || []).length ? wallet.transactions.slice(0, 15).map(t => `
              <div class="flex-between" style="padding:0.5rem 0;border-bottom:1px solid var(--border);font-size:0.85rem">
                <span>${t.note}</span>
                <span style="color:${t.amount >= 0 ? 'var(--success)' : 'var(--danger)'}">${t.amount >= 0 ? '+' : ''}${Utils.formatMoney(t.amount)}</span>
              </div>
            `).join('') : '<p class="text-muted">لا عمليات بعد</p>'}
          </div>
        </div>
      </div>
    `;
    container.querySelectorAll('[data-plan]').forEach(btn => {
      btn.addEventListener('click', () => {
        const plan = this.plans.find(p => p.id === btn.dataset.plan);
        // REAL: redirect to Stripe Checkout
        // fetch('/api/payments/create-checkout', { method:'POST', body: JSON.stringify({ planId: plan.id }) })
        Store.set('subscription', { plan: plan.id, expiresAt: new Date(Date.now() + 30 * 864e5).toISOString(), autoRenew: true });
        if (plan.price > 0) Store.addTransaction('debit', -plan.price, 'اشتراك ' + plan.name);
        Toast.success('تم الاشتراك في ' + plan.name + ' (محاكاة Stripe)');
        Store.addXP(50);
        WalletModule.render(container);
        if (window.App) App.updateUserChip();
      });
    });
    container.querySelectorAll('[data-topup]').forEach(btn => {
      btn.addEventListener('click', () => {
        const amount = +btn.dataset.topup;
        Store.addTransaction('credit', amount, 'شحن رصيد');
        Toast.success('تم شحن $' + amount);
        WalletModule.render(container);
        if (window.App) App.updateUserChip();
      });
    });
    document.getElementById('apply-coupon').addEventListener('click', () => {
      const code = document.getElementById('coupon').value.trim().toUpperCase();
      if (code === 'WELCOME10') {
        Store.addTransaction('credit', 5, 'كوبون WELCOME10');
        Toast.success('تم تطبيق الخصم! +$5');
        WalletModule.render(container);
      } else Toast.error('كوبون غير صالح');
    });
  }
};
