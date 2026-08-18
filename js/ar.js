// Este archivo es el único puente entre MindAR y la interfaz HTML.
// No modifica el tracking ni los objetos 3D de los siete targets.
const arTargets = document.querySelectorAll(
  "[mindar-image-target][data-person-id]"
);

const confirmationTimers = new Map();
const confirmedTargets = new Set();

arTargets.forEach((target) => {
  const personId = target.dataset.personId;

  target.addEventListener("targetFound", () => {
    console.log("Target encontrado:", personId);

    window.clearTimeout(confirmationTimers.get(target));

    // El mural se responde inmediatamente. Para los rostros se espera un
    // momento breve y se descartan detecciones que se pierdan enseguida.
    const confirmationDelay = personId === "titulo" ? 0 : 250;
    const timer = window.setTimeout(() => {
      confirmedTargets.add(target);
      window.ARUI.handleTargetFound(personId);
    }, confirmationDelay);

    confirmationTimers.set(target, timer);
  });

  target.addEventListener("targetLost", () => {
    console.log("Target perdido:", personId);

    window.clearTimeout(confirmationTimers.get(target));
    confirmationTimers.delete(target);

    if (confirmedTargets.has(target)) {
      confirmedTargets.delete(target);
      window.ARUI.handleTargetLost(personId);
    }
  });
});
