# Política de manejo de datos sensibles

## Alcance

Esta política aplica a datos de propietarios, cuentas de usuario, mascotas, citas, vacunas, notas clínicas y registros de auditoría de Happy Paws Care Central.

## Reglas obligatorias

1. Las contraseñas y sesiones son responsabilidad de Supabase Auth. No se almacenan contraseñas ni `service_role` en el frontend.
2. `SUPABASE_SERVICE_ROLE_KEY` solo existe en el backend y nunca se registra, devuelve por API o incluye en imágenes públicas.
3. Las notas clínicas y vacunas se consultan mediante rutas autenticadas y permisos RBAC. OWNER tiene acceso de solo lectura.
4. OWNER solo puede consultar recursos relacionados con `owners.auth_user_id = auth.uid()`. El backend no acepta un `ownerId` del cliente para el portal.
5. Propietarios y mascotas se desactivan lógicamente para conservar historial. No se permite borrar físicamente un propietario con mascotas dependientes.
6. La auditoría registra actor, acción, entidad, identificador y metadatos mínimos. No se almacenan contraseñas, tokens ni contenido innecesario de notas clínicas.
7. Los datos usados en pruebas, staging y capturas deben ser sintéticos o anonimizados.
8. Los errores HTTP no deben revelar claves, tokens, consultas SQL ni detalles internos de Supabase.

## Roles de acceso

| Rol | Acceso |
|---|---|
| ADMIN | Gestión completa operativa, usuarios, auditoría y desactivación. |
| RECEPTIONIST | Propietarios, mascotas, citas, búsqueda y creación/edición de usuarios permitidos; no cambia roles, desactiva usuarios ni administra notas clínicas. |
| VET | Citas asignadas, notas clínicas propias, mascotas básicas y vacunaciones. |
| OWNER | Solo lectura de sus mascotas, citas, vacunas y notas clínicas autorizadas. |

## Verificación antes de producción

- Aplicar migraciones con `supabase db push`.
- Ejecutar pruebas RLS con dos propietarios distintos y los cuatro roles.
- Confirmar que no existen secretos en el bundle de `front`.
- Revisar logs de auditoría y eliminar datos de prueba antes de UAT.
