# Happy Paws Backend

API Express para el seguimiento de vacunaciones. Expone `GET` y `POST` en `/api/v1/vaccinations` y usa Supabase como fuente de datos.

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