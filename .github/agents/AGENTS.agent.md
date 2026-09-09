# PROMPT PARA AGENTE DE CÓDIGO - PROYECTO HAPPY PAWS CARE CENTRAL

> **Instrucciones para la IA / Agente de Desarrollo:** Lee detenidamente todas las secciones de este documento antes de generar o modificar cualquier línea de código. Debes ceñirte de manera estricta a la arquitectura, esquemas de datos, alcance y convenciones descritas a continuación.

---

## 1. OBJETIVO

Desarrollar e implementar la solución completa de software para **Happy Paws Care Central**, una aplicación web integral para la clínica veterinaria *Happy Paws Veterinary Clinic*. 

El sistema debe digitalizar los flujos de trabajo operativos de la clínica, eliminando el uso de papel, centralizando la gestión de propietarios y mascotas, automatizando el control de citas y calendarios de vacunación, e implementando un portal seguro para que los propietarios de mascotas consulten el historial clínico y vacunas de sus animales.

Debes construir tanto el **Backend API (Node.js + Express + Prisma ORM + PostgreSQL)** como el **Frontend Web (Next.js + React + Tailwind CSS)** garantizando una arquitectura limpia, segura (RBAC) y de alto rendimiento.

---

## 2. CONTEXTO Y ESPECIFICACIONES TÉCNICAS

### 2.1. Stack Tecnológico y Versiones Concretas
* **Frontend:** Next.js (v14+ App Router), React 18+, Tailwind CSS, TypeScript.
* **Backend:** Node.js (v20+ LTS), Express.js (v4.x), TypeScript, Prisma ORM (v5+).
* **Base de Datos:** PostgreSQL (v15+).
* **Autenticación y Seguridad:** JWT (JSON Web Tokens), bcryptjs para hashing de contraseñas, Middleware RBAC.
* **Pruebas:** Jest / Supertest (Backend), Vitest / React Testing Library (Frontend).

### 2.2. Comandos para Instalar, Correr y Probar
```bash
# Raíz del proyecto
npm install

# Backend (directorio /back)
cd back
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev          # Servidor en http://localhost:4000
npm run test         # Ejecutar pruebas unitarias e integración

# Frontend (directorio /front)
cd front
npm install
npm run dev          # Servidor en http://localhost:3000
npm run test         # Ejecutar pruebas frontend
```

### 2.3. Estructura de Carpetas Monorepo
```text
happy-paws-care-central/
├── back/                       # Proyecto Backend API
│   ├── prisma/
│   │   ├── schema.prisma       # Modelo de datos Prisma
│   │   └── migrations/         # Migraciones SQL
│   ├── src/
│   │   ├── config/             # Variables de entorno y DB connection
│   │   ├── controllers/        # Controladores HTTP (Manejo req/res)
│   │   ├── middlewares/        # Auth, RBAC, Validate, Error handler
│   │   ├── routes/             # Enrutadores Express (rutas REST)
│   │   ├── services/           # Lógica de negocio (Pet, Owner, Appointment, Vaccination)
│   │   ├── utils/              # Funciones auxiliares y JWT
│   │   └── app.ts              # Express App setup
│   ├── tests/                  # Pruebas automatizadas
│   ├── package.json
│   └── tsconfig.json
├── front/                      # Proyecto Frontend Next.js
│   ├── src/
│   │   ├── app/                # Next.js App Router
│   │   │   ├── (auth)/         # Rutas públicas (login)
│   │   │   ├── dashboard/      # Panel interno (Staff, Vet, Admin)
│   │   │   ├── portal/         # Portal exclusivo Propietarios
│   │   │   └── layout.tsx
│   │   ├── components/         # Componentes UI reutilizables (Tables, Forms, Cards)
│   │   ├── context/            # Contexto de Autenticación y Estado Global
│   │   ├── services/           # Cliente HTTP / API Fetchers (Axios/Fetch)
│   │   ├── types/              # Definiciones TypeScript compartidas
│   │   └── utils/              # Helpers
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

### 2.4. Entidades del Dominio y Modelo de Base de Datos (ERD)

A continuación se detallan los modelos exactos a definir en Prisma ORM (`schema.prisma`):

1. **`users`**: Usuarios internos del sistema.
   - `id`: BigInt / Autoincrement (PK)
   - `email`: String (Unique)
   - `full_name`: String
   - `password_hash`: String
   - `role`: Enum (`ADMIN`, `VET`, `RECEPTIONIST`)
   - `created_at`: DateTime (default: `now()`)

2. **`owners`**: Propietarios de las mascotas.
   - `id`: BigInt / Autoincrement (PK)
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
   - `vet_id`: BigInt (FK -> `users.id`)
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

### 2.5. Reglas de la API REST
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

---

## 3. ALCANCE

### 3.1. Lo que SÍ debe tocar e implementar el agente
1. **Modelado y Migraciones DB:** Configuración completa de Prisma schema y generación de tablas PostgreSQL.
2. **Autenticación y RBAC (RF-07, RF-08):** Login con JWT, roles (`ADMIN`, `VET`, `RECEPTIONIST`, `OWNER`), middleware de protección de rutas.
3. **Gestión de Propietarios y Mascotas (RF-01, RF-02, RF-03):** CRUD completo de propietarios y mascotas, búsqueda rápida (<2s) por nombre, teléfono o `pet_tag`.
4. **Citas y Notas Clínicas (RF-04, RF-05):** Agendamiento de citas, asignación a veterinario, catálogo de servicios asociados, registro de observaciones y notas clínicas estandarizadas.
5. **Panel y Seguimiento de Vacunaciones (RF-06):** Registro de dosis aplicadas, cálculo automático de fechas de vencimiento (`next_due_date`), estados (`ADMINISTERED`, `PENDING`, `OVERDUE`).
6. **Portal del Propietario (RF-09, RF-10, RF-11):** Interfaz segura para que clientes vean **únicamente** la información y vacunas de sus propias mascotas (Aislamiento NFR-SEC-05).
7. **Dashboard Principal (RF-12) e Histórico de Operaciones (RF-13):** Paneles de control personalizados por rol e historial básico de auditoría de acciones clave.
8. **Pruebas Automatizadas:** Cobertura de pruebas unitarias e integración para servicios backend críticos.

### 3.2. Lo que NO debe tocar bajo ninguna circunstancia (Fuera de Alcance)
* **NO** implementar pasarelas de pago o comercio electrónico (E-commerce / Stripe / MercadoPago).
* **NO** integrar servicios externos de SMS o envío activo de correos electrónicos (Twilio, SendGrid). Mantenerlo únicamente como placeholders/logs.
* **NO** crear auditorías complejas de cumplimiento normativo legal o facturación electrónica.
* **NO** permitir que el rol `OWNER` edite o modifique notas médicas o historiales de vacunación (acceso estrictamente de SOLO LECTURA para propietarios).

---

## 4. CRITERIOS DE ACEPTACIÓN (LISTA VERIFICABLE DE EVALUACIÓN)

El agente considerará la tarea finalizada únicamente si se cumplen al 100% las siguientes verificaciones:

- [ ] **[RF-01 & RF-02] CRUD Propietarios y Mascotas:** Se pueden registrar, consultar y actualizar propietarios y vincular mascotas con su respectivo `pet_tag`.
- [ ] **[RF-03] Búsqueda Rápida:** La API y la UI permiten buscar mascotas/propietarios por nombre, teléfono o `pet_tag` respondiendo en < 2 segundos.
- [ ] **[RF-04 & RF-05] Citas y Notas Médicas:** Un recepcionista puede agendar cita; un veterinario asignado puede ingresar y actualizar las notas clínicas estandarizadas de la consulta.
- [ ] **[RF-06] Control de Vacunas:** El sistema calcula las vacunas próximas y vencidas (`OVERDUE`) y las resalta visualmente en el panel de control.
- [ ] **[RF-07 & RF-08] Seguridad y RBAC:** 
  - Solo usuarios autenticados con token válido acceden a la API.
  - El rol `RECEPTIONIST` no puede ingresar notas clínicas.
  - El rol `VET` puede registrar consultas y vacunas.
  - El rol `ADMIN` gestiona usuarios del sistema.
- [ ] **[RF-09, RF-10, RF-11 & NFR-SEC-05] Portal Propietarios:** Un propietario autenticado **solo** puede ver sus propias mascotas, sus citas y el estado de sus vacunas. No tiene acceso a datos de otros clientes.
- [ ] **[RF-12 & RF-13] Dashboard & Auditoría:** El panel inicial muestra resúmenes relevantes según el rol y registra logs de eventos clave (login, actualización de citas).
- [ ] **[Calidad & Pruebas]:** Todos los tests en `/back` y `/front` se ejecutan sin errores con `npm run test` con un mínimo de 80% de cobertura en servicios principales.

---

## 5. FORMATO DE SALIDA DE CÓDIGO

El agente debe entregar el código respetando las siguientes directrices:

1. **Archivos Completos:** No entregar snippets incompletos con comentarios tipo `// ... resto del código`. Cada archivo proporcionado debe estar 100% funcional y listo para usarse.
2. **Ubicación Clara:** Indicar al inicio de cada bloque de código la ruta exacta del archivo (ejemplo: `// back/src/services/pet.service.ts`).
3. **Manejo de Errores y Tipado:** Todo el código TypeScript debe estar explícitamente tipado (sin uso indiscriminado de `any`) y envolver operaciones asíncronas en bloques `try/catch` con manejo de excepciones HTTP.
4. **Breve Explicación Posterior:** Al finalizar la generación del código, incluir un resumen ejecutivo indicando los archivos creados/modificados y los pasos exactos para probarlos.

---

## 6. EJEMPLOS Y PATRONES DE CÓDIGO (CONVENCIONES DEL PROYECTO)

### 6.1. Ejemplo Patrón Backend: Service layer + Prisma (`back/src/services/pet.service.ts`)
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreatePetDTO {
  ownerId: bigint;
  petTag: string;
  name: string;
  species: string;
  breed?: string;
  birthDate?: Date;
  weight?: number;
}

export class PetService {
  static async createPet(data: CreatePetDTO) {
    const existingPet = await prisma.pets.findUnique({
      where: { pet_tag: data.petTag }
    });

    if (existingPet) {
      throw new Error('PET_TAG_ALREADY_EXISTS');
    }

    return await prisma.pets.create({
      data: {
        owner_id: data.ownerId,
        pet_tag: data.petTag,
        name: data.name,
        species: data.species,
        breed: data.breed,
        birth_date: data.birthDate,
        weight: data.weight
      }
    });
  }

  static async searchPets(query: string) {
    return await prisma.pets.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { pet_tag: { contains: query, mode: 'insensitive' } },
          { owner: { full_name: { contains: query, mode: 'insensitive' } } },
          { owner: { phone: { contains: query } } }
        ]
      },
      include: {
        owner: true
      },
      take: 20
    });
  }
}
```

### 6.2. Ejemplo Patrón Express Middleware RBAC (`back/src/middlewares/rbac.middleware.ts`)
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
*Con este prompt estructurado, cualquier Agente de Código (IA) sabrá exactamente qué construir, con qué reglas, qué carpetas utilizar y cómo verificar el éxito de la entrega.*
