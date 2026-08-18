document.addEventListener("DOMContentLoaded", () => {
  const bookElement = document.querySelector("#book-container");
  const pages = document.querySelectorAll("#book-container .book-page");
  const previousButton = document.querySelector("#previous-page");
  const nextButton = document.querySelector("#next-page");
  const pageStatus = document.querySelector("#page-status");
  const bookError = document.querySelector("#book-error");
  const audio = document.querySelector("#fanzine-audio");
  const actionFeedback = document.querySelector("#action-feedback");

  let pageFlip;
  let feedbackTimer;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function showFeedback(message) {
    window.clearTimeout(feedbackTimer);
    actionFeedback.textContent = message;
    actionFeedback.hidden = false;

    feedbackTimer = window.setTimeout(() => {
      actionFeedback.hidden = true;
    }, 2400);
  }

  function updateNavigation(currentPage = 0) {
    const totalPages = pages.length;
    const visiblePage = Math.min(currentPage + 1, totalPages);

    pageStatus.textContent = `Página ${visiblePage} de ${totalPages}`;
    previousButton.disabled = currentPage <= 0;
    nextButton.disabled = currentPage >= totalPages - 1;
    bookElement.dataset.currentPage = String(visiblePage);
  }

  function resetAudio() {
    const audioButton = document.querySelector('[data-action="audio"]');
    const label = audioButton?.querySelector(".action-label");

    audio.pause();
    audio.currentTime = 0;
    if (label) label.textContent = "Reproducir Audio";
    audioButton?.setAttribute("aria-pressed", "false");
  }

  function protectInteractiveElement(element) {
    // StPageFlip escucha gestos sobre el libro. Detenemos su propagación desde
    // el primer contacto para que el botón no comience un cambio de página.
    ["pointerdown", "pointerup", "mousedown", "touchstart"].forEach((eventName) => {
      element.addEventListener(eventName, (event) => {
        event.stopPropagation();
      }, { passive: true });
    });

    element.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const action = event.currentTarget.dataset.action;

      if (action === "audio") {
        const audioButton = event.currentTarget;
        const label = audioButton.querySelector(".action-label");

        if (audio.paused) {
          audio.play()
            .then(() => {
              label.textContent = "Pausar Audio";
              audioButton.setAttribute("aria-pressed", "true");
              console.log("Audio del fanzine en reproducción.");
            })
            .catch((error) => {
              console.warn("No se pudo reproducir el audio:", error);
              showFeedback("No se pudo reproducir el audio.");
            });
        } else {
          audio.pause();
          label.textContent = "Reproducir Audio";
          audioButton.setAttribute("aria-pressed", "false");
          console.log("Audio del fanzine en pausa.");
        }
      }

      if (action === "more") {
        console.log("Acción “Saber más” ejecutada sin pasar de página.");
        showFeedback("Aquí puedes abrir una historia, video o dinámica.");
      }
    });
  }

  document.querySelectorAll("#book-container .page-action")
    .forEach(protectInteractiveElement);

  audio.addEventListener("ended", () => {
    resetAudio();
  });

  if (!window.St?.PageFlip) {
    bookElement.hidden = true;
    bookError.hidden = false;
    previousButton.disabled = true;
    nextButton.disabled = true;
    console.error("StPageFlip no está disponible. Revisa el archivo local de la librería.");
    return;
  }

  pageFlip = new window.St.PageFlip(bookElement, {
    // Proporción vertical 740 × 1050, igual a las páginas SVG exportadas.
    width: 420,
    height: 596,
    size: "stretch",
    minWidth: 260,
    maxWidth: 560,
    minHeight: 369,
    maxHeight: 795,
    maxShadowOpacity: 0.72,
    showCover: true,
    mobileScrollSupport: true,
    usePortrait: true,
    autoSize: true,
    drawShadow: true,
    flippingTime: reducedMotion ? 420 : 1350,
    startZIndex: 10,
    swipeDistance: 18,
    clickEventForward: true,
    showPageCorners: !reducedMotion,
    disableFlipByClick: false
  });

  // El modo HTML permite conservar los botones superpuestos y deformar cada
  // hoja como papel flexible durante el giro.
  pageFlip.loadFromHTML(pages);

  // showCover mantiene la portada sola, pero la librería la convierte
  // internamente en una tapa rígida. Restauramos "soft" después de crear los
  // pliegos para conservar esa maquetación y obtener curvatura desde el primer
  // giro, incluida la portada y la contraportada.
  for (let index = 0; index < pages.length; index += 1) {
    pageFlip.getPage(index).setDensity("soft");
  }

  updateNavigation(0);

  pageFlip.on("flip", (event) => {
    updateNavigation(event.data);

    // Evita que un audio continúe sonando al abandonar su página.
    if (!audio.paused && event.data !== 1) {
      resetAudio();
    }
  });

  pageFlip.on("changeOrientation", (event) => {
    bookElement.dataset.orientation = event.data;
  });

  pageFlip.on("changeState", (event) => {
    bookElement.dataset.flipState = event.data;
  });

  previousButton.addEventListener("click", () => {
    // flipPrev/flipNext sí animan la hoja; turnToPrevPage/turnToNextPage no.
    pageFlip.flipPrev("bottom");
  });

  nextButton.addEventListener("click", () => {
    pageFlip.flipNext("bottom");
  });

  document.addEventListener("keydown", (event) => {
    if (event.target.closest("button, a, input, textarea, select")) return;

    if (event.key === "ArrowLeft") pageFlip.flipPrev("bottom");
    if (event.key === "ArrowRight") pageFlip.flipNext("bottom");
  });
});
