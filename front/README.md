# Happy Paws Frontend

Aplicación Next.js para el panel operativo de la clínica. La ruta principal muestra el dashboard de vacunaciones, con indicadores para dosis próximas y vencidas.

## Desarrollo

```bash
npm install
npm run dev
```

El dashboard usa datos de demostración si `NEXT_PUBLIC_API_URL` no está definida. Para conectarlo al backend y preparar el cliente Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://cuaqjycqzyfjdpilklkl.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_mIeOi-mhowQg8kfUgX-YJw_X4q9wtx4
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Estas variables son públicas por diseño. Nunca coloques aquí `SUPABASE_SERVICE_ROLE_KEY`.

## Pruebas

```bash
npm test
npm run build
```