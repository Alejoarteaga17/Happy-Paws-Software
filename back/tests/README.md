## Pruebas del backend

La suite cubre autenticación/RBAC, propietarios, mascotas, citas, notas clínicas, vacunaciones, búsqueda, portal, usuarios y auditoría. Las llamadas a Supabase se simulan para que las pruebas sean deterministas y no requieran credenciales.

Desde `back/`:

```bash
npm test
npm test -- --runInBand tests/appointment.service.test.ts tests/vaccination.service.test.ts
npm run test:coverage
```

Los tests verifican mapeo de filas y relaciones, creación y actualización de recursos, validaciones de errores, permisos por rol, asignación de veterinario, aislamiento del portal y cancelación de citas. La cobertura se usa como evidencia adicional; la certificación de staging y RLS requiere el entorno remoto.

Cobertura actual medida en Jest: 75.32 % de statements y 81.67 % de lines.