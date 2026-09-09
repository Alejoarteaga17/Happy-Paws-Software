# Happy Paws Backend

API Express para el seguimiento de vacunaciones. Expone `GET` y `POST` en `/api/v1/vaccinations` y usa Supabase como fuente de datos.

## Variables de entorno

```env
SUPABASE_URL=https://cuaqjycqzyfjdpilklkl.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key-secreta>
PORT=4000
```

La clave `SUPABASE_SERVICE_ROLE_KEY` nunca debe enviarse al frontend ni commitearse.

## Comandos

```bash
npm install
npm test
npm run build
npm run seed:vaccinations
```

`npm run seed:vaccinations` consulta las primeras cuatro mascotas existentes y guarda cuatro vacunaciones simuladas directamente en Supabase. Es idempotente para esos registros: repetirlo no crea duplicados.