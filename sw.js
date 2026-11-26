// Service worker: la app abre sin señal con la última versión guardada.
const VER = 'siso-v30-2026-11-26';
const SHELL = ['./', './index.html', './app.js', './config.js', './manifest.webmanifest', './datos-iniciales.json',
  './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png', './icons/logo-empresa.png'];
const CDN = /^https:\/\/(cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)\//;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VER).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VER).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Datos y archivos de Supabase: siempre por red (la app guarda su propia copia).
  if (url.hostname.endsWith('supabase.co')) return;
  // Librerías y fuentes: primero caché.
  if (CDN.test(req.url)) {
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => {
      if (res.ok || res.type === 'opaque') { const cp = res.clone(); caches.open(VER).then(c => c.put(req, cp)); }
      return res;
    })));
    return;
  }
  // Archivos de la app: primero red (para recibir actualizaciones), si no hay señal, caché.
  if (url.origin === location.origin) {
    e.respondWith(fetch(req).then(res => {
      if (res.ok) { const cp = res.clone(); caches.open(VER).then(c => c.put(req, cp)); }
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match('./index.html'))));
  }
});
