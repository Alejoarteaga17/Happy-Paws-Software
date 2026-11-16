## Pruebas del frontend

La suite usa Vitest y cubre los servicios de propietarios, mascotas, citas, notas clínicas, usuarios, búsqueda, portal y vacunación, además de componentes y pantallas de recuperación. Se mockean `fetch`, Supabase y `next/link`, por lo que no se necesitan servicios externos.

Desde `front/`:

```bash
npm test
npm test -- --run tests/error-pages.test.tsx
npm run test:coverage
```

Las pruebas de `error-pages.test.tsx` renderizan las pantallas con `react-dom/server` y verifican sus mensajes y enlaces de recuperación. La cobertura local no sustituye los casos E2E de staging.