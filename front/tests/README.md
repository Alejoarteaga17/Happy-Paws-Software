## Pruebas del frontend

La suite usa Vitest y cubre los servicios de mascotas, citas y vacunaciones, además de las pantallas de recuperación para rutas inexistentes y errores inesperados. Se mockean `fetch`, Supabase y `next/link`, por lo que no se necesitan servicios externos.

Desde `front/`:

```bash
npm test
npm test -- --run tests/error-pages.test.tsx
```

Las pruebas de `error-pages.test.tsx` renderizan las pantallas con `react-dom/server` y verifican sus mensajes y enlaces de recuperación.