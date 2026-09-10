## Pruebas del frontend

La suite verifica los servicios que conectan la interfaz con la API: mascotas, citas y vacunaciones. Se mockean `fetch` y la sesión de Supabase, por lo que no se necesitan servicios externos para ejecutarla.

Desde `front/`:

```bash
npm test
```

Se cubren autenticación, construcción de URLs, payloads de creación y actualización, cancelación de citas y traducción de errores para el usuario.
# Pruebas del frontend

Esta carpeta queda reservada para pruebas de componentes y flujos del dashboard con Vitest y React Testing Library.

Ejecutar con `npm test` desde `front/`.