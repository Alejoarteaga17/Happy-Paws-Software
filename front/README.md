# Happy Paws Frontend

Aplicación Next.js para el panel operativo de la clínica. La ruta principal (`/`) muestra el resumen de la clínica con estadísticas, agenda de hoy y cuidados pendientes. `/vaccinations` contiene el módulo completo de vacunaciones, `/pets` permite consultar y registrar mascotas, y `/appointments` permite consultar, crear, modificar y cancelar citas veterinarias.

La pantalla `/pets` consume `GET/POST /api/v1/pets`, envía el token de sesión de Supabase y usa `ownerId` para vincular cada mascota con un propietario existente. El frontend también incluye `/portal` para OWNER, `/owners` para el directorio operativo, `/users` y `/audit` para ADMIN.

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

## Design system de Figma

La referencia visual del frontend está documentada en [docs/frontend/figma-design-system.md](../docs/frontend/figma-design-system.md). Incluye los tokens, tipografías, componentes, pantallas de referencia y convenciones de reutilización extraídas del archivo [Happy Paws en Figma](https://www.figma.com/design/KqHYFT8b9p6uMC9cg7jPHw/Happy-Paws?node-id=0-1&m=dev).

La skill del proyecto para implementar nuevas vistas siguiendo este sistema está en `.github/skills/happy-paws-figma-design-system/SKILL.md`.

El resumen usa `createdAt` de las mascotas para calcular las registradas durante el mes actual. Las tarjetas y listas muestran estados vacíos y carga mientras esperan los tres endpoints.

## Pruebas

```bash
npm test
npm run build
npm run lint
npm run format
npm run format:check
```

## Docker

El frontend usa una imagen Next.js standalone multi-stage. Las variables `NEXT_PUBLIC_*` se inyectan durante el build desde el `.env` de la raíz, porque Next las incorpora al bundle del navegador:

```bash
docker compose build front
docker compose up front
```

`NEXT_PUBLIC_API_URL` debe ser `http://localhost:4000` cuando el navegador accede al stack publicado por Docker. No coloques `SUPABASE_SERVICE_ROLE_KEY` en este archivo ni en la imagen del frontend.

## Formato

Prettier está instalado como dependencia de desarrollo y usa `.prettierrc.json`. `npm run format` formatea `src`, `tests` y archivos de configuración; `npm run format:check` valida sin modificar archivos. El Dockerfile ejecuta `format:check` antes de `next build`.

ESLint usa las reglas recomendadas de Next.js mediante `next/core-web-vitals`. `npm run lint` valida el código y `npm run lint:fix` aplica las correcciones automáticas disponibles. El Dockerfile ejecuta ESLint antes del build.

## Estado de arquitectura

El frontend actual usa Next.js App Router, servicios de acceso a la API y componentes reutilizables para el dashboard, mascotas, citas y vacunaciones. `AuthProvider` carga el perfil de Supabase y centraliza los permisos de `OWNER`, `RECEPTIONIST`, `VET` y `ADMIN`; `AppHeader` y las acciones de cada módulo se filtran con ese contexto. La autorización definitiva continúa en el backend y las políticas RLS.