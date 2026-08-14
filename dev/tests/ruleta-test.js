(() => {
  const wheel = document.querySelector('#wheel');
  const spinButton = document.querySelector('#spinButton');
  const resetButton = document.querySelector('#resetButton');
  const result = document.querySelector('#result');
  const tracking = document.querySelector('#tracking');
  const target = document.querySelector('#ruletaTarget');
  const overlay = document.querySelector('#resourceOverlay');

  // Cuatro opciones de prueba. Solo "maria" activa el recurso AR.
  const options = [
    { id: 'maria', label: 'María de Jesús', resource: true },
    { id: 'reto', label: 'Reto', resource: false },
    { id: 'dato', label: 'Dato', resource: false },
    { id: 'pregunta', label: 'Pregunta', resource: false }
  ];

  let currentRotation = 0;
  let isSpinning = false;
  let targetVisible = false;
  let resourceArmed = false;

  function setOverlayVisibility() {
    // A-Frame solo podrá renderizarlo realmente cuando el target esté siendo rastreado.
    overlay.setAttribute('visible', resourceArmed);
  }

  target.addEventListener('targetFound', () => {
    targetVisible = true;
    tracking.textContent = '✓ Imagen reconocida';
    tracking.classList.add('found');
    if (resourceArmed) {
      result.textContent = '¡Ahí está! El recurso de María está superpuesto sobre la imagen.';
    }
  });

  target.addEventListener('targetLost', () => {
    targetVisible = false;
    tracking.textContent = 'Imagen fuera de cuadro. Vuelve a apuntar a ella.';
    tracking.classList.remove('found');
  });

  spinButton.addEventListener('click', () => {
    if (isSpinning) return;
    isSpinning = true;
    spinButton.disabled = true;
    resourceArmed = false;
    setOverlayVisibility();
    result.textContent = 'Girando…';

    // Resultado realmente aleatorio.
    const winnerIndex = Math.floor(Math.random() * options.length);
    const winner = options[winnerIndex];

    // Cada sector mide 90°. Queremos que el centro del sector ganador llegue al puntero superior.
    const sectorCenter = winnerIndex * 90 + 45;
    const extraTurns = 5 * 360;
    const normalized = ((currentRotation % 360) + 360) % 360;
    const targetAngle = (360 - sectorCenter) % 360;
    const delta = (targetAngle - normalized + 360) % 360;
    currentRotation += extraTurns + delta;
    wheel.style.transform = `rotate(${currentRotation}deg)`;

    window.setTimeout(() => {
      isSpinning = false;
      spinButton.disabled = false;

      if (winner.resource) {
        resourceArmed = true;
        setOverlayVisibility();
        result.textContent = targetVisible
          ? '¡Salió María de Jesús! El recurso ya aparece sobre la imagen.'
          : '¡Salió María de Jesús! Ahora apunta a la imagen mapeada para ver el recurso en AR.';
      } else {
        result.textContent = `Salió “${winner.label}”. En este test esa opción no muestra recurso.`;
      }
    }, 3300);
  });

  resetButton.addEventListener('click', () => {
    resourceArmed = false;
    setOverlayVisibility();
    result.textContent = 'Prueba reiniciada. Gira la ruleta otra vez.';
  });
})();
