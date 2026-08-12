# Historias que Inspiran — MindAR MVP

Este paquete contiene la primera prueba técnica para convertir el mural en una experiencia WebAR.

## Targets candidatos

Se prepararon 6 recortes a partir de la imagen original:

1. `targets/01-denisse.jpg`
2. `targets/02-esther.jpg`
3. `targets/03-rubi.jpg`
4. `targets/04-maria.jpg`
5. `targets/05-patricia.jpg`
6. `targets/06-monica.jpg`

El archivo `targets-contact-sheet.jpg` permite revisar rápidamente los recortes.

## Paso 1 — Compilar los targets

Usa el compilador oficial de MindAR:

https://hiukim.github.io/mind-ar-js-doc/tools/compile/

Sube los 6 JPG en ese orden y pulsa **Start**.

Al terminar, descarga `targets.mind` y colócalo en la raíz de este proyecto, junto a `index.html`.

El orden de subida es importante porque determina los `targetIndex` que usará la aplicación.

## Paso 2 — Probar localmente

La cámara requiere un contexto seguro. No abras `index.html` directamente.

Con Python:

```bash
python -m http.server 8000
```

Luego abre:

http://localhost:8000

También puedes usar cualquier servidor local equivalente.

## Paso 3 — GitHub Pages

Cuando la prueba local funcione:

- sube el contenido del proyecto a un repositorio;
- activa GitHub Pages;
- asegúrate de que el sitio se sirva por HTTPS;
- prueba desde un teléfono.

## Primer objetivo

NO buscamos todavía una experiencia completa.

Solo queremos comprobar:

> ¿El teléfono reconoce de manera estable la imagen de Denisse y coloca el indicador AR encima?

Después probaremos las otras cinco.

## Nota

Los recortes son candidatos iniciales, no targets definitivos. Si alguno presenta pocos puntos o tracking inestable en el compilador de MindAR, ajustaremos su encuadre.
