/**
 * CreatorOS — LocalStorage Manager
 * يخزن كل بيانات المستخدم محلياً للتجربة الكاملة بدون خادم
 * عند الربط بالخلفية: استبدل get/set بـ API calls
 */
const Store = {
  KEY: 'creatoros_v1',

  _data() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY)) || this._defaults();
    } catch {
      return this._defaults();
    }
  },

  _defaults() {
    return {
      user: null,
      settings: {
        theme: 'dark',
        lang: 'ar',
        focusMode: false,
        onboardingDone: false,
        privacy: { publicProfile: false, shareAnalytics: true }
      },
      wallet: { balance: 25.00, currency: 'USD', transactions: [] },
      subscription: { plan: 'free', expiresAt: null, autoRenew: false },
      projects: [],
      brand: { logo: null, colors: ['#8b5cf6', '#06b6d4'], fonts: ['Cairo', 'Inter'] },
      xp: { points: 0, level: 1, badges: [] },
      social: { scheduled: [], posts: [] },
      tickets: [],
      notifications: [],
      collab: { members: [], projects: [] },
      analytics: { views: 0, engagement: 0, followers: 0 },
      assets: [],
      activity: []
    };
  },

  get(path) {
    const d = this._data();
    if (!path) return d;
    return path.split('.').reduce((o, k) => (o ? o[k] : undefined), d);
  },

  set(path, value) {
    const d = this._data();
    const keys = path.split('.');
    let obj = d;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!obj[keys[i]]) obj[keys[i]] = {};
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
    localStorage.setItem(this.KEY, JSON.stringify(d));
    return d;
  },

  update(fn) {
    const d = this._data();
    fn(d);
    localStorage.setItem(this.KEY, JSON.stringify(d));
    return d;
  },

  push(path, item) {
    const arr = this.get(path) || [];
    arr.push(item);
    this.set(path, arr);
    return arr;
  },

  addTransaction(type, amount, note) {
    const tx = {
      id: Date.now().toString(36),
      type, amount, note,
      date: new Date().toISOString()
    };
    this.update(d => {
      d.wallet.transactions.unshift(tx);
      d.wallet.balance = Math.round((d.wallet.balance + amount) * 100) / 100;
    });
    return tx;
  },

  addXP(pts) {
    this.update(d => {
      d.xp.points += pts;
      const newLevel = Math.floor(d.xp.points / 100) + 1;
      if (newLevel > d.xp.level) {
        d.xp.level = newLevel;
        d.xp.badges.push({ id: 'level_' + newLevel, name: 'Level ' + newLevel, date: new Date().toISOString() });
      }
    });
  },

  logActivity(text, icon = 'fa-circle-info') {
    this.push('activity', { text, icon, date: new Date().toISOString() });
  },

  clear() {
    localStorage.removeItem(this.KEY);
  }
};
