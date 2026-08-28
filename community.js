const CommunityModule = {
  leaders: [
    { name: 'سارة م.', xp: 2450, rank: 1 },
    { name: 'أحمد ك.', xp: 2100, rank: 2 },
    { name: 'نور ع.', xp: 1890, rank: 3 },
    { name: 'محمد ر.', xp: 1650, rank: 4 },
    { name: 'ليلى ح.', xp: 1420, rank: 5 }
  ],
  inspirations: [
    { title: 'ريلز حقق 2M مشاهدة', author: 'سارة', likes: 340 },
    { title: 'سكريبت بودكاست ناجح', author: 'أحمد', likes: 210 },
    { title: 'مصغرة رفعت CTR 40%', author: 'نور', likes: 180 }
  ],
  render(container) {
    container.innerHTML = `
      <div class="module-header fade-in">
        <div><h1><i class="fa-solid fa-users"></i> المجتمع</h1>
        <p>إلهام · إعجابات · لوحة المتصدرين</p></div>
      </div>
      <div class="grid-2 fade-in">
        <div class="card">
          <h4 class="mb-2">لوحة المتصدرين الأسبوعية</h4>
          ${this.leaders.map(l => `
            <div class="leader-row">
              <div class="leader-rank ${l.rank===1?'gold':l.rank===2?'silver':l.rank===3?'bronze':''}">${l.rank}</div>
              <div class="avatar" style="width:32px;height:32px;font-size:0.75rem">${l.name[0]}</div>
              <span style="flex:1;font-weight:500">${l.name}</span>
              <span class="badge-pill">${l.xp} XP</span>
            </div>
          `).join('')}
        </div>
        <div class="card">
          <h4 class="mb-2">الإلهام</h4>
          ${this.inspirations.map(i => `
            <div class="ticket-item">
              <strong>${i.title}</strong>
              <div class="flex-between mt-1">
                <span class="text-muted" style="font-size:0.8rem">بواسطة ${i.author}</span>
                <button class="btn btn-ghost btn-sm" data-like><i class="fa-solid fa-heart"></i> ${i.likes}</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    container.querySelectorAll('[data-like]').forEach(btn => {
      btn.addEventListener('click', () => {
        const n = parseInt(btn.textContent.match(/\d+/)[0]) + 1;
        btn.innerHTML = `<i class="fa-solid fa-heart" style="color:var(--danger)"></i> ${n}`;
        Store.addXP(2);
      });
    });
  }
};
