## Pruebas del backend

La suite cubre la lógica de estados de vacunación y los servicios principales de mascotas, citas y vacunaciones. Las llamadas a Supabase se simulan para que las pruebas sean deterministas y no requieran credenciales.

Desde `back/`:

```bash
npm test
npm test -- --runInBand tests/appointment.service.test.ts tests/vaccination.service.test.ts
```

Los tests verifican mapeo de filas, incluyendo relaciones `pets` devueltas como objeto o arreglo, creación de recursos, validaciones de errores, asignación automática de veterinario y cancelación de citas.