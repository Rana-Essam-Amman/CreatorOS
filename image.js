/**
 * Image & Thumbnail Studio
 * REAL: DALL-E 3 / Midjourney / Stability AI
 * POST /api/images/generate { prompt, size, style }
 * Background removal: remove.bg API
 */
const ImageModule = {
  render(container) {
    container.innerHTML = `
      <div class="module-header fade-in">
        <div><h1><i class="fa-solid fa-image" style="color:var(--accent)"></i> استوديو الصور والمصغرات</h1>
        <p>توليد بالذكاء الاصطناعي · مصغرات يوتيوب · إزالة خلفية</p></div>
      </div>
      <div class="tabs">
        <button class="tab active" data-tab="gen">توليد صور</button>
        <button class="tab" data-tab="thumb">مصغرات يوتيوب</button>
        <button class="tab" data-tab="tools">أدوات</button>
      </div>
      <div id="img-gen" class="fade-in">
        <div class="card mb-2">
          <div class="form-group">
            <label>وصف الصورة (Prompt)</label>
            <textarea id="img-prompt" rows="3" placeholder="A cinematic thumbnail of a creator with neon lights..."></textarea>
          </div>
          <button class="btn btn-primary" id="img-gen-btn"><i class="fa-solid fa-sparkles"></i> توليد</button>
        </div>
        <div class="img-grid" id="img-results"></div>
      </div>
      <div id="img-thumb" class="hidden fade-in">
        <div class="grid-3" id="thumb-templates">
          ${['Bold Title','Split Screen','Face Focus','Neon Glow','Minimal'].map(t => `
            <div class="card" style="cursor:pointer;text-align:center" data-thumb="${t}">
              <div style="aspect-ratio:16/9;background:var(--gradient);border-radius:8px;margin-bottom:0.75rem;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700">${t}</div>
              <p style="font-size:0.85rem">${t}</p>
            </div>
          `).join('')}
        </div>
      </div>
      <div id="img-tools" class="hidden fade-in">
        <div class="grid-2">
          <button class="tool-btn" data-tool="bg"><i class="fa-solid fa-eraser"></i><span>إزالة الخلفية</span></button>
          <button class="tool-btn" data-tool="upscale"><i class="fa-solid fa-maximize"></i><span>تكبير الجودة</span></button>
          <button class="tool-btn" data-tool="avatar"><i class="fa-solid fa-user-astronaut"></i><span>مولّد أفاتار</span></button>
          <button class="tool-btn" data-tool="enhance"><i class="fa-solid fa-wand-magic-sparkles"></i><span>تحسين تلقائي</span></button>
        </div>
      </div>
    `;
    container.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => {
      container.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      ['gen','thumb','tools'].forEach(id => {
        document.getElementById('img-' + id).classList.toggle('hidden', t.dataset.tab !== id);
      });
    }));
    document.getElementById('img-gen-btn').addEventListener('click', async () => {
      const prompt = document.getElementById('img-prompt').value || 'abstract art';
      const btn = document.getElementById('img-gen-btn');
      btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري التوليد...';
      await Utils.sleep(1800);
      const grid = document.getElementById('img-results');
      for (let i = 0; i < 4; i++) {
        const img = document.createElement('div');
        img.className = 'img-card bounce-in';
        img.innerHTML = `<img src="${Utils.mockImage(400,400, prompt.split(' ')[0] || 'art')}" alt="AI" loading="lazy" />`;
        grid.prepend(img);
      }
      btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-sparkles"></i> توليد';
      Toast.success('تم توليد 4 صور!');
      Store.addXP(20);
      Store.addTransaction('debit', -0.60, 'توليد صور AI ×4');
      Store.logActivity('توليد صور: ' + prompt.slice(0, 30), 'fa-image');
    });
    container.querySelectorAll('[data-thumb]').forEach(el => {
      el.addEventListener('click', () => {
        Toast.success('تم تطبيق قالب: ' + el.dataset.thumb + ' (محاكاة)');
        Store.addXP(10);
      });
    });
    container.querySelectorAll('[data-tool]').forEach(el => {
      el.addEventListener('click', async () => {
        el.disabled = true;
        await Utils.sleep(1200);
        el.disabled = false;
        Toast.success('تمت العملية: ' + el.dataset.tool + ' (محاكاة — ربط remove.bg / Upscaler API)');
        Store.addXP(10);
      });
    });
  }
};
