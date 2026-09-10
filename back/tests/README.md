## Pruebas del backend

La suite cubre la lógica de estados de vacunación y los servicios principales de mascotas, citas y vacunaciones. Las llamadas a Supabase se simulan para que las pruebas sean deterministas y no requieran credenciales.

Desde `back/`:

```bash
npm test
```

Los tests verifican mapeo de filas, creación de recursos, validaciones de errores, asignación automática de veterinario y cancelación de citas.
# Pruebas del backend

Las pruebas cubren la clasificación de fechas de vacunación: una fecha anterior al día actual queda como `OVERDUE` y la fecha actual o futura como `PENDING`.

Ejecutar con `npm test` desde `back/`.