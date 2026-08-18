document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const STORAGE_KEY = "historiasCollageFrasesV1";
  const MAX_SAVED_PHRASES = 24;

  const professorPhrases = [
    { author: "Ing. Rubí Hernández Luis", text: "Si falta una mujer en la mesa, hay que hacerle espacio." },
    { author: "Dra. Mirna Denisse Barreiro Argüelles", text: "Un resultado que sale mal no significa que tú seas mala en lo que haces." },
    { author: "Dra. Esther Lugo González", text: "La ingeniería no pertenece a los hombres. La ingeniería es ingeniería." },
    { author: "Dra. María de Jesús Martínez López", text: "Cuando una mujer ocupa un espacio, otra puede imaginarse ahí." },
    { author: "Dra. Patricia Magaly Gallegos", text: "La ingeniería no se sufre, se disfruta." },
    { author: "M.C. Mónica Edith García García", text: "¿Quién te dijo que no podías?" }
  ];

  const layouts = [
    { x: 14, y: 18, rotation: "-3deg", drift: "8px", duration: "7.2s", delay: "-.8s" },
    { x: 77, y: 20, rotation: "2deg", drift: "10px", duration: "8.1s", delay: "-2.2s" },
    { x: 25, y: 47, rotation: "2deg", drift: "7px", duration: "6.8s", delay: "-1.4s" },
    { x: 73, y: 50, rotation: "-2deg", drift: "11px", duration: "8.4s", delay: "-3s" },
    { x: 18, y: 77, rotation: "-1deg", drift: "9px", duration: "7.6s", delay: "-2.6s" },
    { x: 80, y: 78, rotation: "3deg", drift: "8px", duration: "7.9s", delay: "-1.1s" },
    { x: 49, y: 70, rotation: "-2deg", drift: "10px", duration: "8.2s", delay: "-3.4s" },
    { x: 48, y: 31, rotation: "1deg", drift: "7px", duration: "7.1s", delay: "-1.8s" }
  ];

  const phraseCloud = document.querySelector("#phrase-cloud");
  const openButton = document.querySelector("#open-phrase-form");
  const closeButton = document.querySelector("#close-phrase-form");
  const dialog = document.querySelector("#phrase-dialog");
  const form = document.querySelector("#phrase-form");
  const phraseInput = document.querySelector("#phrase-text");
  const authorInput = document.querySelector("#phrase-author");
  const characterCount = document.querySelector("#character-count");
  const feedback = document.querySelector("#collage-feedback");

  let feedbackTimer;
  let lastFocus;
  let highlightedId = null;

  function readSavedPhrases() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(parsed) ? parsed.slice(-MAX_SAVED_PHRASES) : [];
    } catch (error) {
      console.warn("No se pudieron leer las frases guardadas:", error);
      return [];
    }
  }

  function savePhrases(phrases) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(phrases.slice(-MAX_SAVED_PHRASES)));
      return true;
    } catch (error) {
      console.warn("No se pudo guardar la frase:", error);
      return false;
    }
  }

  function createPhraseCard(phrase, index, isCommunity = false) {
    const layout = layouts[index % layouts.length];
    const card = document.createElement("article");
    const quote = document.createElement("blockquote");
    const author = document.createElement("footer");

    card.className = "phrase-card";
    if (isCommunity) card.classList.add("is-community");
    if (phrase.id && phrase.id === highlightedId) card.classList.add("is-new");

    const isHighlighted = card.classList.contains("is-new");
    card.style.setProperty("--x", `${isHighlighted ? 50 : layout.x}%`);
    card.style.setProperty("--y", `${isHighlighted ? 52 : layout.y}%`);
    card.style.setProperty("--rotation", layout.rotation);
    card.style.setProperty("--drift", layout.drift);
    card.style.setProperty("--duration", layout.duration);
    card.style.setProperty("--delay", layout.delay);
    card.setAttribute("role", "article");
    card.setAttribute("aria-label", `Frase de ${phrase.author}`);

    quote.textContent = `“${phrase.text}”`;
    author.textContent = phrase.author;
    card.append(quote, author);
    return card;
  }

  function renderCollage() {
    const savedPhrases = readSavedPhrases();
    const visibleCommunity = savedPhrases.slice(-4);
    phraseCloud.replaceChildren();

    professorPhrases.forEach((phrase, index) => {
      phraseCloud.append(createPhraseCard(phrase, index));
    });

    visibleCommunity.forEach((phrase, index) => {
      phraseCloud.append(createPhraseCard(phrase, professorPhrases.length + index, true));
    });

    const highlightedCard = phraseCloud.querySelector(".is-new");
    if (highlightedCard) {
      highlightedCard.tabIndex = -1;
      window.setTimeout(() => highlightedCard.focus({ preventScroll: true }), 100);
    }
  }

  function openDialog() {
    lastFocus = document.activeElement;
    dialog.hidden = false;
    document.body.classList.add("dialog-open");
    window.setTimeout(() => phraseInput.focus(), 30);
  }

  function closeDialog() {
    dialog.hidden = true;
    document.body.classList.remove("dialog-open");
    lastFocus?.focus();
  }

  function showFeedback(message) {
    window.clearTimeout(feedbackTimer);
    feedback.textContent = message;
    feedback.hidden = false;
    feedbackTimer = window.setTimeout(() => {
      feedback.hidden = true;
    }, 4200);
  }

  phraseInput.addEventListener("input", () => {
    characterCount.textContent = `${phraseInput.value.length} de 180 caracteres`;
  });

  openButton.addEventListener("click", openDialog);
  closeButton.addEventListener("click", closeDialog);

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !dialog.hidden) closeDialog();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const text = phraseInput.value.trim().replace(/\s+/g, " ");
    const author = authorInput.value.trim().replace(/\s+/g, " ") || "Voz anónima";
    if (!text) {
      phraseInput.focus();
      return;
    }

    const savedPhrases = readSavedPhrases();
    const phrase = {
      id: window.crypto?.randomUUID?.() || `frase-${Date.now()}`,
      text: text.slice(0, 180),
      author: author.slice(0, 30),
      createdAt: new Date().toISOString()
    };

    highlightedId = phrase.id;
    const wasSaved = savePhrases([...savedPhrases, phrase]);
    form.reset();
    characterCount.textContent = "0 de 180 caracteres";
    closeDialog();
    renderCollage();
    showFeedback(
      wasSaved
        ? "Tu frase ya forma parte del mural. Gracias por sumar tu voz."
        : "Tu frase aparece ahora, pero el navegador no permitió guardarla."
    );
  });

  const savedPhrases = readSavedPhrases();
  highlightedId = savedPhrases.at(-1)?.id || null;
  renderCollage();
});
