
const STORAGE_KEY = {
  yingjian: 'zeraix',
  userInfo: 'zeraix.userInfo',
  soundNotification: 'zeraix.soundNotification',
  // Custom notification-sound config per system-notification type (info/success/warning/error)
  notifySound: 'zeraix.notifySound',
  // System-notification behavior preferences (round completion / permission / question notifications)
  notifyPrefs: 'zeraix.notifyPrefs',
  // Stripe top-up order awaiting confirmation ({ outTradeNo, amountUsd, createdAt }); lets polling resume after a restart
  pendingTopup: 'zeraix.pendingTopup',
  // Absolute context working-set budget in K tokens (auto-compaction cap); 0 = disabled (window-relative only)
  contextBudget: 'zeraix.contextBudget',
}

export default STORAGE_KEY;