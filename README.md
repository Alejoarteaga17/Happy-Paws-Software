# Happy Paws Care Central

Plataforma interna para digitalizar la operación de Happy Paws Veterinary Clinic. El primer slice implementado cubre el registro y seguimiento de vacunaciones (RF-06).

## Vacunaciones

- `supabase/migrations/20260909000000_create_happy_paws_schema.sql`: esquema inicial completo, relaciones, índices, datos base y políticas RLS.
- `back/`: API Express con `GET` y `POST /api/v1/vaccinations`.
- `front/`: dashboard Next.js con próximas dosis, vencimientos, métricas y filtros.

## Desarrollo local

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

Las rutas de vacunaciones requieren `Authorization: Bearer <supabase-access-token>`.

Para cargar datos simulados directamente en Supabase, después de aplicar las migraciones y crear al menos cuatro mascotas:

```bash
cd back
npm run seed:vaccinations
```

## Validación

```bash
cd back && npm test && npm run build
cd front && npm run build
```
