# Happy Paws Care Central

Plataforma monorepo para digitalizar la operación de Happy Paws Veterinary Clinic.

## Stack

- `back`: Node.js, Express, TypeScript, Prisma y PostgreSQL.
- `front`: Next.js App Router, React, TypeScript y CSS responsive.

## Puesta en marcha

Requisitos: Node.js 20+ y PostgreSQL 15+.

```bash
cp back/.env.example back/.env
npm install --prefix back
npm install --prefix front
back/node_modules/.bin/prisma generate --schema back/prisma/schema.prisma
back/node_modules/.bin/prisma migrate dev --schema back/prisma/schema.prisma --name init
npm run db:seed --prefix back
```

Inicia cada aplicación en una terminal:

```bash
npm run dev --prefix back   # http://localhost:4000
npm run dev --prefix front  # http://localhost:3000
```

La API expone respuestas `{ success, data, error }` en `/api/v1`. El acceso se realiza con JWT; las notas clínicas solo pueden modificarse con rol `VET` o `ADMIN`, y las vacunas solo pueden crearse con esos roles. Las consultas del rol `OWNER` se filtran por su propietario relacionado.

Usuario administrador local:

- Correo: `admin@happypaws.com`
- Contraseña: `Admin123!`
- Rol: `ADMIN`

El usuario se crea o actualiza ejecutando `npm run db:seed --prefix back`.

## Comprobaciones

```bash
npm run build --prefix back
npm run build --prefix front
npm test --prefix back
npm test --prefix front
```
