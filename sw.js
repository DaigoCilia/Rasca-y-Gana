const CACHE = "mi-juego-cache-v1";

// archivos importantes del juego
const archivos = [
  "/",
  "/index.html",
  "/main.js",
  "/canvas.css",
  "/manifest.json",
  "https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.js"
];

// instalar el service worker
//Evento que se ejecuta una sola vez, cuando el Service Worker se instala
//Muestra en consola un mensaje en consola indicando que el Service Worker se ha instalado
self.addEventListener("install", (event) => {
  console.log("Service Worker instalado");

  event.waitUntil(
    caches.open(CACHE).then((cache) => {
      console.log("Guardando archivos en cache");
      return cache.addAll(archivos);
    })
  );
  self.skipWaiting();
});

// activar el service worker
self.addEventListener("activate", (event) => {
  console.log("Service Worker activado");
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// interceptar peticiones
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {

      // si existe en cache, lo usa
      if (response) {
        return response;
      }

      // si no existe, lo descarga
      return fetch(event.request)
        .then((networkResponse) => {
          return caches.open(CACHE).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          console.log("Offline y archivo no encontrado:", event.request.url);
        });
    })
  );
});
