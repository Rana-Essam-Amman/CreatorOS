const SupportModule = {
  faq: [
    { q: 'كيف أشحن الرصيد؟', a: 'من المحفظة → شحن الرصيد، أو اشترك في باقة.' },
    { q: 'هل يمكنني إلغاء الاشتراك؟', a: 'نعم في أي وقت من المحفظة. لا رسوم إلغاء.' },
    { q: 'كيف أربط يوتيوب؟', a: 'من الإعدادات → تكاملات (متاح في النسخة الخلفية).' },
    { q: 'ما هو المخرج الذكي؟', a: 'يحلل محتواك ويطبق أفضل مونتاج وانتقالات وألوان تلقائياً.' }
  ],
  render(container) {
    const tickets = Store.get('tickets') || [];
    container.innerHTML = `
      <div class="module-header fade-in">
        <div><h1><i class="fa-solid fa-headset"></i> الدعم الفني</h1>
        <p>تذاكر · أسئلة شائعة · دردشة</p></div>
        <button class="btn btn-primary" id="new-ticket"><i class="fa-solid fa-plus"></i> تذكرة جديدة</button>
      </div>
      <div class="grid-2 fade-in">
        <div class="card">
          <h4 class="mb-2">تذاكري</h4>
          ${tickets.length ? tickets.map(t => `
            <div class="ticket-item">
              <div class="flex-between">
                <strong>${t.subject}</strong>
                <span class="ticket-status ${t.status}">${t.status}</span>
              </div>
              <p class="text-muted" style="font-size:0.8rem">${t.desc.slice(0, 60)}...</p>
            </div>
          `).join('') : '<div class="empty-state"><p>لا تذاكر</p></div>'}
        </div>
        <div class="card">
          <h4 class="mb-2">الأسئلة الشائعة</h4>
          ${this.faq.map(f => `
            <details style="margin-bottom:0.75rem">
              <summary style="cursor:pointer;font-weight:500">${f.q}</summary>
              <p class="text-muted mt-1" style="font-size:0.9rem">${f.a}</p>
            </details>
          `).join('')}
        </div>
      </div>
    `;
    document.getElementById('new-ticket').addEventListener('click', () => {
      const subject = prompt('الموضوع:') || 'استفسار';
      const desc = prompt('الوصف:') || '';
      Store.push('tickets', { id: Utils.uid(), subject, desc, status: 'open', date: new Date().toISOString() });
      Toast.success('تم إنشاء التذكرة — رد تلقائي: سنرد خلال 24 ساعة');
      SupportModule.render(container);
    });
  }
};
