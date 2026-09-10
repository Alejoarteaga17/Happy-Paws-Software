# 1. Plantilla: Nueva funcionalidad backend
## Tarea: [Nombre de la funcionalidad]

### Objetivo
Implementar [descripción breve del comportamiento esperado].

### Alcance
- [ ] Crear o modificar endpoint: `METHOD /api/v1/[recurso]`
- [ ] Actualizar servicio en `back/src/services/`
- [ ] Actualizar controlador y rutas
- [ ] Aplicar autenticación y RBAC
- [ ] Validar entradas y errores
- [ ] Añadir o actualizar pruebas en `back/tests/`
- [ ] Actualizar documentación de `back/README.md`

### Reglas de negocio
- [Regla 1]
- [Regla 2]
- [Regla 3]

### Respuestas esperadas
- `200/201`: operación exitosa
- `400`: datos inválidos
- `401`: usuario no autenticado
- `403`: rol insuficiente
- `404`: recurso inexistente

### Criterios de aceptación
- [ ] La funcionalidad cumple el flujo esperado.
- [ ] Los roles no autorizados reciben `403`.
- [ ] Los errores usan el formato estándar.
- [ ] Las pruebas pasan con `npm run test`.

# 2. Plantilla: Nueva pantalla o flujo frontend
## Tarea: [Nombre de la pantalla]

### Objetivo
Crear la pantalla de [descripción] para el rol [ADMIN/VET/RECEPTIONIST/OWNER].

### Ubicación
`front/src/app/[ruta]/page.tsx`

### Funcionalidades
- [ ] Mostrar [datos o métricas]
- [ ] Permitir [acción principal]
- [ ] Añadir estados de carga, vacío y error
- [ ] Consumir el servicio correspondiente
- [ ] Respetar permisos del usuario
- [ ] Mantener diseño visual del proyecto
- [ ] Adaptar la vista a móvil y escritorio

### Componentes o servicios afectados
- `[componente existente]`
- `[servicio existente]`
- `[tipo TypeScript]`

### Criterios de aceptación
- [ ] La ruta carga correctamente.
- [ ] Los datos se muestran con el formato esperado.
- [ ] Las acciones muestran confirmación o error.
- [ ] No se muestran datos de otros propietarios.
- [ ] La interfaz funciona sin errores de TypeScript.

# 3. Plantilla: Cambio de base de datos y seguridad
## Tarea: [Nombre de la migración]

### Objetivo
Modificar el esquema de Supabase para [descripción].

### Migración
Archivo: `supabase/migrations/[timestamp]_[nombre].sql`

### Cambios
- [ ] Crear o modificar tabla `[tabla]`
- [ ] Añadir columnas o restricciones
- [ ] Crear índices necesarios
- [ ] Definir claves foráneas
- [ ] Activar RLS
- [ ] Crear políticas para `ADMIN`
- [ ] Crear políticas para `VET`
- [ ] Crear políticas para `RECEPTIONIST`
- [ ] Crear políticas de solo lectura para `OWNER`
- [ ] Actualizar datos seed si corresponde

### Seguridad
- [ ] Los propietarios solo acceden a sus propias mascotas.
- [ ] Los propietarios no pueden modificar notas clínicas.
- [ ] Los propietarios no pueden modificar vacunas.
- [ ] Las operaciones administrativas requieren el rol adecuado.
- [ ] No se expone `SUPABASE_SERVICE_ROLE_KEY` al frontend.

### Verificación
- [ ] Ejecutar la migración con `supabase db push`.
- [ ] Probar acceso permitido.
- [ ] Probar acceso denegado.
- [ ] Ejecutar pruebas backend y frontend.
- [ ] Actualizar documentación afectada.
