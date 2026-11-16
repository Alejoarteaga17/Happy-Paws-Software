# Plan de staging, QA y UAT

## Preparación

1. Configurar un proyecto Supabase remoto de staging.
2. Ejecutar `supabase login`, `supabase link --project-ref <project-ref>` y `supabase db push` desde la raíz para aplicar las migraciones versionadas.
3. Crear usuarios de prueba ADMIN, RECEPTIONIST, VET y dos OWNER vinculados a propietarios distintos.
4. Cargar únicamente datos sintéticos.
5. Configurar `back/.env` y `front/.env.local` sin publicar secretos.

## Casos E2E mínimos

- Login válido, login inválido y logout.
- Restricción de rutas por rol.
- CRUD de propietario y mascota, incluyendo desactivación y relación `ownerId`.
- Búsqueda por nombre, teléfono, email, nombre de mascota y `pet_tag`.
- Creación y actualización de cita.
- Creación y actualización de nota clínica por veterinario asignado.
- Registro y consulta de vacunaciones.
- Portal OWNER con aislamiento entre los dos propietarios.
- Auditoría de login y operaciones críticas.
- Payload JSON sobredimensionado y claves `__proto__`, `constructor` o `prototype` rechazadas.
- Intento de RECEPTIONIST de cambiar roles rechazado con `403`.

## Evidencia requerida

Registrar fecha, commit, entorno, caso, resultado, duración y captura/log asociado. El criterio de M6 es una aprobación mínima del 95 % de los casos E2E. Medir también búsqueda por debajo de 2 segundos y consulta del portal por debajo de 3 segundos.

Para RF-03, ejecutar al menos 10 búsquedas sintéticas por nombre, teléfono y `pet_tag` en staging,
descartar la primera medición de calentamiento y registrar promedio, p95 y máximo. El criterio de
aceptación es que el p95 sea menor a 2 segundos. La migración de índices trigram debe estar aplicada
antes de medir.

## UAT

El cliente debe revisar los flujos principales, registrar observaciones y firmar la aceptación de M7. Los issues de GitHub no deben cerrarse como completados hasta que exista esta evidencia.
