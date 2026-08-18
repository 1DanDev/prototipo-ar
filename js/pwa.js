(() => {
  "use strict";

  const OFFLINE_READY_KEY = "historiasOfflineReady";
  let registration;
  let cacheRequested = false;
  let hideTimer;

  const status = document.createElement("p");
  status.className = "pwa-status";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  status.hidden = true;
  document.body.append(status);

  const onlineOnlyLinks = document.querySelectorAll("[data-online-only]");

  function updateOnlineOnlyLinks() {
    onlineOnlyLinks.forEach((link) => {
      link.setAttribute("aria-disabled", String(!navigator.onLine));
      link.title = navigator.onLine
        ? "Este enlace abre un servicio externo"
        : "Este enlace requiere conexión a Internet";
    });
  }

  onlineOnlyLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      if (navigator.onLine) return;
      event.preventDefault();
      showStatus("Issuu requiere conexión a Internet", "error", true);
    });
  });

  function showStatus(message, state = "loading", autoHide = false) {
    window.clearTimeout(hideTimer);
    status.textContent = message;
    status.dataset.state = state;
    status.classList.remove("is-hiding");
    status.hidden = false;

    if (autoHide) {
      hideTimer = window.setTimeout(() => {
        status.classList.add("is-hiding");
        window.setTimeout(() => {
          status.hidden = true;
          status.classList.remove("is-hiding");
        }, 200);
      }, 5200);
    }
  }

  function getWorker() {
    return navigator.serviceWorker.controller || registration?.active;
  }

  function requestFullCache() {
    if (cacheRequested || !navigator.onLine) return;

    const worker = getWorker();
    if (!worker) return;

    cacheRequested = true;
    showStatus("Preparando uso sin conexión…");
    worker.postMessage({ type: "CACHE_FULL_EXPERIENCE" });
  }

  function requestStatus() {
    const worker = getWorker();
    if (worker) worker.postMessage({ type: "GET_OFFLINE_STATUS" });
  }

  function handleWorkerMessage(event) {
    const message = event.data || {};

    if (message.type === "OFFLINE_STATUS") {
      if (message.ready) {
        localStorage.setItem(OFFLINE_READY_KEY, "true");
        showStatus(
          navigator.onLine ? "Disponible sin conexión" : "Modo sin conexión listo",
          navigator.onLine ? "ready" : "offline",
          true
        );
      } else if (!navigator.onLine) {
        localStorage.removeItem(OFFLINE_READY_KEY);
        showStatus("Sin conexión · contenido incompleto", "error", true);
      } else {
        requestFullCache();
      }
    }

    if (message.type === "OFFLINE_CACHE_PROGRESS") {
      const percent = Math.round((message.completed / message.total) * 100);
      showStatus(`Preparando uso sin conexión · ${percent}%`);
    }

    if (message.type === "OFFLINE_CACHE_READY") {
      localStorage.setItem(OFFLINE_READY_KEY, "true");
      showStatus("Disponible sin conexión", "ready", true);

      if (navigator.storage?.persist) {
        navigator.storage.persist().catch(() => false);
      }
    }

    if (message.type === "OFFLINE_CACHE_ERROR") {
      cacheRequested = false;
      showStatus("No se completó la descarga offline", "error", true);
      console.warn("Recursos offline pendientes:", message.failed);
    }
  }

  function updateConnectionStatus() {
    updateOnlineOnlyLinks();

    if (!navigator.onLine) {
      const wasReady = localStorage.getItem(OFFLINE_READY_KEY) === "true";
      showStatus(
        wasReady ? "Modo sin conexión listo" : "Sin conexión · contenido incompleto",
        wasReady ? "offline" : "error",
        true
      );
      return;
    }

    cacheRequested = false;
    requestStatus();
  }

  if (!("serviceWorker" in navigator)) {
    showStatus("Este navegador no admite modo offline", "error", true);
    return;
  }

  const hadController = Boolean(navigator.serviceWorker.controller);
  navigator.serviceWorker.addEventListener("message", handleWorkerMessage);
  window.addEventListener("online", updateConnectionStatus);
  window.addEventListener("offline", updateConnectionStatus);
  updateOnlineOnlyLinks();
  showStatus("Preparando uso sin conexión…");

  navigator.serviceWorker.register("./sw.js", { scope: "./" })
    .then(async (registeredWorker) => {
      registration = registeredWorker;
      await navigator.serviceWorker.ready;
      requestStatus();
    })
    .catch((error) => {
      showStatus("No se pudo activar el modo offline", "error", true);
      console.error("Error al registrar el Service Worker:", error);
    });

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (hadController) window.location.reload();
  });
})();
