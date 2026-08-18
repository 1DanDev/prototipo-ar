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
  }

  function protectInteractiveElement(element) {
    // StPageFlip escucha gestos sobre el libro. Detenemos su propagación desde
    // el primer contacto para que el botón no comience un cambio de página.
    ["pointerdown", "mousedown", "touchstart"].forEach((eventName) => {
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
    const audioButton = document.querySelector('[data-action="audio"]');
    const label = audioButton?.querySelector(".action-label");

    if (label) label.textContent = "Reproducir Audio";
    audioButton?.setAttribute("aria-pressed", "false");
  });

  if (!window.St?.PageFlip) {
    bookElement.hidden = true;
    bookError.hidden = false;
    previousButton.disabled = true;
    nextButton.disabled = true;
    console.error("StPageFlip no está disponible. Revisa la carga del CDN.");
    return;
  }

  pageFlip = new window.St.PageFlip(bookElement, {
    width: 550,
    height: 780,
    size: "stretch",
    minWidth: 180,
    maxWidth: 550,
    minHeight: 255,
    maxHeight: 780,
    maxShadowOpacity: 0.45,
    showCover: true,
    mobileScrollSupport: true,
    usePortrait: true,
    autoSize: true,
    drawShadow: true,
    flippingTime: 750,
    startZIndex: 10
  });

  pageFlip.loadFromHTML(pages);
  updateNavigation(0);

  pageFlip.on("flip", (event) => {
    updateNavigation(event.data);

    // Evita que un audio continúe sonando al abandonar su página.
    if (!audio.paused && event.data !== 1) {
      audio.pause();
      audio.currentTime = 0;
      const audioButton = document.querySelector('[data-action="audio"]');
      const label = audioButton?.querySelector(".action-label");
      if (label) label.textContent = "Reproducir Audio";
      audioButton?.setAttribute("aria-pressed", "false");
    }
  });

  previousButton.addEventListener("click", () => {
    pageFlip.flipPrev();
  });

  nextButton.addEventListener("click", () => {
    pageFlip.flipNext();
  });
});
