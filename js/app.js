// =========================================================
// INTERFAZ + IMAGEN HTML ESTABLE
// =========================================================

const onboarding = document.querySelector("#onboarding");
const startButton = document.querySelector("#start-button");
const scanUI = document.querySelector("#scan-ui");
const posterResult = document.querySelector("#poster-result");
const storyCard = document.querySelector("#story-card");
const storyName = document.querySelector("#story-name");
const storyQuote = document.querySelector("#story-quote");
const learnMoreLink = document.querySelector("#learn-more-link");
const fixedImageContainer = document.querySelector("#fixed-image-container");
const fixedImage = document.querySelector("#fixed-image");
const closeARButton = document.querySelector("#close-ar");
const scanAgainButton = document.querySelector("#scan-again-button");

// Respaldo local para que la interfaz funcione aunque people.json tarde.
let people = {
  denisse: {
    id: "denisse",
    name: "Dra. Denisse Barrientos Argüelles",
    quote: "Aquí irá una frase breve de Denisse.",
    image: "./assets/images/denisse.png",
    audio: "./assets/audio/denisse.mp3",
    learnMoreUrl: "./historia.html?id=denisse"
  },
  esther: {
    id: "esther",
    name: "Esther",
    quote: "Aquí irá una frase breve de Esther.",
    image: "./assets/images/esther-06.png",
    audio: "",
    learnMoreUrl: "./historia.html?id=esther"
  },
  rubi: {
    id: "rubi",
    name: "Rubí",
    quote: "Aquí irá una frase breve de Rubí.",
    image: "./assets/images/rubí.png",
    audio: "",
    learnMoreUrl: "./historia.html?id=rubi"
  },
  maria: {
    id: "maria",
    name: "María",
    quote: "Aquí irá una frase breve de María.",
    image: "./assets/images/maria.png",
    audio: "",
    learnMoreUrl: "./historia.html?id=maria"
  },
  patricia: {
    id: "patricia",
    name: "Patricia",
    quote: "Aquí irá una frase breve de Patricia.",
    image: "./assets/images/patricia.png",
    audio: "",
    learnMoreUrl: "./historia.html?id=patricia"
  },
  monica: {
    id: "monica",
    name: "Mónica",
    quote: "Aquí irá una frase breve de Mónica.",
    image: "./assets/images/monica.png",
    audio: "",
    learnMoreUrl: "./historia.html?id=monica"
  }
};

let activeTargetId = null;
let activeTargetVisible = false;
let pendingTargetId = null;
let storyLocked = false;
let tutorialFinished = sessionStorage.getItem("tutorialVisto") === "true";

function hide(element) {
  if (!element) return;
  element.classList.add("hidden");
  element.hidden = true;
  element.style.setProperty("display", "none", "important");
}

function show(element) {
  if (!element) return;
  element.classList.remove("hidden");
  element.hidden = false;
  element.style.removeProperty("display");
}

function hideFixedImage() {
  hide(fixedImageContainer);
  hide(closeARButton);
  fixedImage.removeAttribute("src");
  fixedImage.alt = "";
}

function showScanState() {
  hide(posterResult);
  hide(storyCard);
  hideFixedImage();
  show(scanUI);
  activeTargetId = null;
  activeTargetVisible = false;
}

function finishTutorial() {
  sessionStorage.setItem("tutorialVisto", "true");
  tutorialFinished = true;
  hide(onboarding);

  if (pendingTargetId) {
    const targetId = pendingTargetId;
    pendingTargetId = null;
    handleTargetFound(targetId);
  } else {
    showScanState();
  }
}

startButton.addEventListener("click", finishTutorial);

if (tutorialFinished) {
  hide(onboarding);
  showScanState();
}

async function loadPeople() {
  try {
    const response = await fetch("./data/people.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    people = Object.fromEntries(data.map((person) => [person.id, person]));
  } catch (error) {
    console.warn("Se usarán los datos de respaldo. Error en people.json:", error);
  }
}

loadPeople();

function renderPerson(person) {
  storyName.textContent = person.name;
  storyQuote.textContent = person.quote;
  learnMoreLink.href = person.learnMoreUrl || `./historia.html?id=${person.id}`;
  AudioController.setSource(person.audio);
}

function showFixedImage(person) {
  hideFixedImage();

  if (!person.image) return;

  // Limpiar primero evita que se vea por un instante la científica anterior.
  window.requestAnimationFrame(() => {
    if (!storyLocked || activeTargetId !== person.id) return;

    fixedImage.src = person.image;
    fixedImage.alt = `Imagen de ${person.name}`;
    show(fixedImageContainer);
    show(closeARButton);
  });
}

function showPosterResult() {
  hide(scanUI);
  hide(storyCard);
  hideFixedImage();
  show(posterResult);
}

function showPersonResult(person) {
  storyLocked = true;
  hide(scanUI);
  hide(posterResult);
  renderPerson(person);
  showFixedImage(person);
  show(storyCard);
}

function closeCurrentStory() {
  storyLocked = false;
  pendingTargetId = null;
  AudioController.stop();
  showScanState();
  console.log("Historia cerrada. El escáner está listo para otro target.");
}

closeARButton.addEventListener("click", closeCurrentStory);
scanAgainButton.addEventListener("click", closeCurrentStory);

function handleTargetFound(personId) {
  if (!tutorialFinished) {
    pendingTargetId = personId;
    return;
  }

  // La historia permanece estable hasta presionar X o “Escanear otra”.
  if (storyLocked) {
    console.log("Historia fija activa. Se ignora temporalmente:", personId);
    return;
  }

  activeTargetId = personId;
  activeTargetVisible = true;

  if (personId === "titulo") {
    showPosterResult();
    return;
  }

  const person = people[personId];
  if (!person) {
    console.warn("No existe información para:", personId);
    showScanState();
    return;
  }

  showPersonResult(person);
}

function handleTargetLost(personId) {
  if (!tutorialFinished) {
    if (pendingTargetId === personId) pendingTargetId = null;
    return;
  }

  if (personId === activeTargetId) activeTargetVisible = false;

  // La mejora de Andy: las historias no desaparecen por pequeñas pérdidas
  // de tracking; solo se cierran con una acción explícita del usuario.
  if (storyLocked) return;

  if (personId === activeTargetId) {
    AudioController.stop();
    showScanState();
  }
}

fixedImage.addEventListener("error", () => {
  console.warn("No se pudo cargar la imagen estable de:", activeTargetId);
  hide(fixedImageContainer);
});

// API única entre MindAR y la interfaz. Evita los dos bloqueos incompatibles
// que existían al ejecutar listeners duplicados.
window.ARUI = {
  handleTargetFound,
  handleTargetLost,
  closeCurrentStory
};
