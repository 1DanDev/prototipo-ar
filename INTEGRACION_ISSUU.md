# Integración con Issuu

La edición completa utilizada por el proyecto es:

`https://issuu.com/docs/2584ca44876396879566fdd917ddff89?fr=sYzUyNDkzMDg4NzE`

## Enlace para la página “Escribe el tuyo”

En Issuu, convierte la zona interactiva de esa página en un enlace hacia:

`https://TU-USUARIO.github.io/TU-REPOSITORIO/collage.html`

Sustituye `TU-USUARIO` y `TU-REPOSITORIO` por los valores reales de GitHub Pages. Comprueba el enlace desde un teléfono después de publicar esta versión.

## Alcance actual de las frases

`collage.html` guarda las aportaciones con `localStorage`. Cada frase aparece inmediatamente y permanece al volver a abrir la página en el mismo dispositivo, incluso sin conexión después de completar la descarga de la PWA.

Para crear un mural comunitario compartido entre todos los dispositivos será necesario conectar el formulario a una base de datos. La interfaz actual puede mantenerse y sustituir únicamente las funciones `readSavedPhrases()` y `savePhrases()` de `js/collage.js` por llamadas al servicio que se elija.
