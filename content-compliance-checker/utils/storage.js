// ============================================================
// Chrome Storage 封装
// ============================================================

const Storage = {
  // 用户订阅状态
  async getSubscription() {
    const data = await chrome.storage.local.get("subscription");
    return data.subscription || { plan:"free", dailyScans:0, scanDate:today(), expiresAt:null };
  },

  async setSubscription(sub) {
    await chrome.storage.local.set({ subscription:sub });
  },

  // 每日扫描次数管理
  async canScan() {
    const sub = await this.getSubscription();
    if (sub.scanDate !== today()) {
      sub.dailyScans = 0;
      sub.scanDate = today();
      await this.setSubscription(sub);
    }
    if (sub.plan === "pro") return true;
    return sub.dailyScans < 3;
  },

  async recordScan() {
    const sub = await this.getSubscription();
    if (sub.scanDate !== today()) { sub.dailyScans=0; sub.scanDate=today(); }
    sub.dailyScans++;
    await this.setSubscription(sub);
  },

  async getRemainingScans() {
    const sub = await this.getSubscription();
    if (sub.plan === "pro") return Infinity;
    if (sub.scanDate !== today()) return 3;
    return Math.max(0, 3 - sub.dailyScans);
  },

  // 收藏的规则/白名单
  async getFavorites() {
    const data = await chrome.storage.local.get("favorites");
    return data.favorites || [];
  },

  async addFavorite(word) {
    const favs = await this.getFavorites();
    if (!favs.includes(word)) { favs.push(word); await chrome.storage.local.set({favorites:favs}); }
  },

  async removeFavorite(word) {
    const favs = await this.getFavorites();
    await chrome.storage.local.set({ favorites:favs.filter(w=>w!==word) });
  }
};

function today() { return new Date().toISOString().slice(0,10); }
