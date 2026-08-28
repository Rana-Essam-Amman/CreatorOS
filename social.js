/**
 * Social Media Manager
 * REAL: YouTube/TikTok/Instagram/Meta APIs for scheduling
 * Chart.js for analytics
 */
const SocialModule = {
  render(container) {
    const scheduled = Store.get('social.scheduled') || [];
    const days = ['أحد','إثنين','ثلاثاء','أربعاء','خميس','جمعة','سبت'];
    const today = new Date().getDay();
    container.innerHTML = `
      <div class="module-header fade-in">
        <div><h1><i class="fa-solid fa-share-nodes" style="color:var(--primary)"></i> إدارة السوشيال ميديا</h1>
        <p>جدولة · تقويم ذكي · تحليلات · هاشتاجات</p></div>
        <button class="btn btn-primary" id="sched-add"><i class="fa-solid fa-plus"></i> جدولة منشور</button>
      </div>
      <div class="grid-2 fade-in">
        <div class="card">
          <h4 class="mb-2">تقويم الأسبوع</h4>
          <div class="calendar-grid">
            ${days.map((d, i) => `
              <div class="cal-day ${i === today ? 'has-event' : ''}" data-day="${i}">
                <span>${d}</span>
                ${scheduled.filter(s => s.day === i).length ? '<div class="event-dot"></div>' : ''}
              </div>
            `).join('')}
          </div>
          <p class="text-dim mt-2" style="font-size:0.8rem">💡 أفضل وقت للنشر: 7–9 مساءً (محاكاة حسب جمهورك)</p>
        </div>
        <div class="card">
          <h4 class="mb-2">المنشورات المجدولة</h4>
          <div id="sched-list">
            ${scheduled.length ? scheduled.map(s => `
              <div class="ticket-item">
                <div class="flex-between">
                  <strong>${s.title}</strong>
                  <span class="badge-pill">${s.platform}</span>
                </div>
                <p class="text-muted" style="font-size:0.8rem">${days[s.day]} — ${s.time}</p>
              </div>
            `).join('') : '<div class="empty-state"><i class="fa-solid fa-calendar"></i><p>لا منشورات مجدولة</p></div>'}
          </div>
        </div>
      </div>
      <div class="card mt-2 fade-in">
        <h4 class="mb-2">تحليلات سريعة</h4>
        <div class="chart-wrap"><canvas id="social-chart"></canvas></div>
      </div>
    `;
    document.getElementById('sched-add').addEventListener('click', () => {
      const title = prompt('عنوان المنشور:') || 'منشور جديد';
      const item = { id: Utils.uid(), title, platform: 'TikTok', day: (today + 1) % 7, time: '20:00' };
      Store.push('social.scheduled', item);
      Store.addXP(10);
      Store.logActivity('جدولة منشور: ' + title, 'fa-calendar');
      Toast.success('تمت الجدولة!');
      SocialModule.render(container);
    });
    // Chart
    setTimeout(() => {
      const ctx = document.getElementById('social-chart');
      if (ctx && window.Chart) {
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: days,
            datasets: [{
              label: 'تفاعل',
              data: [12, 19, 8, 25, 22, 30, 18],
              borderColor: '#8b5cf6',
              backgroundColor: 'rgba(139,92,246,0.1)',
              fill: true, tension: 0.4
            }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } },
                      x: { grid: { display: false } } }
          }
        });
      }
    }, 100);
  }
};
