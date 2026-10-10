# Happy Paws Care Central

Plataforma interna para digitalizar la operación de Happy Paws Veterinary Clinic. Los slices operativos actuales cubren propietarios, mascotas, citas, vacunaciones, autenticación/RBAC y el portal seguro del propietario.

## Módulos operativos

- `supabase/migrations/20260909000000_create_happy_paws_schema.sql`: esquema inicial completo, relaciones, índices, datos base y políticas RLS.
- `back/`: API Express con CRUD de propietarios (`/api/v1/owners`), mascotas (`/api/v1/pets`), citas (`/api/v1/appointments`) y vacunaciones.
- `front/`: dashboard Next.js con propietarios en `/owners`, mascotas en `/pets`, citas en `/appointments` y vacunaciones.
- Propietarios y mascotas usan eliminación lógica para conservar historial clínico. Las citas `SCHEDULED` se marcan automáticamente como `MISSED` cuando su fecha ya pasó; `CANCELLED` queda reservado para cancelaciones explícitas.

## Desarrollo local

El repositorio no tiene un `package.json` raíz: `back` y `front` son aplicaciones independientes y sus comandos se ejecutan dentro de cada carpeta.

Configura los archivos de entorno separados: `back/.env` para la API y `front/.env.local` para Next.js. No pongas la `service_role` key en el frontend.

`back/.env`:

```env
SUPABASE_URL=https://cuaqjycqzyfjdpilklkl.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key-secreta>
PORT=4000
```

`front/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://cuaqjycqzyfjdpilklkl.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_mIeOi-mhowQg8kfUgX-YJw_X4q9wtx4
NEXT_PUBLIC_API_URL=http://localhost:4000
```

La publishable key puede exponerse en el navegador; la `service_role` key es secreta y solo debe existir en `back/.env` o en la configuración segura del servidor.

Ejecuta la migración en el proyecto Supabase y levanta cada aplicación en una terminal:

```bash
cd back
npm install
npm run dev
```

```bash
cd front
npm install
npm run dev
```

El frontend usa datos de demostración si `NEXT_PUBLIC_API_URL` no está definida. Para conectar la API, define `NEXT_PUBLIC_API_URL=http://localhost:4000` en `front/.env.local`.

## Docker

Supabase sigue siendo un servicio remoto: Docker solo ejecuta `back` y `front`.
Prepara las variables de entorno una vez:

```bash
Copy-Item .env.example .env
Copy-Item back/.env.example back/.env
```
o en mac 
```bash
cp .env.example .env
cp back/.env.example back/.env
```

Completa `back/.env` con la `SUPABASE_SERVICE_ROLE_KEY` y `.env` con las variables públicas del frontend. Después levanta el stack desde la raíz:

```bash
docker compose up --build
```

La API queda en `http://localhost:4000` y el frontend en `http://localhost:3000`. El servicio `back` incluye un healthcheck contra `/health`; `front` espera a que esté saludable. No se expone ninguna clave `service_role` al frontend.

Para detenerlo:

```bash
docker compose down
```

El desarrollo sin Docker continúa usando `npm run dev` dentro de `back` y `front`, con sus respectivos archivos de entorno.

## Formato y arquitectura

Ambas aplicaciones usan Prettier con una configuración local para que el mismo chequeo funcione fuera y dentro de Docker:

```bash
(cd back && npm run format)
(cd front && npm run format)
```

Para validar sin modificar archivos, ejecuta `npm run format:check` dentro de cada aplicación. El build de cada Dockerfile también ejecuta ese chequeo antes de compilar.

La arquitectura actual está implementada por slices: Next.js consume la API Express, Express separa rutas, controladores, servicios y tipos, y Supabase es la única fuente de datos. Las escrituras pasan por la API protegida con Supabase Auth y RBAC; las tablas mantienen RLS como segunda barrera. Recepción gestiona propietarios, mascotas y citas; administración puede desactivar propietarios y mascotas; veterinaria puede consultar y editar datos básicos de mascotas. Tampoco hay un `package.json` raíz ni una instancia local de PostgreSQL.

Las rutas de vacunaciones requieren `Authorization: Bearer <supabase-access-token>`.

Para cargar datos simulados directamente en Supabase, después de aplicar las migraciones y crear al menos cuatro mascotas:

```bash
cd back
npm run seed:vaccinations
```

## Validación

```bash
(cd back && npm test && npm run build)
(cd front && npm test && npm run build)
```
