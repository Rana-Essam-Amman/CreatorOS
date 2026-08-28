/**
 * Writing Studio
 * REAL: OpenAI GPT-4 / Claude / Grok API
 * POST /api/writing/script { type, topic, tone, length }
 */
const WritingModule = {
  render(container) {
    container.innerHTML = `
      <div class="module-header fade-in">
        <div><h1><i class="fa-solid fa-pen-fancy" style="color:var(--warning)"></i> استوديو الكتابة</h1>
        <p>سكريبتات · عناوين · منشورات · تدقيق لغوي</p></div>
      </div>
      <div class="grid-2 fade-in">
        <div class="card">
          <div class="form-group">
            <label>نوع المحتوى</label>
            <select id="w-type">
              <option value="video">سكريبت فيديو</option>
              <option value="podcast">سكريبت بودكاست</option>
              <option value="social">منشور سوشيال</option>
              <option value="title">عناوين جذابة</option>
              <option value="hashtags">هاشتاجات ترند</option>
              <option value="description">وصف يوتيوب</option>
            </select>
          </div>
          <div class="form-group">
            <label>الموضوع / الفكرة</label>
            <input type="text" id="w-topic" placeholder="مثال: كيف تبدأ قناة يوتيوب في 2026" />
          </div>
          <div class="form-group">
            <label>النبرة</label>
            <select id="w-tone">
              <option value="friendly">ودود</option>
              <option value="professional">احترافي</option>
              <option value="funny">فكاهي</option>
              <option value="inspiring">ملهم</option>
            </select>
          </div>
          <button class="btn btn-primary btn-block" id="w-gen"><i class="fa-solid fa-sparkles"></i> توليد</button>
        </div>
        <div class="card">
          <div class="flex-between mb-2">
            <h4>النتيجة</h4>
            <button class="btn btn-ghost btn-sm" id="w-copy"><i class="fa-solid fa-copy"></i> نسخ</button>
          </div>
          <div id="w-result" style="min-height:200px;font-size:0.95rem;line-height:1.7;color:var(--text-muted)">
            اضغط "توليد" للحصول على نص ذكي...
          </div>
        </div>
      </div>
    `;
    document.getElementById('w-gen').addEventListener('click', async () => {
      const type = document.getElementById('w-type').value;
      const topic = document.getElementById('w-topic').value || 'محتوى عام';
      const btn = document.getElementById('w-gen');
      btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
      await Utils.sleep(1500);
      let result = '';
      if (type === 'video' || type === 'podcast') {
        result = Utils.randomFrom(Utils.mockScripts.video) + '\n\n[مقدمة]\n' + topic + '\n\n[نقطة 1] ...\n[نقطة 2] ...\n[خاتمة ودعوة للتفاعل]\n\n— تم التوليد بواسطة Orion AI (محاكاة GPT-4)';
      } else if (type === 'title') {
        result = Utils.mockScripts.title.map((t, i) => `${i + 1}. ${t}`).join('\n');
      } else if (type === 'hashtags') {
        result = '#محتوى #صناع_محتوى #يوتيوب #ريلز #نصائح #2026 #CreatorOS #AI #viral #trending';
      } else {
        result = Utils.randomFrom(Utils.mockScripts.social) + '\n\n' + topic;
      }
      document.getElementById('w-result').textContent = result;
      document.getElementById('w-result').style.color = 'var(--text)';
      btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-sparkles"></i> توليد';
      Toast.success('تم التوليد!');
      Store.addXP(15);
      Store.addTransaction('debit', -0.10, 'كتابة AI');
      Store.logActivity('توليد نص: ' + type, 'fa-pen');
    });
    document.getElementById('w-copy').addEventListener('click', () => {
      const t = document.getElementById('w-result').textContent;
      navigator.clipboard?.writeText(t);
      Toast.success('تم النسخ');
    });
  }
};
