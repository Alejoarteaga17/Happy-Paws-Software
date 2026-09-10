# Happy Paws Backend

API Express para la operación clínica. Expone mascotas en `/api/v1/pets`, vacunaciones en `/api/v1/vaccinations` y gestión de citas en `/api/v1/appointments`, usando Supabase como fuente de datos.

## Mascotas

Todas las rutas requieren `Authorization: Bearer <supabase-access-token>`:

- `GET /api/v1/pets`: lista mascotas con el nombre del propietario y `createdAt` para los indicadores temporales del resumen.
- `POST /api/v1/pets`: crea una mascota con `ownerId`, `petTag`, `name`, `species` y los campos opcionales `breed`, `birthDate` y `weight`.

`ownerId` debe existir en `public.owners`; `petTag` es único y las relaciones se validan en Supabase.
La consulta requiere rol `ADMIN`, `VET` o `RECEPTIONIST`; la creación requiere `ADMIN` o `RECEPTIONIST`. Esto es necesario porque el backend usa la clave `service_role`, que no aplica RLS automáticamente.

## Citas veterinarias

Todas las rutas requieren `Authorization: Bearer <supabase-access-token>`:

- `GET /api/v1/appointments`: consulta la agenda ordenada por fecha.
- `GET /api/v1/appointments/:id`: consulta una cita.
- `POST /api/v1/appointments`: crea una cita con `petId`, `scheduledAt` y `reason`.
- `PUT /api/v1/appointments/:id`: modifica mascota, fecha/hora, motivo, veterinario o estado.
- `PATCH /api/v1/appointments/:id/cancel`: cambia el estado a `CANCELLED`.

Las respuestas usan `{ success, data, error }`. La tabla `appointments` y sus políticas RLS están definidas en la migración de Supabase existente.

## Variables de entorno

```env
SUPABASE_URL=https://cuaqjycqzyfjdpilklkl.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key-secreta>
PORT=4000
ALLOW_ANONYMOUS_READS=true
```

La clave `SUPABASE_SERVICE_ROLE_KEY` nunca debe enviarse al frontend ni commitearse.
Mientras se implementa el login, `ALLOW_ANONYMOUS_READS=true` permite consultar el dashboard de vacunaciones sin sesión. Solo aplica a `GET /api/v1/vaccinations`; los `POST` siguen requiriendo un token de Supabase. Cambia este valor a `false` o elimínalo cuando el login esté listo.

## Comandos

```bash
npm install
npm test
npm run build
npm run seed:vaccinations
```

`npm run seed:vaccinations` consulta las primeras cuatro mascotas existentes y guarda cuatro vacunaciones simuladas directamente en Supabase. Es idempotente para esos registros: repetirlo no crea duplicados.

## Docker

Desde la raíz del repositorio, copia `back/.env.example` a `back/.env` y completa la clave secreta. El servicio se construye y ejecuta junto con el frontend mediante:

```bash
docker compose up --build back
```

La imagen compila TypeScript en una etapa de build y ejecuta `dist/app.js` con dependencias de producción. Supabase no se levanta localmente.