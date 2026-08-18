"use strict";

const VERSION = "6.1.0";
const CACHE_PREFIX = "historias-que-inspiran";
const SHELL_CACHE = `${CACHE_PREFIX}-shell-${VERSION}`;
const ASSET_CACHE = `${CACHE_PREFIX}-assets-${VERSION}`;
const RUNTIME_CACHE = `${CACHE_PREFIX}-runtime-${VERSION}`;
const CURRENT_CACHES = [RUNTIME_CACHE, ASSET_CACHE, SHELL_CACHE];
const SCOPE = self.registration.scope;
const absolute = (path) => new URL(path, SCOPE).href;
const READY_MARKER = absolute("./__offline_ready__");

const APP_SHELL = [
  "./",
  "./index.html",
  "./fanzine.html",
  "./historia.html",
  "./collage.html",
  "./manifest.webmanifest",
  "./css/styles.css",
  "./css/fanzine.css",
  "./css/historia.css",
  "./css/collage.css",
  "./css/pwa.css",
  "./js/app.js",
  "./js/ar.js",
  "./js/audio.js",
  "./js/fanzine.js",
  "./js/historia.js",
  "./js/collage.js",
  "./js/pwa.js",
  "./data/people.json",
  "./vendor/aframe/aframe-v1.5.0.min.js",
  "./vendor/aframe-extras/aframe-extras-7.5.4.min.js",
  "./vendor/mindar/mindar-image-aframe-1.2.5.prod.js",
  "./vendor/page-flip/page-flip-2.0.7.browser.js",
  "./targets/targets.mind",
  "./assets/models/mural.glb",
  "./assets/icons/app-icon.svg",
  "./assets/icons/app-icon-192.png",
  "./assets/icons/app-icon-512.png"
];

const EXPERIENCE_ASSETS = [
  "./assets/fanzine/pagina-01.svg",
  "./assets/fanzine/pagina-02.svg",
  "./assets/fanzine/pagina-03.svg",
  "./assets/fanzine/pagina-04.svg",
  "./assets/articles/rubi.png",
  "./assets/articles/denisse.png",
  "./assets/articles/esther.png",
  "./assets/articles/maria.png",
  "./assets/articles/patricia.png",
  "./assets/articles/monica.png",
  "./assets/collage/escribe-tu-frase.png",
  "./assets/images/denisse.png",
  "./assets/images/esther-06.png",
  "./assets/images/maria.png",
  "./assets/images/monica.png",
  "./assets/images/patricia.png",
  "./assets/images/rubí.png",
  "./assets/audio/denisse.mp3",
  "./assets/audio/esther.mp3",
  "./assets/audio/maria.mp3",
  "./assets/audio/monica.mp3",
  "./assets/audio/patricia.mp3",
  "./assets/audio/rubi.mp3"
];

let fullCachePromise = null;

async function notify(client, payload) {
  if (client?.postMessage) {
    client.postMessage(payload);
    return;
  }

  const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
  windows.forEach((windowClient) => windowClient.postMessage(payload));
}

async function matchCurrentThenAny(request) {
  for (const cacheName of CURRENT_CACHES) {
    const cache = await caches.open(cacheName);
    const response = await cache.match(request, { ignoreSearch: true });
    if (response) return response;
  }

  return caches.match(request, { ignoreSearch: true });
}

async function cacheFullExperience(client) {
  if (fullCachePromise) return fullCachePromise;

  fullCachePromise = (async () => {
    const cache = await caches.open(ASSET_CACHE);
    const failed = [];
    let completed = 0;

    for (const path of EXPERIENCE_ASSETS) {
      const url = absolute(path);

      try {
        try {
          const response = await fetch(new Request(url, { cache: "reload" }));
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          await cache.put(url, response.clone());
        } catch (networkError) {
          const existing = await matchCurrentThenAny(url);
          if (!existing) throw networkError;
          await cache.put(url, existing.clone());
        }
      } catch (error) {
        failed.push(path);
        console.warn("No se pudo guardar para uso offline:", path, error);
      }

      completed += 1;
      await notify(client, {
        type: "OFFLINE_CACHE_PROGRESS",
        completed,
        total: EXPERIENCE_ASSETS.length
      });
    }

    if (failed.length) {
      await notify(client, { type: "OFFLINE_CACHE_ERROR", failed });
      return false;
    }

    await cache.put(
      READY_MARKER,
      new Response(JSON.stringify({ version: VERSION, readyAt: Date.now() }), {
        headers: { "Content-Type": "application/json" }
      })
    );

    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((key) => key.startsWith(CACHE_PREFIX) && !CURRENT_CACHES.includes(key))
        .map((key) => caches.delete(key))
    );

    await notify(client, { type: "OFFLINE_CACHE_READY", version: VERSION });
    return true;
  })().finally(() => {
    fullCachePromise = null;
  });

  return fullCachePromise;
}

async function networkFirst(request, preloadResponse) {
  const cache = await caches.open(RUNTIME_CACHE);

  try {
    const response = await Promise.race([
      preloadResponse?.then((preloaded) => preloaded || fetch(request)) || fetch(request),
      new Promise((_, reject) => setTimeout(() => reject(new Error("network-timeout")), 3500))
    ]);

    if (response?.ok) await cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await matchCurrentThenAny(request);
    if (cached) return cached;

    const pathname = new URL(request.url).pathname;
    if (pathname.endsWith("fanzine.html")) {
      return matchCurrentThenAny(absolute("./fanzine.html"));
    }
    if (pathname.endsWith("historia.html")) {
      return matchCurrentThenAny(absolute("./historia.html"));
    }
    if (pathname.endsWith("collage.html")) {
      return matchCurrentThenAny(absolute("./collage.html"));
    }
    return matchCurrentThenAny(absolute("./index.html"));
  }
}

async function staleWhileRevalidate(request, event) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await matchCurrentThenAny(request);
  const networkUpdate = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);

  if (cached) {
    event.waitUntil(networkUpdate);
    return cached;
  }

  const response = await networkUpdate;
  if (response) return response;
  throw new Error(`Recurso no disponible offline: ${request.url}`);
}

async function rangeResponse(request) {
  const cached = await matchCurrentThenAny(request.url);
  if (!cached) return fetch(request);

  const range = request.headers.get("range");
  const match = /bytes=(\d*)-(\d*)/.exec(range || "");
  if (!match) return cached;

  const buffer = await cached.arrayBuffer();
  const isSuffixRange = !match[1] && Boolean(match[2]);
  const start = isSuffixRange
    ? Math.max(buffer.byteLength - Number(match[2]), 0)
    : Number(match[1] || 0);
  const requestedEnd = isSuffixRange
    ? buffer.byteLength - 1
    : Number(match[2] || buffer.byteLength - 1);
  const end = Math.min(requestedEnd, buffer.byteLength - 1);

  if (start >= buffer.byteLength || start > end) {
    return new Response(null, {
      status: 416,
      headers: { "Content-Range": `bytes */${buffer.byteLength}` }
    });
  }

  return new Response(buffer.slice(start, end + 1), {
    status: 206,
    statusText: "Partial Content",
    headers: {
      "Accept-Ranges": "bytes",
      "Content-Length": String(end - start + 1),
      "Content-Range": `bytes ${start}-${end}/${buffer.byteLength}`,
      "Content-Type": cached.headers.get("Content-Type") || "application/octet-stream"
    }
  });
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then((cache) => cache.addAll(APP_SHELL.map(absolute)))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      self.registration.navigationPreload?.enable()
    ])
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "CACHE_FULL_EXPERIENCE") {
    event.waitUntil(cacheFullExperience(event.source));
  }

  if (event.data?.type === "GET_OFFLINE_STATUS") {
    event.waitUntil(
      caches.open(ASSET_CACHE)
        .then((cache) => cache.match(READY_MARKER))
        .then((marker) => notify(event.source, {
          type: "OFFLINE_STATUS",
          ready: Boolean(marker),
          version: VERSION
        }))
    );
  }
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (request.headers.has("range")) {
    event.respondWith(rangeResponse(request));
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, event.preloadResponse));
    return;
  }

  event.respondWith(staleWhileRevalidate(request, event));
});
