const params = new URLSearchParams(window.location.search);
const requestedId = params.get("id") || "denisse";

const nameElement = document.querySelector("#person-name");
const quoteElement = document.querySelector("#person-quote");
const imageElement = document.querySelector("#person-image");
const audioElement = document.querySelector("#person-audio");
const storyElement = document.querySelector("#person-story");

async function loadStory() {
  try {
    const response = await fetch("./data/people.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const people = await response.json();
    const person = people.find((item) => item.id === requestedId && item.id !== "titulo");

    if (!person) {
      window.location.replace("./index.html");
      return;
    }

    document.title = `${person.name} · Historias que inspiran`;
    nameElement.textContent = person.name;
    quoteElement.textContent = person.quote;
    imageElement.src = person.image;
    imageElement.alt = `Retrato de ${person.name}`;

    if (person.audio) {
      audioElement.src = person.audio;
      audioElement.hidden = false;
    }

    // Si después agregas "story" en people.json, aparecerá automáticamente.
    if (person.story) storyElement.textContent = person.story;
  } catch (error) {
    console.error("No se pudo cargar la historia:", error);
    nameElement.textContent = "Historia no disponible";
    quoteElement.textContent = "Vuelve al escáner e inténtalo nuevamente.";
    imageElement.hidden = true;
  }
}

loadStory();
