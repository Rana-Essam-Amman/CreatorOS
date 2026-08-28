const CollabModule = {
  render(container) {
    const members = Store.get('collab.members') || [];
    container.innerHTML = `
      <div class="module-header fade-in">
        <div><h1><i class="fa-solid fa-people-group"></i> التعاون الجماعي</h1>
        <p>ادعُ فريقك · شارك المشاريع · تعليقات</p></div>
        <button class="btn btn-primary" id="invite-btn"><i class="fa-solid fa-user-plus"></i> دعوة عضو</button>
      </div>
      <div class="grid-2 fade-in">
        <div class="card">
          <h4 class="mb-2">أعضاء الفريق</h4>
          ${members.length ? members.map(m => `
            <div class="leader-row">
              <div class="avatar" style="width:36px;height:36px">${m.name[0]}</div>
              <div style="flex:1"><strong>${m.name}</strong><br><span class="text-dim" style="font-size:0.8rem">${m.role}</span></div>
              <span class="badge-pill">${m.role}</span>
            </div>
          `).join('') : '<div class="empty-state"><i class="fa-solid fa-users"></i><p>لا أعضاء بعد — ادعُ فريقك</p></div>'}
        </div>
        <div class="card">
          <h4 class="mb-2">صلاحيات</h4>
          <p class="text-muted" style="font-size:0.9rem">Owner · Editor · Viewer · Commenter</p>
          <div class="mt-2">
            <div class="ticket-item"><strong>مشروع تجريبي</strong><p class="text-muted" style="font-size:0.8rem">3 تعليقات · آخر تحديث منذ ساعة</p></div>
          </div>
        </div>
      </div>
    `;
    document.getElementById('invite-btn').addEventListener('click', () => {
      const name = prompt('اسم العضو:') || 'عضو جديد';
      Store.push('collab.members', { name, email: 'member@example.com', role: 'Editor', id: Utils.uid() });
      Toast.success('تمت الدعوة (محاكاة بريد)');
      Store.addXP(15);
      CollabModule.render(container);
    });
  }
};
