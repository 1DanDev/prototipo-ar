const arTargets = document.querySelectorAll(
  "[mindar-image-target][data-person-id]"
);


// ============================================
// ESTADO DE LA SELECCIÓN
// ============================================

let selectedPersonId = null;

let arLocked = false;


// ============================================
// RECORRER TODOS LOS TARGETS
// ============================================

arTargets.forEach((target) => {

  const personId =
    target.dataset.personId;


  // ==========================================
  // TARGET ENCONTRADO
  // ==========================================

  target.addEventListener(
    "targetFound",
    () => {

      console.log(
        "Target encontrado:",
        personId
      );


      /*
       * Si ya existe una persona seleccionada,
       * ignoramos cualquier otra imagen.
       */

      if (arLocked) {

        console.log(
          "AR bloqueada. Se ignora:",
          personId
        );

        return;

      }


      /*
       * No bloquear el target del título.
       */

      if (personId === "titulo") {

        return;

      }


      /*
       * Guardamos la persona seleccionada.
       */

      selectedPersonId =
        personId;


      /*
       * Bloqueamos la selección.
       */

      arLocked = true;


      /*
       * Avisamos a app.js.
       */

      window.dispatchEvent(

        new CustomEvent(
          "person-found",
          {
            detail: {
              personId: personId
            }
          }
        )

      );

    }
  );


  // ==========================================
  // TARGET PERDIDO
  // ==========================================

  target.addEventListener(
    "targetLost",
    () => {

      console.log(
        "Target perdido:",
        personId
      );


      /*
       * NO desbloqueamos aquí.
       *
       * La imagen y el panel deben permanecer
       * hasta que el usuario presione X.
       */

      window.dispatchEvent(

        new CustomEvent(
          "person-lost",
          {
            detail: {
              personId: personId
            }
          }
        )

      );

    }
  );

});


// ============================================
// FUNCIÓN PARA CERRAR LA SELECCIÓN
// ============================================

function unlockAR() {

  console.log(
    "Desbloqueando AR..."
  );


  selectedPersonId =
    null;


  arLocked =
    false;


  console.log(
    "AR desbloqueada. Se puede escanear otra imagen."
  );

}


// ============================================
// HACERLA DISPONIBLE PARA EL BOTÓN X
// ============================================

window.unlockAR =
  unlockAR;