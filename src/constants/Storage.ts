
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
}

export default STORAGE_KEY;