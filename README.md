# Historias que Inspiran — MindAR MVP

Este paquete contiene la primera prueba técnica para convertir el mural en una experiencia WebAR.

## Targets candidatos

Se prepararon 6 recortes a partir de la imagen original:

El archivo actual contiene siete targets: `targetIndex: 0` corresponde a las letras del título; después siguen Denisse (`1`), Esther (`2`), Rubí (`3`), María (`4`), Patricia (`5`) y Mónica (`6`). Consulta `TARGET_MAP.md` para ver la relación completa.

El archivo `targets-contact-sheet.jpg` permite revisar rápidamente los recortes.

## Paso 1 — Compilar los targets

Usa el compilador oficial de MindAR:

https://hiukim.github.io/mind-ar-js-doc/tools/compile/

Sube los 6 JPG en ese orden y pulsa **Start**.

Al terminar, descarga `targets.mind` y colócalo en `targets/targets.mind`.

El orden de subida es importante porque determina los `targetIndex` que usará la aplicación. Cada entidad de `index.html` enlaza ese índice con una persona mediante `data-person-id`.

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
