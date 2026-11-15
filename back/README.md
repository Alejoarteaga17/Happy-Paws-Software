# Happy Paws Backend

API Express para la operación clínica. Usa Supabase como fuente de datos y separa rutas, controladores, servicios y acceso a datos.

## Autenticación y autorización

Todas las rutas de datos requieren `Authorization: Bearer <access-token>`. El backend valida el token con Supabase Auth, carga el rol desde `profiles` y, para cuentas `OWNER`, carga el propietario vinculado por `owners.auth_user_id`. Como el backend usa `service_role`, las comprobaciones de rol y recurso se realizan explícitamente antes de cada consulta.

Las lecturas de vacunaciones no son anónimas. `GET /api/v1/portal/me` es la única superficie de portal y devuelve exclusivamente los datos del propietario autenticado.

## Rutas

- Mascotas: `GET /api/v1/pets`, `POST /api/v1/pets` (consulta staff; creación ADMIN/RECEPTIONIST).
- Citas: CRUD en `/api/v1/appointments` (staff).
- Vacunaciones: `GET/POST /api/v1/vaccinations` (consulta staff; escritura ADMIN/VET).
- Propietarios: `GET/POST/PUT /api/v1/owners`, `PATCH /api/v1/owners/:id/status` (staff; escritura ADMIN/RECEPTIONIST; desactivación ADMIN).
- Portal OWNER: `GET /api/v1/portal/me`.
- Notas clínicas: `GET/POST /api/v1/clinical-notes`, `PUT /api/v1/clinical-notes/:id` (ADMIN/VET; el VET solo modifica citas asignadas).
- Búsqueda global: `GET /api/v1/search?q=...` (usuarios autorizados).
- Usuarios: `GET /api/v1/users`, `GET /api/v1/users/:id`, `POST /api/v1/users`, `PATCH /api/v1/users/:id`, `PATCH /api/v1/users/:id/role` (ADMIN/RECEPTIONIST; desactivación ADMIN).
- Auditoría: `GET /api/v1/audit` (ADMIN).
- Sesión: `GET /api/v1/auth/me`, `POST /api/v1/auth/audit-login`.

Las respuestas usan `{ success, data, error }`. Las mutaciones de mascotas, citas, vacunaciones, propietarios y perfiles registran actor, entidad y metadatos en `audit_logs`.

## Variables de entorno

```env
SUPABASE_URL=https://cuaqjycqzyfjdpilklkl.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key-secreta>
PORT=4000
ALLOW_ANONYMOUS_READS=false
```

`ALLOW_ANONYMOUS_READS` se conserva por compatibilidad, pero no habilita lecturas anónimas. La clave `SUPABASE_SERVICE_ROLE_KEY` nunca debe enviarse al frontend ni commitearse.

## Comandos

```bash
npm install
npm test
npm run build
npm run lint
npm run seed:vaccinations
npm run format
npm run format:check
```

Desde la raíz, `docker compose up --build back` compila y ejecuta la API.

## Calidad de código

ESLint usa `eslint-config-airbnb-base` como guía de nomenclatura y estilo, las reglas recomendadas para TypeScript y `eslint-config-prettier` para evitar conflictos con Prettier. `npm run lint` valida `src` y `tests`; `npm run lint:fix` aplica las correcciones automáticas disponibles. El Dockerfile ejecuta ESLint antes de compilar.
