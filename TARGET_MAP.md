# Mapa de targets de MindAR

`targets/targets.mind` contiene seis imágenes. MindAR no usa el nombre del JPG para reconocer cada una: usa su posición dentro del archivo compilado, comenzando en cero.

| Orden al compilar | targetIndex | data-person-id | Overlay |
|---:|---:|---|---|
| 1 | 0 | titulo | Sin overlay por ahora |
| 2 | 1 | denisse | `assets/images/denisse.png` |
| 3 | 2 | esther | `assets/images/esther-06.png` |
| 4 | 3 | rubi | `assets/images/rubí.png` |
| 5 | 4 | maria | `assets/images/maria.png` |
| 6 | 5 | patricia | `assets/images/patricia.png` |
| 7 | 6 | monica | `assets/images/monica.png` |

La relación se declara en `index.html` así:

```html
<a-entity mindar-image-target="targetIndex: 1" data-person-id="esther">
  <a-image src="#overlay-esther"></a-image>
</a-entity>
```

`data-person-id` debe coincidir exactamente con el campo `id` de `data/people.json`. Si vuelves a compilar las imágenes en otro orden, actualiza los `targetIndex` de `index.html` y de `people.json`.
