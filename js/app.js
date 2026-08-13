const storyCard =
  document.querySelector("#story-card");

const storyName =
  document.querySelector("#story-name");

const storyQuote =
  document.querySelector("#story-quote");


let people = {};

let hideTimer = null;



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

      people[person.id] = person;

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
// TARGET ENCONTRADO
// ============================================


window.addEventListener(
  "person-found",
  (event) => {

    const personId =
      event.detail.personId;


    const person =
      people[personId];


    if (!person) {

      console.warn(
        "No existe información para:",
        personId
      );

      return;

    }


    clearTimeout(hideTimer);


    storyName.textContent =
      person.name;


    storyQuote.textContent =
      person.quote;


    AudioController.setSource(
      person.audio
    );


    storyCard.classList.remove(
      "hidden"
    );

  }
);



// ============================================
// TARGET PERDIDO
// ============================================


window.addEventListener(
  "person-lost",
  () => {

    clearTimeout(hideTimer);


    hideTimer = setTimeout(
      () => {

        storyCard.classList.add(
          "hidden"
        );

      },

      1500
    );

  }
);