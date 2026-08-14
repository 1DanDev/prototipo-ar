# Test de ruleta + Realidad Aumentada

Archivo de entrada:

`dev/tests/ruleta-test.html`

## Flujo

1. La cámara usa `targets/ruleta.mind` y rastrea `targetIndex: 0`.
2. El usuario pulsa **Girar ruleta**.
3. La ruleta elige aleatoriamente una de 4 opciones.
4. Si sale **María de Jesús**, se activa `assets/images/recurso-maria.png`.
5. Cuando la cámara reconoce la imagen incluida en `ruleta.mind`, el recurso se superpone en AR.
6. Las otras opciones no muestran un recurso: sirven para comprobar la lógica condicional.

## Archivos añadidos

- `targets/ruleta.mind`
- `assets/images/recurso-maria.png`
- `dev/tests/ruleta-test.html`
- `dev/tests/ruleta-test.css`
- `dev/tests/ruleta-test.js`

El proyecto principal (`index.html`) no fue modificado para no romper la versión estable.
