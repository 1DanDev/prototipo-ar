# Configuración de la interfaz AR

La detección conserva este mapeo:

- `targetIndex: 0` → cartel completo → botón del fanzine.
- `targetIndex: 1–6` → científicas → tarjeta de historia.

## Antes de publicar

1. El botón del cartel ya abre el fanzine de Flipsnack proporcionado.
2. Cada `learnMoreUrl` abre `historia.html?id=...`, una página estática reutilizable.
3. Completa las frases, historias y rutas de audio que todavía estén vacías.

La página `historia.html` toma automáticamente el nombre, imagen, frase y audio de
`data/people.json`. Si agregas un campo `story` a una científica, también sustituirá
automáticamente el texto general por su historia completa.

## Probar nuevamente el tutorial

El tutorial se guarda únicamente durante la sesión de la pestaña mediante `sessionStorage`.
Para verlo otra vez sin cerrar la pestaña, abre la consola del navegador y ejecuta:

```js
sessionStorage.removeItem("tutorialVisto");
location.reload();
```

## Archivos de UI modificados

- `index.html`: estructura de los cuatro estados.
- `css/styles.css`: diseño mobile-first superpuesto a la cámara.
- `js/app.js`: máquina de estados, tutorial, Pin y eventos de targets.
- `js/audio.js`: reproducción/pausa y actualización visual del botón.
- `js/ar.js`: conexión directa de `targetFound` y `targetLost` con la UI.
- `data/people.json`: campo `learnMoreUrl` para cada científica.
- `historia.html`, `css/historia.css` y `js/historia.js`: página estática de cada historia.

Las rutas CSS y JS incluyen `?v=3.0.0` para evitar que GitHub Pages o el teléfono
continúen mostrando archivos antiguos guardados en caché.
