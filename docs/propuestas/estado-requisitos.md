# Estado de requisitos y milestones

## Criterio de estado

- **Completo local:** existe implementación y evidencia en código/pruebas del repositorio.
- **Parcial:** existe una implementación relevante, pero falta un criterio funcional o una evidencia requerida.
- **Pendiente externo:** depende de Supabase remoto, staging, medición de rendimiento o aprobación UAT.

Los issues de GitHub relacionados continúan abiertos; esta matriz registra el estado técnico verificable del repositorio al 18 de noviembre de 2026 y no sustituye el cierre formal de esos issues.

## Requisitos funcionales

| RF | Issue(s) | Estado | Evidencia o pendiente |
|---|---:|---|---|
| RF-01 Propietarios | #11–#13 | Completo local | CRUD, validaciones, desactivación lógica y actualización automática de `updated_at` implementados. Falta aplicar la migración y obtener evidencia de aceptación en staging. |
| RF-02 Mascotas | #14–#16 | Completo local | CRUD, desactivación, relación con propietarios activos, `sex` (`MALE`/`FEMALE`/`UNKNOWN`) y actualización automática de `updated_at` implementados. Falta aplicar la migración y validar RLS remotamente. |
| RF-03 Búsqueda | #17 | Parcial | Búsqueda por propietario, teléfono, email, mascota y `pet_tag` con UI y pruebas. Falta medir y demostrar el SLA de menos de 2 segundos. |
| RF-04 Citas | #18–#19 | Completo local | Entidad, CRUD, estados, asignación de mascota y pruebas automatizadas. |
| RF-05 Notas clínicas | #20 | Completo local | Entidad, creación, actualización, asociación a cita/veterinario, UI y pruebas. |
| RF-06 Vacunaciones | #21–#22 | Completo local | Entidad, estados `PENDING`/`OVERDUE`/`ADMINISTERED`, dashboard, UI y pruebas. |
| RF-07 RBAC | #23–#24 | Parcial | Roles, matriz de rutas/acciones y restricciones de API/UI implementados; existen pruebas locales automatizadas. Falta ejecutar la matriz RLS remota con los cuatro roles. |
| RF-08 Autenticación | #25 | Completo local | Supabase Auth, sesión, logout, middleware JWT y auditoría de login implementados. Falta prueba de despliegue. |
| RF-09 Portal OWNER | #26–#27 | Parcial | Portal autenticado con mascotas, citas, vacunas y notas clínicas autorizadas. Falta evidencia remota de aislamiento entre propietarios. |
| RF-10 Historial clínico OWNER | #28 | Parcial | Portal consulta notas clínicas asociadas a las citas del propietario. Falta validar RLS y orden/criterios de autorización en Supabase remoto. |
| RF-11 Vacunaciones OWNER | #29 | Parcial | Portal muestra aplicadas, próximas y vencidas. Falta validación remota de aislamiento y rendimiento de consulta. |
| RF-12 Dashboard | #30 | Parcial | Dashboard operativo y portal OWNER existen; la visibilidad por rol está documentada en `docs/qa/role-matrix.md` y se corrigieron rutas inconsistentes. Falta ejecutar la validación formal por rol en staging. |
| RF-13 Auditoría | #31 | Parcial | Auditoría de CRUD, permisos y login implementada. Falta ejecutar y probar exhaustivamente todos los eventos críticos en el entorno remoto. |
| RF-14 Usuarios internos | #32–#33 | Completo local | Crear, consultar y editar para ADMIN/RECEPTIONIST; asignación de roles; solo ADMIN desactiva; formulario y tabla reutilizables. |
| RF-15 Cuentas OWNER | #34–#35 | Parcial | Creación/asociación de cuentas y portal aislado implementados. Falta prueba RLS/aislamiento entre dos propietarios y aceptación formal. |

## Milestones

| Milestone | Estado | Evidencia o pendiente |
|---|---|---|
| M1 Arquitectura y configuración | Completo local | Stack real documentado: Express/TypeScript, Next.js/React, Supabase remoto y Docker para apps. |
| M2 Propietarios, mascotas y búsqueda | Parcial | CRUD y metadatos implementados; falta aplicar las migraciones en staging y medir el SLA de búsqueda. |
| M3 Registro de consultas clínicas | Completo local | Notas clínicas vinculadas a citas y veterinario, con actualización y consulta OWNER autorizada. |
| M4 Seguimiento de vacunaciones | Completo local | Registro, estados e indicadores visuales implementados y probados. |
| M5 Portal OWNER y RBAC | Parcial | Flujos implementados; falta certificación RLS y matriz de acceso ejecutada contra Supabase remoto. |
| M6 Staging y QA | Pendiente externo | Falta URL de staging, ejecución E2E y evidencia de aprobación igual o superior al 95 %. |
| M7 Entrega final | Pendiente externo | Falta UAT, aprobación formal del cliente, acta de aceptación y evidencia final de despliegue. |

## Documentación completada

- Política de datos sensibles: [`docs/sensitive-data-policy.md`](../sensitive-data-policy.md).
- Procedimiento de staging, E2E y UAT: [`docs/qa/staging-uat.md`](../qa/staging-uat.md).
- READMEs de raíz, backend, frontend y suites de pruebas actualizados.

## Pendientes de solución y aceptación

1. Ejecutar los casos E2E definidos para login, RBAC, portal OWNER, búsqueda, citas, notas clínicas y vacunaciones.
2. Registrar una medición de búsqueda menor a 2 segundos y consulta del portal menor a 3 segundos en staging.
3. Ejecutar una matriz de aislamiento con dos propietarios y los roles ADMIN, VET, RECEPTIONIST y OWNER.
4. Completar UAT y registrar aprobación formal.
5. Aplicar las migraciones de `sex` y `updated_at` en staging antes de cerrar formalmente RF-01/RF-02.
6. Alcanzar al menos 90 % de cobertura en el código crítico backend/frontend. Backend mide 69.27 % global y frontend 13.07 % global; los servicios frontend alcanzan 86.29 % y requieren ampliar pruebas de pantallas/contexto.

## Validación local ejecutada

En el repositorio pasan actualmente:

- Backend: 64 pruebas y build TypeScript; ESLint, Prettier y audit de producción sin vulnerabilidades.
- Frontend: 28 pruebas y build Next.js; ESLint y Prettier sin warnings ni errores; audit de producción sin vulnerabilidades.
- Playwright: 2 casos RBAC descubiertos; su ejecución requiere navegador instalado, URL de staging y credenciales sintéticas.

La cobertura no cumple todavía el objetivo documental de 90 % para código crítico. Los warnings existentes de fuentes y `console` no bloquean la validación, pero deben limpiarse antes de la entrega final si el criterio de calidad exige cero warnings.
