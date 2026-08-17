const storyCard =
  document.querySelector("#story-card");

const storyQuote =
  document.querySelector("#story-quote");


let people = {};


// ============================================
// CARGAR PEOPLE.JSON
// ============================================

async function loadPeople() {

  try {

    const response =
      await fetch("./data/people.json");

    const data =
      await response.json();

    data.forEach((person) => {

      people[person.id] =
        person;

    });

    console.log(
      "Personas cargadas:",
      people
    );

  }

  catch (error) {

    console.error(
      "Error cargando people.json:",
      error
    );

  }

}


loadPeople();


// ============================================
// PERSONA ENCONTRADA
// ============================================

window.addEventListener(
  "person-found",
  (event) => {

    const personId =
      event.detail.personId;


    console.log(
      "Mostrando panel:",
      personId
    );


    const person =
      people[personId];


    if (!person) {

      console.warn(
        "No existe información para:",
        personId
      );

      return;

    }


    // ========================================
    // MOSTRAR SOLO LA FRASE
    // ========================================

    storyQuote.textContent =
      person.quote;


    // ========================================
    // CONFIGURAR AUDIO
    // ========================================

    AudioController.setSource(
      person.audio
    );


    // ========================================
    // MOSTRAR PANEL
    // ========================================

    storyCard.classList.remove(
      "hidden"
    );


    console.log(
      "Panel mostrado correctamente para:",
      personId
    );

  }
);


// ============================================
// PERSONA PERDIDA
// ============================================

window.addEventListener(
  "person-lost",
  (event) => {

    console.log(
      "Marcador perdido:",
      event.detail?.personId
    );


    /*
     * NO OCULTAR EL PANEL.
     *
     * Se queda visible hasta X.
     */

  }
);


// ============================================
// CERRAR PANEL
// ============================================

function unlockStoryPanel() {

  storyCard.classList.add(
    "hidden"
  );


  storyQuote.textContent =
    "";


  console.log(
    "Panel cerrado."
  );

}


// ============================================
// DISPONIBLE GLOBALMENTE
// ============================================

window.unlockStoryPanel =
  unlockStoryPanel;