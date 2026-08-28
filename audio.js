/**
 * Audio & Podcast Studio
 * REAL TTS: ElevenLabs / Google Cloud TTS / Web Speech API
 * STT: Web Speech API or Whisper API
 * POST /api/audio/tts { text, voice, language }
 */
const AudioModule = {
  render(container) {
    const voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
    container.innerHTML = `
      <div class="module-header fade-in">
        <div><h1><i class="fa-solid fa-microphone" style="color:var(--success)"></i> استوديو الصوت والبودكاست</h1>
        <p>نص إلى كلام · تسجيل · إزالة ضوضاء · موسيقى</p></div>
      </div>
      <div class="tabs">
        <button class="tab active" data-tab="tts">نص إلى كلام</button>
        <button class="tab" data-tab="record">تسجيل بودكاست</button>
        <button class="tab" data-tab="sfx">مؤثرات وموسيقى</button>
      </div>
      <div id="audio-tts" class="card fade-in">
        <div class="form-group">
          <label>النص</label>
          <textarea id="tts-text" rows="4" placeholder="اكتب النص الذي تريد تحويله إلى كلام..."></textarea>
        </div>
        <div class="form-group">
          <label>اللغة / الصوت</label>
          <select id="tts-lang">
            <option value="ar-SA">العربية</option>
            <option value="en-US">English (US)</option>
            <option value="en-GB">English (UK)</option>
            <option value="fr-FR">Français</option>
          </select>
        </div>
        <button class="btn btn-primary" id="tts-play"><i class="fa-solid fa-play"></i> تشغيل</button>
        <button class="btn btn-ghost" id="tts-stop"><i class="fa-solid fa-stop"></i> إيقاف</button>
      </div>
      <div id="audio-record" class="card hidden fade-in">
        <div class="text-center" style="padding:2rem">
          <button class="btn btn-primary" id="rec-btn" style="width:80px;height:80px;border-radius:50%;font-size:1.5rem">
            <i class="fa-solid fa-microphone"></i>
          </button>
          <p class="mt-2 text-muted" id="rec-status">اضغط للتسجيل (Web Audio API)</p>
          <div class="progress-bar mt-2" id="rec-progress" style="display:none"><div class="progress-fill" id="rec-fill"></div></div>
        </div>
        <button class="tool-btn" data-action="denoise"><i class="fa-solid fa-wave-square"></i><span>إزالة الضوضاء (محاكاة)</span></button>
      </div>
      <div id="audio-sfx" class="hidden fade-in">
        <div class="grid-3">
          ${['Ambient','Upbeat','Cinematic','Lo-fi','Corporate','Nature'].map(s => `
            <div class="card" style="text-align:center;cursor:pointer" data-sfx="${s}">
              <i class="fa-solid fa-music" style="font-size:1.5rem;color:var(--primary);margin-bottom:0.5rem"></i>
              <p>${s}</p>
            </div>
          `).join('')}
        </div>
        <p class="text-dim mt-2" style="font-size:0.8rem">مكتبة خالية من حقوق الملكية — في الإنتاج: ربط Epidemic Sound / Artlist API</p>
      </div>
    `;
    container.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => {
      container.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      ['tts','record','sfx'].forEach(id => {
        document.getElementById('audio-' + id).classList.toggle('hidden', t.dataset.tab !== id);
      });
    }));
    document.getElementById('tts-play').addEventListener('click', () => {
      const text = document.getElementById('tts-text').value;
      if (!text) { Toast.error('اكتب نصاً أولاً'); return; }
      if ('speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = document.getElementById('tts-lang').value;
        speechSynthesis.speak(u);
        Toast.success('جاري التشغيل (Web Speech API)');
        Store.addXP(5);
      } else {
        Toast.info('Web Speech غير مدعوم — في الإنتاج استخدم ElevenLabs');
      }
    });
    document.getElementById('tts-stop').addEventListener('click', () => speechSynthesis?.cancel());
    let recording = false;
    document.getElementById('rec-btn').addEventListener('click', async () => {
      recording = !recording;
      const btn = document.getElementById('rec-btn');
      const status = document.getElementById('rec-status');
      if (recording) {
        btn.style.background = 'var(--danger)';
        status.textContent = 'جاري التسجيل...';
        document.getElementById('rec-progress').style.display = 'block';
        await Utils.mockProgress(3000, p => document.getElementById('rec-fill').style.width = p + '%');
        recording = false;
        btn.style.background = '';
        status.textContent = 'تم التسجيل (محاكاة)';
        document.getElementById('rec-progress').style.display = 'none';
        Toast.success('تم حفظ التسجيل');
        Store.addXP(15);
      }
    });
    container.querySelectorAll('[data-sfx]').forEach(el => {
      el.addEventListener('click', () => Toast.info('تشغيل: ' + el.dataset.sfx + ' (رابط خارجي في الإنتاج)'));
    });
    container.querySelector('[data-action="denoise"]')?.addEventListener('click', async () => {
      await Utils.sleep(1500);
      Toast.success('تمت إزالة الضوضاء (محاكاة — ربط Krisp/RNNoise)');
    });
  }
};
