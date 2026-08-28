/**
 * CreatorOS — Video Studio
 * 
 * === REAL INTEGRATION NOTES ===
 * 1. Video generation: Google Veo / RunwayML / Pika API
 *    POST /api/videos/generate { prompt, style, duration }
 * 2. Editing (FFmpeg on backend):
 *    POST /api/videos/edit { videoId, operations: ['trim','merge','transition'] }
 * 3. Upload: Multer + Cloudinary/S3
 *    POST /api/videos/upload (multipart)
 * 4. Auto color grading / highlight detection: custom ML or Adobe Sensei-like
 * =================================
 */
const VideoModule = {
  state: {
    file: null,
    processing: false,
    progress: 0,
    style: 'cinematic',
    platform: 'tiktok',
    highlights: []
  },

  styles: ['cinematic', 'vlog', 'minimal', 'neon', 'documentary', 'comedy', 'luxury', 'retro'],
  platforms: [
    { id: 'tiktok', icon: 'fa-brands fa-tiktok', label: 'TikTok', duration: '15-60s' },
    { id: 'youtube', icon: 'fa-brands fa-youtube', label: 'YouTube', duration: '8-15min' },
    { id: 'instagram', icon: 'fa-brands fa-instagram', label: 'Reels', duration: '15-90s' },
    { id: 'snapchat', icon: 'fa-brands fa-snapchat', label: 'Snap', duration: '10-60s' },
    { id: 'facebook', icon: 'fa-brands fa-facebook', label: 'FB', duration: '1-3min' },
    { id: 'linkedin', icon: 'fa-brands fa-linkedin', label: 'LinkedIn', duration: '30s-3min' }
  ],

  render(container) {
    container.innerHTML = `
      <div class="module-header fade-in">
        <div>
          <h1><i class="fa-solid fa-video" style="color:var(--primary)"></i> استوديو الفيديو</h1>
          <p>مونتاج ذكي · انتقالات سينمائية · تصحيح ألوان · مخرج ذكي</p>
        </div>
        <button class="btn btn-accent" id="director-btn"><i class="fa-solid fa-wand-magic-sparkles"></i> المخرج الذكي</button>
      </div>

      <div class="studio-layout fade-in">
        <div>
          <div class="preview-area" id="video-preview">
            <div class="placeholder">
              <i class="fa-solid fa-film" style="font-size:2.5rem;opacity:0.3;display:block;margin-bottom:0.5rem"></i>
              <p>ارفع فيديو أو ولّد بالذكاء الاصطناعي</p>
            </div>
          </div>
          <div class="timeline" id="timeline">
            <div class="timeline-clip" style="flex:1">Timeline — اسحب المقاطع هنا</div>
          </div>
          <div class="progress-bar mt-1" id="vid-progress" style="display:none">
            <div class="progress-fill" id="vid-progress-fill"></div>
          </div>
          <p class="text-dim mt-1" id="vid-status" style="font-size:0.8rem;display:none"></p>
        </div>

        <div class="tools-panel">
          <div class="dropzone" id="video-drop">
            <i class="fa-solid fa-cloud-arrow-up"></i>
            <p>اسحب فيديو أو انقر للرفع</p>
            <input type="file" id="video-file" accept="video/*" hidden />
          </div>

          <button class="tool-btn" data-action="generate"><i class="fa-solid fa-sparkles"></i><span>توليد فيديو بالذكاء الاصطناعي</span></button>
          <button class="tool-btn" data-action="auto-edit"><i class="fa-solid fa-scissors"></i><span>مونتاج آلي كامل</span></button>
          <button class="tool-btn" data-action="transitions"><i class="fa-solid fa-right-left"></i><span>انتقالات سينمائية</span></button>
          <button class="tool-btn" data-action="audio"><i class="fa-solid fa-volume-high"></i><span>تحسين صوتي تلقائي</span></button>
          <button class="tool-btn" data-action="highlights"><i class="fa-solid fa-star"></i><span>كشف أفضل اللقطات</span></button>
          <button class="tool-btn" data-action="color"><i class="fa-solid fa-palette"></i><span>تصحيح ألوان (قبل/بعد)</span></button>
          <button class="tool-btn" data-action="translate"><i class="fa-solid fa-language"></i><span>ترجمة سينمائية</span></button>

          <div class="mt-2">
            <label class="text-muted" style="font-size:0.8rem">الستايل السينمائي</label>
            <div class="style-chips mt-1" id="style-chips">
              ${this.styles.map(s => `<button class="style-chip ${s === this.state.style ? 'active' : ''}" data-style="${s}">${s}</button>`).join('')}
            </div>
          </div>

          <div class="mt-2">
            <label class="text-muted" style="font-size:0.8rem">المنصة المستهدفة</label>
            <div class="platform-grid mt-1" id="platform-grid">
              ${this.platforms.map(p => `
                <button class="platform-btn ${p.id === this.state.platform ? 'active' : ''}" data-platform="${p.id}">
                  <i class="${p.icon}"></i><span>${p.label}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <button class="btn btn-primary btn-block mt-2" id="cinema-preview-btn" disabled>
            <i class="fa-solid fa-tv"></i> معاينة سينمائية
          </button>
        </div>
      </div>
    `;

    this.bindEvents(container);
  },

  bindEvents(container) {
    const drop = container.querySelector('#video-drop');
    const fileInput = container.querySelector('#video-file');
    drop.addEventListener('click', () => fileInput.click());
    drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('dragover'); });
    drop.addEventListener('dragleave', () => drop.classList.remove('dragover'));
    drop.addEventListener('drop', e => {
      e.preventDefault();
      drop.classList.remove('dragover');
      if (e.dataTransfer.files[0]) this.handleFile(e.dataTransfer.files[0]);
    });
    fileInput.addEventListener('change', () => {
      if (fileInput.files[0]) this.handleFile(fileInput.files[0]);
    });

    container.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', () => this.runAction(btn.dataset.action));
    });
    container.querySelectorAll('[data-style]').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('[data-style]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.state.style = btn.dataset.style;
        Toast.info('الستايل: ' + btn.dataset.style);
      });
    });
    container.querySelectorAll('[data-platform]').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('[data-platform]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.state.platform = btn.dataset.platform;
        const p = this.platforms.find(x => x.id === btn.dataset.platform);
        Toast.info(`المنصة: ${p.label} — المدة المقترحة: ${p.duration}`);
      });
    });
    container.querySelector('#director-btn').addEventListener('click', () => this.runAction('director'));
    container.querySelector('#cinema-preview-btn').addEventListener('click', () => this.openCinema());
  },

  handleFile(file) {
    this.state.file = file;
    const preview = document.getElementById('video-preview');
    const url = URL.createObjectURL(file);
    preview.innerHTML = `<video src="${url}" controls style="width:100%;height:100%;object-fit:contain"></video>`;
    document.getElementById('cinema-preview-btn').disabled = false;
    Toast.success('تم رفع الفيديو: ' + file.name);
    Store.logActivity('رفع فيديو: ' + file.name, 'fa-video');
    Store.addXP(10);
  },

  async runAction(action) {
    if (this.state.processing) return;
    this.state.processing = true;
    const progressEl = document.getElementById('vid-progress');
    const fill = document.getElementById('vid-progress-fill');
    const status = document.getElementById('vid-status');
    progressEl.style.display = 'block';
    status.style.display = 'block';

    const labels = {
      generate: 'توليد فيديو بالذكاء الاصطناعي...',
      'auto-edit': 'مونتاج آلي: تقطيع ودمج وترتيب...',
      transitions: 'تطبيق انتقالات سينمائية ذكية...',
      audio: 'تحسين صوتي تلقائي (Mastering)...',
      highlights: 'كشف أفضل اللقطات...',
      color: 'تصحيح ألوان تلقائي...',
      translate: 'ترجمة سينمائية لـ 5 لغات...',
      director: 'المخرج الذكي يحلل ويطبق أفضل القرارات...'
    };
    status.textContent = labels[action] || 'معالجة...';

    // محاكاة — في الإنتاج: استدعاء API الحقيقي
    await Utils.mockProgress(action === 'director' ? 3500 : 2200, pct => {
      fill.style.width = pct + '%';
    });

    if (action === 'highlights') {
      this.state.highlights = [15, 32, 48, 67, 85];
      const timeline = document.getElementById('timeline');
      timeline.innerHTML = this.state.highlights.map((t, i) =>
        `<div class="timeline-clip" style="flex:1;position:relative">
          Clip ${i + 1}<div class="highlight-dot" style="left:${t}%"></div>
        </div>`
      ).join('');
    }

    if (action === 'generate') {
      const preview = document.getElementById('video-preview');
      preview.innerHTML = `<img src="${Utils.mockImage(640, 360, 'cinematic,video')}" alt="Generated" style="width:100%;height:100%;object-fit:cover" />
        <div style="position:absolute;bottom:12px;left:12px;right:12px;background:rgba(0,0,0,0.7);padding:8px 12px;border-radius:8px;font-size:0.85rem">
          [Mock AI Video] — استبدل بـ Google Veo / Runway API
        </div>`;
      document.getElementById('cinema-preview-btn').disabled = false;
    }

    if (action === 'director') {
      Utils.celebrate();
      Store.addXP(50);
      Store.logActivity('المخرج الذكي أكمل فيديو', 'fa-wand-magic-sparkles');
      Store.addTransaction('debit', -2.40, 'المخرج الذكي — فيديو 30ث');
    } else {
      Store.addXP(15);
      Store.logActivity(labels[action] || action, 'fa-video');
    }

    status.textContent = '✓ اكتمل بنجاح';
    fill.style.width = '100%';
    this.state.processing = false;
    Toast.success('تمت العملية بنجاح!');
    setTimeout(() => { progressEl.style.display = 'none'; status.style.display = 'none'; }, 2000);
  },

  openCinema() {
    const overlay = document.getElementById('cinema-overlay');
    const vid = document.getElementById('cinema-video');
    if (this.state.file) {
      vid.src = URL.createObjectURL(this.state.file);
    } else {
      vid.src = '';
      vid.poster = Utils.mockImage(960, 540, 'cinema');
    }
    overlay.classList.remove('hidden');
    document.getElementById('cinema-close').onclick = () => overlay.classList.add('hidden');
    document.getElementById('cinema-export').onclick = () => {
      Toast.success('تم التصدير! (محاكاة — في الإنتاج: رابط تحميل من Cloudinary)');
      Store.addXP(25);
      Utils.celebrate();
      overlay.classList.add('hidden');
    };
  }
};
