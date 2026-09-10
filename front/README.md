# Happy Paws Frontend

Aplicación Next.js para el panel operativo de la clínica. La ruta principal muestra el dashboard de vacunaciones, con indicadores para dosis próximas y vencidas. La ruta `/appointments` permite consultar, crear, modificar y cancelar citas veterinarias.

## Desarrollo

```bash
npm install
npm run dev
```

El dashboard consulta el backend, que a su vez consulta Supabase. Para conectarlo y autenticar las peticiones:

```env
NEXT_PUBLIC_SUPABASE_URL=https://cuaqjycqzyfjdpilklkl.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_mIeOi-mhowQg8kfUgX-YJw_X4q9wtx4
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Estas variables son públicas por diseño. Nunca coloques aquí `SUPABASE_SERVICE_ROLE_KEY`.

La pantalla de citas consume el backend mediante JSON en `/api/v1/appointments` y envía el token de sesión en la cabecera `Authorization`.

## Pruebas

```bash
npm test
npm run build
```