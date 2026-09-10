// No account pages, bearer tokens or financial records are cached.
const base = new URL('./', self.location.href);
const debtUrl = new URL('?view=debts', base);
self.addEventListener('push', event => {
  let url = debtUrl.href;
  try {
    const requested = new URL(event.data.json().url, base);
    if (requested.origin === base.origin && (requested.pathname === base.pathname || requested.pathname === '/')) {
      url = new URL(requested.search, base).href;
    }
  } catch {}
  event.waitUntil(self.registration.showNotification('Money', {
    body: 'มีการเพิ่มหนี้หรือชำระหนี้แล้ว แตะเพื่อดูรายละเอียด',
    icon: new URL('icons/money-192.png', base).href,
    data: { url },
  }));
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  let url = debtUrl;
  try {
    const requested = new URL(event.notification.data?.url);
    if (requested.origin === base.origin && requested.pathname === base.pathname) url = requested;
  } catch {}
  event.waitUntil(clients.openWindow(url.href));
});
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(clients.claim()));
