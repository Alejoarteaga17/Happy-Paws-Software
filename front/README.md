# Happy Paws Frontend

Aplicación Next.js para el panel operativo de la clínica. La ruta principal (`/`) muestra el resumen de la clínica con estadísticas, agenda de hoy y cuidados pendientes. `/vaccinations` contiene el módulo completo de vacunaciones, `/pets` permite consultar y registrar mascotas, y `/appointments` permite consultar, crear, modificar y cancelar citas veterinarias.

La pantalla `/pets` consume `GET/POST /api/v1/pets`, envía el token de sesión de Supabase y usa `ownerId` para vincular cada mascota con un propietario existente.

## Desarrollo

```bash
npm install
npm run dev
```

El resumen y los módulos consultan el backend, que a su vez consulta Supabase. Para conectarlos y autenticar las peticiones:

```env
NEXT_PUBLIC_SUPABASE_URL=https://cuaqjycqzyfjdpilklkl.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_mIeOi-mhowQg8kfUgX-YJw_X4q9wtx4
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Estas variables son públicas por diseño. Nunca coloques aquí `SUPABASE_SERVICE_ROLE_KEY`.

La ruta `/login` usa el inicio de sesión de Supabase con correo y contraseña. Crea el usuario desde **Authentication > Users** y asígnale el rol `VET` en `public.profiles` para permitir el registro de vacunas:

```sql
update public.profiles
set role = 'VET'
where email = 'vet@happypaws.com';
```

El token de la sesión se envía automáticamente al backend en la cabecera `Authorization: Bearer ...`.

La pantalla de citas consume el backend mediante JSON en `/api/v1/appointments` y envía el token de sesión en la cabecera `Authorization`.

El resumen usa `createdAt` de las mascotas para calcular las registradas durante el mes actual. Las tarjetas y listas muestran estados vacíos y carga mientras esperan los tres endpoints.

## Pruebas

```bash
npm test
npm run build
```

## Docker

El frontend usa una imagen Next.js standalone multi-stage. Las variables `NEXT_PUBLIC_*` se inyectan durante el build desde el `.env` de la raíz, porque Next las incorpora al bundle del navegador:

```bash
docker compose build front
docker compose up front
```

`NEXT_PUBLIC_API_URL` debe ser `http://localhost:4000` cuando el navegador accede al stack publicado por Docker. No coloques `SUPABASE_SERVICE_ROLE_KEY` en este archivo ni en la imagen del frontend.