# Guía de presentación sin conexión

El proyecto ahora funciona como PWA y guarda localmente la experiencia AR, el fanzine, los retratos, los audios, el modelo 3D y los siete targets.

## Preparar cada dispositivo

1. Conecta el teléfono o tableta a Internet.
2. Abre la URL publicada en GitHub Pages y espera el aviso **“Disponible sin conexión”**.
3. Acepta el permiso de cámara y completa una prueba de reconocimiento.
4. Abre el fanzine local y pasa todas las páginas una vez.
5. Instala la PWA desde **Agregar a pantalla de inicio** si el navegador ofrece esa opción.
6. Activa el modo avión, cierra la aplicación y vuelve a abrirla.
7. Comprueba la cámara, los siete targets, los audios, las historias y el fanzine.

## Durante la presentación

- Usa como opción principal los dispositivos preparados con anticipación.
- Conserva el QR para visitantes que sí tengan conexión.
- El enlace a Issuu requiere Internet; los artículos individuales y el mural de frases permanecen disponibles localmente.
- No borres los datos del navegador ni desinstales la PWA antes del evento.

## Prueba local

La cámara y el Service Worker requieren un origen seguro. Para desarrollo, `localhost` se considera seguro:

```bash
python -m http.server 8000
```

Abre `http://localhost:8000`, espera la descarga offline y verifica de nuevo con la red desactivada desde las herramientas del navegador. No abras los archivos con `file://`.
