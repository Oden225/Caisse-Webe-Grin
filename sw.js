/* Ma Cotisation : fonctionnement hors connexion (cache des fichiers de l'application) */
const CACHE = "ma-cotisation-v2-2";
const FICHIERS = [
  "./", "./index.html", "./css/app.css", "./manifest.webmanifest",
  "./js/donnees.js", "./js/docx.js", "./js/rapports.js", "./js/app.js",
  "./lib/jspdf.umd.min.js", "./lib/jspdf.plugin.autotable.min.js",
  "./icones/icone.svg", "./icones/icone-192.png", "./icones/icone-512.png"
];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FICHIERS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((n) => n !== CACHE).map((n) => caches.delete(n)))).then(() => self.clients.claim()));
});
/* Réseau d'abord (pour recevoir les mises à jour), cache si pas de connexion */
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then((r) => {
      const copie = r.clone();
      caches.open(CACHE).then((c) => c.put(e.request, copie));
      return r;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
