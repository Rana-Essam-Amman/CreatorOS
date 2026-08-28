/** Brand Kit — LocalStorage */
const BrandModule = {
  render(container) {
    const brand = Store.get('brand') || { colors: ['#8b5cf6','#06b6d4'], fonts: ['Cairo'] };
    container.innerHTML = `
      <div class="module-header fade-in">
        <div><h1><i class="fa-solid fa-palette"></i> العلامة التجارية</h1>
        <p>هويتك البصرية تُطبَّق تلقائياً على كل المحتوى</p></div>
      </div>
      <div class="grid-2 fade-in">
        <div class="card">
          <h4 class="mb-2">الألوان</h4>
          <div class="flex gap-1 flex-wrap" id="color-list">
            ${(brand.colors || []).map((c, i) => `
              <div style="width:48px;height:48px;border-radius:8px;background:${c};border:2px solid var(--border);cursor:pointer" data-ci="${i}"></div>
            `).join('')}
            <button class="btn btn-ghost btn-sm" id="add-color">+</button>
          </div>
          <div class="form-group mt-2">
            <label>إضافة لون</label>
            <input type="color" id="color-picker" value="#8b5cf6" />
          </div>
        </div>
        <div class="card">
          <h4 class="mb-2">الشعار</h4>
          <div class="dropzone" id="logo-drop" style="padding:1.5rem">
            <i class="fa-solid fa-image"></i>
            <p>ارفع الشعار</p>
            <input type="file" id="logo-file" accept="image/*" hidden />
          </div>
          <div id="logo-preview" class="mt-2"></div>
        </div>
      </div>
      <div class="card mt-2 fade-in">
        <h4 class="mb-2">معاينة الهوية</h4>
        <div style="padding:2rem;border-radius:12px;background:linear-gradient(135deg,${brand.colors[0]},${brand.colors[1]||brand.colors[0]});color:#fff;text-align:center">
          <h2 style="margin-bottom:0.5rem">علامتك التجارية</h2>
          <p>هذا المحتوى يطبق ألوانك وخطوطك تلقائياً</p>
        </div>
        <button class="btn btn-primary mt-2" id="save-brand">حفظ الهوية</button>
      </div>
    `;
    document.getElementById('logo-drop').addEventListener('click', () => document.getElementById('logo-file').click());
    document.getElementById('logo-file').addEventListener('change', e => {
      const f = e.target.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = ev => {
        document.getElementById('logo-preview').innerHTML = `<img src="${ev.target.result}" style="max-height:80px;border-radius:8px" />`;
        Store.set('brand.logo', ev.target.result);
      };
      reader.readAsDataURL(f);
    });
    document.getElementById('add-color').addEventListener('click', () => {
      const c = document.getElementById('color-picker').value;
      const colors = Store.get('brand.colors') || [];
      colors.push(c);
      Store.set('brand.colors', colors);
      BrandModule.render(container);
    });
    document.getElementById('save-brand').addEventListener('click', () => {
      Toast.success('تم حفظ الهوية البصرية');
      Store.addXP(20);
      Store.logActivity('تحديث Brand Kit', 'fa-palette');
    });
  }
};
