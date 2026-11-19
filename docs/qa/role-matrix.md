# Matriz de validación por rol

La API es la autoridad para autorización; la visibilidad del frontend solo mejora la experiencia y no reemplaza `requireRoles` ni RLS.

| Capacidad | ADMIN | RECEPTIONIST | VET | OWNER |
|---|---:|---:|---:|---:|
| Resumen clínico | Sí | Sí | Sí | No |
| Portal propio | No | No | No | Sí |
| Propietarios: listar/crear/editar | Sí | Sí | No | No |
| Propietarios: eliminar | Sí | Sí | No | No |
| Propietarios: activar/desactivar | Sí | No | No | No |
| Mascotas: listar | Sí | Sí | Sí | No |
| Mascotas: crear/eliminar | Sí | Sí | No | No |
| Mascotas: editar datos básicos | Sí | Sí | Sí | No |
| Agenda: consultar | Sí | Sí | Sí | No |
| Agenda: crear/editar/cancelar | Sí | Sí | No | No |
| Vacunaciones: consultar | Sí | Sí | Sí | No |
| Vacunaciones: registrar | Sí | No | Sí | No |
| Notas clínicas: consultar | Sí | Sí | No | No |
| Notas clínicas: crear/editar | Sí | No | Sí | No |
| Usuarios: consultar/crear/editar | Sí | Sí | No | No |
| Usuarios: cambiar rol/desactivar | Sí | No | No | No |
| Búsqueda global | Sí | Sí | Sí | No |
| Auditoría | Sí | No | No | No |

## Evidencia requerida en staging

Para cada fila se debe ejecutar la solicitud autenticada con una sesión del rol indicado y registrar
el código HTTP y el resultado. Las operaciones no permitidas deben devolver `403`; una sesión ausente
debe devolver `401`. Para OWNER se deben usar dos cuentas vinculadas a propietarios distintos y
verificar que el portal de cada cuenta no devuelva mascotas, citas, vacunas o notas de la otra.
