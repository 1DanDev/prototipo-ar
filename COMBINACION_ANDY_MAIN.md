# Combinación de la rama de Andy con la interfaz de main

Esta versión usa como base la interfaz más reciente de **Historias que Inspiran**
y conserva las mejoras funcionales de Andy sin ejecutar dos sistemas de eventos
al mismo tiempo.

## Cambios de Andy conservados

- `missTolerance: 30` para tolerar pérdidas breves del target.
- Confirmación de 250 ms antes de aceptar el rostro detectado.
- Imagen de la científica mostrada como HTML fijo, en lugar de un `<a-image>`
  que cambia de posición con cada fotograma del tracking.
- La historia permanece visible después de `targetLost`.
- Botón X para cerrar, desbloquear y permitir un nuevo escaneo.
- Ocultamiento del botón VR residual de A-Frame.

## Interfaz de main conservada

- Tutorial inicial y botón “Comenzar a Escanear”.
- Mensaje “Apunta al cartel o a un rostro” y marco de escaneo.
- Botón “Abrir Fanzine Interactivo” para el target del cartel.
- Tarjeta con nombre, frase, audio, “Saber más” y “Escanear otra historia”.
- `fanzine.html`, su CSS, JavaScript y páginas provisionales.
- Página individual `historia.html`.

## Archivos principales modificados

- `index.html`: une la UI, la imagen fija y los siete targets.
- `css/styles.css`: posición estable para celular y tableta.
- `js/app.js`: controla todos los estados y utiliza un solo bloqueo.
- `js/ar.js`: es el único puente entre MindAR y la interfaz.

## Prueba recomendada

1. Abrir el proyecto desde HTTPS.
2. Pulsar “Comenzar a Escanear”.
3. Escanear una científica.
4. Alejar la cámara: la imagen y la tarjeta deben permanecer.
5. Pulsar X o “Escanear otra historia”.
6. Escanear una científica diferente y confirmar que cambian imagen y texto.
7. Escanear el cartel completo y comprobar el modelo 3D y el botón del fanzine.
