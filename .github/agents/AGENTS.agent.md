# PROMPT PARA AGENTE DE CÓDIGO - PROYECTO HAPPY PAWS CARE CENTRAL

> **Instrucciones para la IA / Agente de Desarrollo:** Lee detenidamente todas las secciones de este documento antes de generar o modificar cualquier línea de código. Debes ceñirte de manera estricta a la arquitectura, esquemas de datos, alcance y convenciones descritas a continuación.

---

## 1. OBJETIVO

Desarrollar e implementar la solución completa de software para **Happy Paws Care Central**, una aplicación web integral para la clínica veterinaria *Happy Paws Veterinary Clinic*. 

El sistema debe digitalizar los flujos de trabajo operativos de la clínica, eliminando el uso de papel, centralizando la gestión de propietarios y mascotas, automatizando el control de citas y calendarios de vacunación, e implementando un portal seguro para que los propietarios de mascotas consulten el historial clínico y vacunas de sus animales.

Debes construir tanto el **Backend API (Node.js + Express + Supabase)** como el **Frontend Web (Next.js + React + Tailwind CSS + Supabase)** garantizando una arquitectura limpia, segura (RBAC), dockerizada y de alto rendimiento.

---

## 2. CONTEXTO Y ESPECIFICACIONES TÉCNICAS

### 2.1. Stack Tecnológico y Versiones Concretas
* **Frontend:** Next.js (v14+ App Router), React 18+, Tailwind CSS, TypeScript.
* **Backend:** Node.js (v20+ LTS), Express.js (v4.x), TypeScript.
* **Base de Datos:** **Supabase (PostgreSQL gestionado)**, usado de forma directa como única fuente de datos tanto en desarrollo como en producción. **No se levanta PostgreSQL local ni se usa Prisma ORM** — esto evita divergencias entre entornos locales y el entorno online. Cliente oficial: `@supabase/supabase-js`. Integración SSR/cookies de sesión en Next.js App Router: `@supabase/ssr`.
  ```bash
  npm install @supabase/supabase-js @supabase/ssr
  ```
* **Autenticación y Seguridad:** **Supabase Auth** gestiona usuarios, sesiones y emisión de JWT de forma nativa (ya no se implementa hashing manual con bcryptjs ni firma manual de JWT). El RBAC se aplica en dos capas complementarias:
  1. Middleware en Express que valida el rol (leído del JWT de Supabase o de la tabla `profiles`).
  2. **Row Level Security (RLS)** en las tablas de Supabase, como capa adicional de aislamiento de datos — especialmente crítica para el Portal de Propietarios (NFR-SEC-05).
* **Infraestructura de Desarrollo:** El proyecto debe estar **dockerizado** (`docker-compose.yml` en la raíz) para que todo el equipo trabaje con el mismo entorno de `back` y `front`. Supabase **no** se dockeriza (es un servicio gestionado externo); Docker solo orquesta las apps `back` y `front`. Debe existir siempre la alternativa de **correr el proyecto sin Docker** (con `npm run dev` directo), documentada por igual.
* **Pruebas:** Jest / Supertest (Backend), Vitest / React Testing Library (Frontend).

### 2.2. Comandos para Instalar, Correr y Probar

**Variables de entorno (`.env` en `/back` y en `/front`, nunca se commitean):**
```bash
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_ANON_KEY=<anon-public-key>           # usado en /front (cliente y server components)
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>  # usado SOLO en /back, jamás expuesto al cliente
```

**Opción A — Sin Docker (desarrollo local directo):**
```bash
# Raíz del proyecto
npm install

# Backend (directorio /back)
cd back
npm install
npm run dev          # Servidor en http://localhost:4000
npm run test         # Ejecutar pruebas unitarias e integración

# Frontend (directorio /front)
cd front
npm install
npm run dev          # Servidor en http://localhost:3000
npm run test         # Ejecutar pruebas frontend
```

**Opción B — Con Docker (entorno homogéneo para todo el equipo):**
```bash
# Raíz del proyecto, con /back/.env y /front/.env ya configurados
docker compose up --build
# back  -> http://localhost:4000
# front -> http://localhost:3000

docker compose exec back npm run test
docker compose exec front npm run test
```
> Ambas opciones deben quedarse funcionales y documentadas en el `README.md` raíz. Docker es la forma recomendada para mantener paridad entre el equipo, pero nunca debe ser obligatoria para poder correr el proyecto.

**Migraciones de base de datos (Supabase CLI, reemplaza a `prisma migrate`):**
```bash
npm install -g supabase        # una sola vez
supabase login
supabase link --project-ref <project-ref>
supabase migration new <nombre_migracion>   # crea archivo SQL en /supabase/migrations
supabase db push                            # aplica las migraciones al proyecto Supabase remoto
```

### 2.3. Estructura de Carpetas Monorepo
```text
happy-paws-care-central/
├── docker-compose.yml          # Orquesta back + front (opcional, ver 2.2)
├── supabase/
│   └── migrations/             # Migraciones SQL versionadas (supabase db push)
├── back/                       # Proyecto Backend API
│   ├── Dockerfile
│   ├── README.md                # Qué hace este backend, cómo correrlo, variables de entorno, scripts
│   ├── src/
│   │   ├── config/             # Cliente de Supabase (supabase.ts) y variables de entorno
│   │   ├── controllers/        # Controladores HTTP (Manejo req/res)
│   │   ├── middlewares/        # Auth, RBAC, Validate, Error handler
│   │   ├── routes/             # Enrutadores Express (rutas REST)
│   │   ├── services/           # Lógica de negocio (Pet, Owner, Appointment, Vaccination)
│   │   ├── utils/              # Funciones auxiliares
│   │   └── app.ts              # Express App setup
│   ├── tests/                  # Pruebas automatizadas
│   │   └── README.md            # Cómo correr los tests, qué cubren, convenciones de mocks
│   ├── package.json
│   └── tsconfig.json
├── front/                      # Proyecto Frontend Next.js
│   ├── Dockerfile
│   ├── README.md                # Qué hace este frontend, rutas principales, cómo correrlo
│   ├── src/
│   │   ├── app/                # Next.js App Router
│   │   │   ├── (auth)/         # Rutas públicas (login)
│   │   │   ├── dashboard/      # Panel interno (Staff, Vet, Admin)
│   │   │   ├── portal/         # Portal exclusivo Propietarios
│   │   │   └── layout.tsx
│   │   ├── components/         # Componentes UI reutilizables (Tables, Forms, Cards)
│   │   ├── context/            # Contexto de Autenticación y Estado Global
│   │   ├── lib/                 # Clientes de Supabase (browser/server, vía @supabase/ssr)
│   │   ├── services/            # Fetchers hacia el backend propio (Axios/Fetch)
│   │   ├── types/               # Definiciones TypeScript compartidas
│   │   └── utils/               # Helpers
│   ├── tests/                   # Pruebas automatizadas del frontend
│   │   └── README.md             # Cómo correr los tests, qué cubren, convenciones
│   ├── package.json
│   └── tsconfig.json
└── README.md
```
> **Regla:** toda carpeta marcada arriba con `README.md` es obligatoria y debe existir desde el primer commit relevante que cree contenido en esa carpeta (ver Sección 5, "Documentación por carpeta").

### 2.4. Entidades del Dominio y Modelo de Base de Datos (ERD)

A continuación se detallan las tablas exactas a definir como migraciones SQL de Supabase (`/supabase/migrations`). Con Supabase, la autenticación (usuarios, contraseñas, sesiones) la maneja **Supabase Auth** (tabla interna `auth.users`, fuera de nuestro control directo) — nuestras tablas de dominio se relacionan con ella por `id` (UUID), en vez de reimplementar usuarios y contraseñas propias:

1. **`profiles`**: Extiende a `auth.users` con los datos propios de usuarios internos del sistema (1:1 con `auth.users.id`).
   - `id`: UUID (PK, FK -> `auth.users.id`)
   - `email`: String (Unique — se sincroniza con Supabase Auth)
   - `full_name`: String
   - `role`: Enum (`ADMIN`, `VET`, `RECEPTIONIST`, `OWNER`)
   - `created_at`: DateTime (default: `now()`)
   - *(No existe `password_hash`: el manejo de contraseñas queda enteramente delegado a Supabase Auth.)*

2. **`owners`**: Propietarios de las mascotas.
   - `id`: BigInt / Autoincrement (PK)
   - `auth_user_id`: UUID? (FK -> `auth.users.id`, opcional — se llena cuando el propietario tiene cuenta en el Portal)
   - `full_name`: String
   - `phone`: String
   - `email`: String? (Opcional, vinculado a cuenta del portal)
   - `address`: String?
   - `created_at`: DateTime (default: `now()`)

3. **`pets`**: Mascotas registradas.
   - `id`: BigInt / Autoincrement (PK)
   - `owner_id`: BigInt (FK -> `owners.id`)
   - `pet_tag`: String (Unique, código/placa de identificación)
   - `name`: String
   - `species`: String (Ej: Perro, Gato)
   - `breed`: String?
   - `birth_date`: DateTime?
   - `weight`: Decimal(5,2)?
   - `created_at`: DateTime (default: `now()`)

4. **`appointments`**: Citas médicas.
   - `id`: BigInt / Autoincrement (PK)
   - `pet_id`: BigInt (FK -> `pets.id`)
   - `vet_id`: UUID (FK -> `profiles.id`)
   - `scheduled_at`: DateTime
   - `reason`: String (Text)
   - `notes`: String? (Notas clínicas registradas por el veterinario)
   - `status`: Enum (`SCHEDULED`, `COMPLETED`, `CANCELLED`)

5. **`services`**: Catálogo de servicios de la clínica.
   - `id`: BigInt / Autoincrement (PK)
   - `name`: String
   - `description`: String?
   - `price_cents`: Int (Precio en centavos)

6. **`appointment_services`**: Tabla pivote (Muchos a Muchos entre Citas y Servicios).
   - `appointment_id`: BigInt (FK -> `appointments.id`)
   - `service_id`: BigInt (FK -> `services.id`)
   - Primary Key compuesta: (`appointment_id`, `service_id`)

7. **`vaccinations`**: Registro de vacunas aplicadas y programación.
   - `id`: BigInt / Autoincrement (PK)
   - `pet_id`: BigInt (FK -> `pets.id`)
   - `appointment_id`: BigInt? (FK -> `appointments.id`, opcional)
   - `vaccine_name`: String
   - `administered_at`: DateTime
   - `next_due_date`: DateTime
   - `status`: Enum (`ADMINISTERED`, `PENDING`, `OVERDUE`)

> **Row Level Security (RLS):** todas las tablas anteriores deben crearse con RLS **activado** en Supabase. Como mínimo: (a) el rol `OWNER` solo puede hacer `SELECT` sobre `pets`, `appointments` y `vaccinations` cuya `owner_id`/`pet_id` corresponda a un `owners.auth_user_id` igual a `auth.uid()`; (b) ningún rol distinto de `ADMIN`/`VET` puede escribir en `appointments.notes` o `vaccinations`. Esto es la capa de seguridad definitiva para NFR-SEC-05, incluso si el backend Express tuviera un bug de autorización.

### 2.5. Reglas de la API REST

> Estas reglas aplican a los endpoints propios expuestos por `back` (Express). El `front` puede usar `@supabase/supabase-js` directamente **solo** para lecturas simples ya protegidas por RLS (ej. leer el propio perfil, listar las propias mascotas en el Portal). Toda escritura y toda lógica de negocio (agendar cita, calcular `next_due_date`, cambios de estado) **debe** pasar por el backend Express, nunca directo desde el cliente.

- **Rutas en plural y minúsculas:** `/api/v1/owners`, `/api/v1/pets`, `/api/v1/appointments`, `/api/v1/vaccinations`, `/api/v1/services`, `/api/v1/users`, `/api/v1/auth`.
- **Códigos de Estado HTTP Estándar:**
  - `200 OK`: Operación exitosa.
  - `201 Created`: Recurso creado exitosamente.
  - `400 Bad Request`: Error de validación o parámetros faltantes.
  - `401 Unauthorized`: No autenticado o token inválido.
  - `403 Forbidden`: No autorizado para este rol/recurso.
  - `404 Not Found`: Recurso no encontrado.
  - `500 Internal Server Error`: Error imprevisto en el servidor.
- **Formato Unificado de Respuesta JSON:**
  ```json
  {
    "success": true,
    "data": { ... },
    "error": null
  }
  ```
  En caso de error:
  ```json
  {
    "success": false,
    "data": null,
    "error": {
      "code": "RESOURCE_NOT_FOUND",
      "message": "La mascota solicitada no existe."
    }
  }
  ```

### 2.6. Convenciones de Nombres, Git y Commits
- **Archivos y Directorios:** `kebab-case` para archivos y componentes (ej: `pet-service.ts`, `appointment-card.tsx`).
- **Variables y Funciones:** `camelCase` (ej: `getPetById`, `scheduledAt`).
- **Clases y Tipos:** `PascalCase` (ej: `PetController`, `AppointmentStatus`).
- **Ramas:** `feature/rf-01-gestion-propietarios`, `fix/auth-jwt-expiration`.
- **Commits Conventional Commits:** `feat: ...`, `fix: ...`, `docs: ...`, `refactor: ...`, `test: ...`.
- **Migraciones SQL de Supabase:** nombre descriptivo en `snake_case` al crearlas con `supabase migration new` (ej: `create_profiles_table`, `add_rls_owners_pets`); el timestamp lo antepone automáticamente el CLI.

---

## 3. ALCANCE

### 3.1. Lo que SÍ debe tocar e implementar el agente
1. **Modelado y Migraciones DB:** Migraciones SQL de Supabase (`/supabase/migrations`) y políticas RLS correspondientes a cada tabla.
2. **Autenticación y RBAC (RF-07, RF-08):** Login vía Supabase Auth, roles (`ADMIN`, `VET`, `RECEPTIONIST`, `OWNER`), middleware de protección de rutas en Express + políticas RLS en Supabase.
3. **Gestión de Propietarios y Mascotas (RF-01, RF-02, RF-03):** CRUD completo de propietarios y mascotas, búsqueda rápida (<2s) por nombre, teléfono o `pet_tag`.
4. **Citas y Notas Clínicas (RF-04, RF-05):** Agendamiento de citas, asignación a veterinario, catálogo de servicios asociados, registro de observaciones y notas clínicas estandarizadas.
5. **Panel y Seguimiento de Vacunaciones (RF-06):** Registro de dosis aplicadas, cálculo automático de fechas de vencimiento (`next_due_date`), estados (`ADMINISTERED`, `PENDING`, `OVERDUE`).
6. **Portal del Propietario (RF-09, RF-10, RF-11):** Interfaz segura para que clientes vean **únicamente** la información y vacunas de sus propias mascotas (Aislamiento NFR-SEC-05).
7. **Dashboard Principal (RF-12) e Histórico de Operaciones (RF-13):** Paneles de control personalizados por rol e historial básico de auditoría de acciones clave.
8. **Dockerización:** `Dockerfile` para `back` y `front`, y `docker-compose.yml` en la raíz, manteniendo siempre viable la ejecución sin Docker.
9. **Pruebas Automatizadas:** Cobertura de pruebas unitarias e integración para servicios backend críticos.

### 3.2. Lo que NO debe tocar bajo ninguna circunstancia (Fuera de Alcance)
* **NO** implementar pasarelas de pago o comercio electrónico (E-commerce / Stripe / MercadoPago).
* **NO** integrar servicios externos de SMS o envío activo de correos electrónicos (Twilio, SendGrid). Mantenerlo únicamente como placeholders/logs.
* **NO** crear auditorías complejas de cumplimiento normativo legal o facturación electrónica.
* **NO** permitir que el rol `OWNER` edite o modifique notas médicas o historiales de vacunación (acceso estrictamente de SOLO LECTURA para propietarios).
* **NO** usar Prisma ORM ni levantar una instancia de PostgreSQL local/propia: Supabase es la única fuente de la base de datos.
* **NO** dockerizar Supabase ni intentar replicarlo localmente vía contenedores: se usa siempre el proyecto Supabase remoto (dev y prod pueden apuntar a proyectos Supabase distintos, pero ambos son remotos).

### 3.3. Principio de Minimalismo por Iteración
Cada iteración/generación de código del agente debe:
* Producir **código limpio** y consistente con las convenciones ya definidas en este documento (Sección 2.6).
* **No duplicar funcionalidades** ya existentes en el proyecto: antes de crear una función, componente, hook o endpoint, el agente debe verificar si ya existe algo equivalente y reutilizarlo o extenderlo en vez de recrearlo.
* **No generar archivos que no sean explícitamente necesarios** para lo que se le pidió en ese momento (nada de archivos de ejemplo, boilerplate especulativo, o features "por si acaso" fuera del pedido actual).
* Si detecta código muerto, duplicado o un archivo que ya no se usa como consecuencia del cambio solicitado, debe señalarlo en el resumen final (Sección 5) en vez de dejarlo silenciosamente.

---

## 4. CRITERIOS DE ACEPTACIÓN (LISTA VERIFICABLE DE EVALUACIÓN)

El agente considerará la tarea finalizada únicamente si se cumplen al 100% las siguientes verificaciones:

- [ ] **[RF-01 & RF-02] CRUD Propietarios y Mascotas:** Se pueden registrar, consultar y actualizar propietarios y vincular mascotas con su respectivo `pet_tag`.
- [ ] **[RF-03] Búsqueda Rápida:** La API y la UI permiten buscar mascotas/propietarios por nombre, teléfono o `pet_tag` respondiendo en < 2 segundos.
- [ ] **[RF-04 & RF-05] Citas y Notas Médicas:** Un recepcionista puede agendar cita; un veterinario asignado puede ingresar y actualizar las notas clínicas estandarizadas de la consulta.
- [ ] **[RF-06] Control de Vacunas:** El sistema calcula las vacunas próximas y vencidas (`OVERDUE`) y las resalta visualmente en el panel de control.
- [ ] **[RF-07 & RF-08] Seguridad y RBAC:** 
  - Solo usuarios autenticados con sesión válida de Supabase Auth acceden a la API.
  - El rol `RECEPTIONIST` no puede ingresar notas clínicas.
  - El rol `VET` puede registrar consultas y vacunas.
  - El rol `ADMIN` gestiona usuarios del sistema.
  - Las políticas RLS en Supabase bloquean el acceso aunque se intente saltar el backend.
- [ ] **[RF-09, RF-10, RF-11 & NFR-SEC-05] Portal Propietarios:** Un propietario autenticado **solo** puede ver sus propias mascotas, sus citas y el estado de sus vacunas. No tiene acceso a datos de otros clientes.
- [ ] **[RF-12 & RF-13] Dashboard & Auditoría:** El panel inicial muestra resúmenes relevantes según el rol y registra logs de eventos clave (login, actualización de citas).
- [ ] **[Infraestructura] Docker:** El proyecto corre correctamente tanto con `docker compose up` como sin Docker (`npm run dev` en `/back` y `/front`).
- [ ] **[Documentación] READMEs:** Existe un `README.md` útil y actualizado en `/back`, `/front`, `/back/tests` y `/front/tests`, además del `README.md` raíz.
- [ ] **[Calidad & Pruebas]:** Todos los tests en `/back` y `/front` se ejecutan sin errores con `npm run test` con un mínimo de 80% de cobertura en servicios principales.

---

## 5. FORMATO DE SALIDA DE CÓDIGO

El agente debe entregar el código respetando las siguientes directrices:

1. **Minimalismo y No Duplicación:** Antes de generar código nuevo, verificar si ya existe una función, componente o endpoint equivalente y reutilizarlo/extenderlo. No crear archivos, funciones ni features que no fueron pedidos explícitamente en la iteración actual (ver Sección 3.3).
2. **Archivos Completos:** No entregar snippets incompletos con comentarios tipo `// ... resto del código`. Cada archivo proporcionado debe estar 100% funcional y listo para usarse.
3. **Ubicación Clara:** Indicar al inicio de cada bloque de código la ruta exacta del archivo (ejemplo: `// back/src/services/pet.service.ts`).
4. **Manejo de Errores y Tipado:** Todo el código TypeScript debe estar explícitamente tipado (sin uso indiscriminado de `any`) y envolver operaciones asíncronas en bloques `try/catch` con manejo de excepciones HTTP.
5. **Documentación por Carpeta (README.md):** Cada carpeta principal (`/back`, `/front`, `/back/tests`, `/front/tests`) debe mantener un `README.md` útil y actualizado, con al menos: qué contiene la carpeta, cómo correrla/probarla, variables de entorno relevantes y cualquier convención específica de esa carpeta. Se actualiza en la misma iteración en que se modifica el contenido de la carpeta, no después.
6. **Breve Explicación Posterior:** Al finalizar la generación del código, incluir un resumen ejecutivo indicando los archivos creados/modificados y los pasos exactos para probarlos.

---

## 6. EJEMPLOS Y PATRONES DE CÓDIGO (CONVENCIONES DEL PROYECTO)

### 6.1. Ejemplo Patrón Backend: Service layer + Supabase (`back/src/services/pet.service.ts`)
```typescript
import { supabase } from '../config/supabase';

export interface CreatePetDTO {
  ownerId: number;
  petTag: string;
  name: string;
  species: string;
  breed?: string;
  birthDate?: string;
  weight?: number;
}

export class PetService {
  static async createPet(data: CreatePetDTO) {
    const { data: existingPet, error: findError } = await supabase
      .from('pets')
      .select('id')
      .eq('pet_tag', data.petTag)
      .maybeSingle();

    if (findError) {
      throw new Error('PET_LOOKUP_FAILED');
    }

    if (existingPet) {
      throw new Error('PET_TAG_ALREADY_EXISTS');
    }

    const { data: pet, error } = await supabase
      .from('pets')
      .insert({
        owner_id: data.ownerId,
        pet_tag: data.petTag,
        name: data.name,
        species: data.species,
        breed: data.breed,
        birth_date: data.birthDate,
        weight: data.weight
      })
      .select()
      .single();

    if (error) {
      throw new Error('PET_CREATE_FAILED');
    }

    return pet;
  }

  static async searchPets(query: string) {
    const { data, error } = await supabase
      .from('pets')
      .select('*, owner:owners(full_name, phone)')
      .or(
        `name.ilike.%${query}%,pet_tag.ilike.%${query}%,owner.full_name.ilike.%${query}%,owner.phone.ilike.%${query}%`
      )
      .limit(20);

    if (error) {
      throw new Error('PET_SEARCH_FAILED');
    }

    return data;
  }
}
```
> `back/src/config/supabase.ts` exporta un único cliente `supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)`. La `service_role` key se usa solo en el backend porque ignora RLS; por eso toda validación de permisos debe pasar antes por el middleware RBAC (ver 6.2).

### 6.2. Ejemplo Patrón Express Middleware RBAC (`back/src/middlewares/rbac.middleware.ts`)
> `req.user` lo puebla un middleware previo de autenticación que valida el JWT emitido por Supabase Auth (via `supabase.auth.getUser(token)`) y cruza el `id` contra la tabla `profiles` para obtener el `role`. El middleware de abajo solo consume ese `req.user.role` ya resuelto.
```typescript
import { Request, Response, NextFunction } from 'express';

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        data: null,
        error: {
          code: 'FORBIDDEN_ACCESS',
          message: 'No tienes los permisos necesarios para realizar esta acción.'
        }
      });
    }

    next();
  };
};
```

---

## 7. REFERENCIAS VISUALES Y ESTILO DE UI (DESIGN SYSTEM)

El mockup de referencia (`dashboard.png`, panel principal "Happy Paws Care Central") es la fuente canónica de identidad visual del proyecto. Cualquier mockup adicional que se agregue debe guardarse en `/design/mockups/` para que el agente lo use como referencia al construir nuevas pantallas.

### 7.1. Paleta de colores
| Token | Uso | Hex aprox. |
|---|---|---|
| `primary` | Header, nav, botón primario | `#7C90B0` |
| `background` | Fondo general de la app | `#F4F6F9` |
| `surface` | Fondo de tarjetas | `#FFFFFF` |
| `border` | Bordes de tarjetas | `#E5E8EC` |
| `text-primary` | Títulos, texto principal | `#2A2E35` |
| `text-secondary` | Subtítulos, metadatos | `#6B7280` |
| `link` | Enlaces ("Ver todas", "Módulo") | `#4A6FA5` |
| `badge-neutral-bg` / `badge-neutral-fg` | Badges "En consulta", "Check-in", "Agendada" | `#E7E9ED` / `#4B4F58` |
| `badge-danger-bg` / `badge-danger-fg` | Badge "Vencida" | `#FBE4E1` / `#B0463F` |
| `badge-warning-bg` / `badge-warning-fg` | Badge "Próxima" | `#FBEFD6` / `#A9770F` |

> Valores estimados del mockup; si aparece un archivo de diseño (Figma) en el futuro, ese archivo tiene prioridad sobre estos hex.

**`front/tailwind.config.ts` (extensión de tema):**
```typescript
// front/tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#7C90B0',
        background: '#F4F6F9',
        surface: '#FFFFFF',
        border: '#E5E8EC',
        'text-primary': '#2A2E35',
        'text-secondary': '#6B7280',
        link: '#4A6FA5',
        badge: {
          neutralBg: '#E7E9ED',
          neutralFg: '#4B4F58',
          dangerBg: '#FBE4E1',
          dangerFg: '#B0463F',
          warningBg: '#FBEFD6',
          warningFg: '#A9770F'
        }
      },
      fontFamily: {
        display: ['var(--font-display)'],
        sans: ['var(--font-sans)']
      },
      borderRadius: {
        card: '20px'
      }
    }
  }
};

export default config;
```

### 7.2. Tipografía
- **`font-display` (serif):** logo/marca, saludo principal, títulos de sección ("Agenda de hoy", "Cuidados pendientes"), nombres de mascotas, cifras grandes de estadísticas. Recomendado: `Playfair Display` o `Lora` vía `next/font/google`.
- **`font-sans`:** navegación, buscador, texto de listas, badges. Recomendado: `Inter`.
- Cargar ambas en `front/src/app/layout.tsx` con `next/font/google` y exponerlas como variables CSS (`--font-display`, `--font-sans`) consumidas por `tailwind.config.ts`.

### 7.3. Componentes y layout
- **Tarjetas (`surface` + `border`):** esquinas muy redondeadas (`rounded-card` / `~20px`), sombra sutil (`shadow-sm`), sin bordes marcados.
- **Badges de estado:** forma píldora (`rounded-full`), texto pequeño en negrita (`text-xs font-semibold`), color según semántica (`neutral` / `warning` / `danger` de la tabla anterior) — reutilizar el mismo componente `<StatusBadge />` en toda la app (Dashboard, Vacunas, Citas), nunca duplicarlo por pantalla (ver Sección 3.3).
- **Botón primario:** píldora (`rounded-full`), fondo `primary`, texto blanco en negrita.
- **Listas tipo agenda:** filas separadas por línea divisoria fina; dato principal (`font-display`) a la izquierda, metadatos en `text-secondary` debajo, badge de estado alineado a la derecha.
- **Layout de dos columnas** en vistas tipo dashboard: columna principal más ancha (contenido operativo) + columna secundaria más angosta (alertas/pendientes), cada una dentro de su propia tarjeta con encabezado y link de acción a la derecha.

---
*Con este prompt estructurado, cualquier Agente de Código (IA) sabrá exactamente qué construir, con qué reglas, qué carpetas utilizar y cómo verificar el éxito de la entrega.*
