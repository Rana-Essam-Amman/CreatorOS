const AnalyticsModule = {
  render(container) {
    container.innerHTML = `
      <div class="module-header fade-in">
        <div><h1><i class="fa-solid fa-chart-pie"></i> لوحة التحليلات</h1>
        <p>إحصائيات شاملة · تقارير · اقتراحات ذكية</p></div>
      </div>
      <div class="grid-3 fade-in mb-2">
        <div class="stat-card"><div class="stat-value">12.4K</div><div class="stat-label">مشاهدات الشهر</div><div class="stat-change up">+18%</div></div>
        <div class="stat-card"><div class="stat-value">8.2%</div><div class="stat-label">معدل التفاعل</div><div class="stat-change up">+1.3%</div></div>
        <div class="stat-card"><div class="stat-value">342</div><div class="stat-label">متابعون جدد</div><div class="stat-change up">+45</div></div>
      </div>
      <div class="grid-2 fade-in">
        <div class="card"><h4 class="mb-2">المشاهدات (30 يوم)</h4><div class="chart-wrap"><canvas id="analytics-chart"></canvas></div></div>
        <div class="card">
          <h4 class="mb-2">اقتراحات ذكية</h4>
          <div class="task-card"><div class="task-icon"><i class="fa-solid fa-lightbulb"></i></div>
            <div><h4>ركّز على الريلز</h4><p>تحقق تفاعلاً أعلى بـ 3× من الفيديوهات الطويلة</p></div></div>
          <div class="task-card mt-1"><div class="task-icon"><i class="fa-solid fa-clock"></i></div>
            <div><h4>انشر بين 7–9 مساءً</h4><p>ذروة نشاط جمهورك حسب البيانات</p></div></div>
          <div class="task-card mt-1"><div class="task-icon"><i class="fa-solid fa-hashtag"></i></div>
            <div><h4>استخدم 5–8 هاشتاجات</h4><p>المثالي حسب تحليل المنافسين</p></div></div>
        </div>
      </div>
    `;
    setTimeout(() => {
      const ctx = document.getElementById('analytics-chart');
      if (ctx && window.Chart) {
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: Array.from({length: 12}, (_, i) => (i + 1) + ''),
            datasets: [{ label: 'Views', data: [400,520,380,610,720,890,650,780,920,850,1100,1240], backgroundColor: 'rgba(139,92,246,0.6)', borderRadius: 4 }]
          },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } }, x: { grid: { display: false } } } }
        });
      }
    }, 100);
  }
};
