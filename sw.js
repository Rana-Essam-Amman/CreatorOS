const CACHE = 'creatoros-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/main.css',
  '/modules.css',
  '/animations.css',
  '/app.js',
  '/storage.js',
  '/utils.js',
  '/i18n.js',
  '/toast.js',
  '/ai-persona.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).catch(() => caches.match('/index.html')))
  );
});
