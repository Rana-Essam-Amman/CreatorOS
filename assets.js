const AssetsModule = {
  render(container) {
    const cats = [
      { name: 'موسيقى', icon: 'fa-music', items: ['Lo-fi Beat', 'Cinematic Rise', 'Upbeat Pop', 'Ambient Calm'] },
      { name: 'مؤثرات', icon: 'fa-boombox', items: ['Whoosh', 'Click', 'Notification', 'Success'] },
      { name: 'خلفيات فيديو', icon: 'fa-film', items: ['City Night', 'Nature', 'Abstract', 'Office'] },
      { name: 'خطوط', icon: 'fa-font', items: ['Cairo', 'Inter', 'Tajawal', 'Poppins'] }
    ];
    container.innerHTML = `
      <div class="module-header fade-in">
        <div><h1><i class="fa-solid fa-folder-open"></i> مكتبة الأصول</h1>
        <p>موسيقى ومؤثرات وخطوط خالية من حقوق الملكية</p></div>
      </div>
      ${cats.map(c => `
        <div class="mb-2 fade-in">
          <h4 class="mb-1"><i class="fa-solid ${c.icon}" style="color:var(--primary)"></i> ${c.name}</h4>
          <div class="grid-4">
            ${c.items.map(item => `
              <div class="card" style="text-align:center;cursor:pointer;padding:1rem" data-asset="${item}">
                <i class="fa-solid ${c.icon}" style="font-size:1.3rem;color:var(--text-dim);margin-bottom:0.4rem"></i>
                <p style="font-size:0.85rem">${item}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
      <p class="text-dim" style="font-size:0.8rem">في الإنتاج: ربط Epidemic Sound / Pixabay / Google Fonts API</p>
    `;
    container.querySelectorAll('[data-asset]').forEach(el => {
      el.addEventListener('click', () => Toast.info('تم إضافة: ' + el.dataset.asset + ' إلى المشروع'));
    });
  }
};
