## promt 1
Haz el sistema de gestión de citas, mascotas y vacunación para la clínica veterinaria Happy Paws Care Central.

## promt 2
Actúa como un Desarrollador Full Stack Senior experto en Node.js, Express, PostgreSQL, Next.js y React.

# Objetivo
Desarrollar la aplicación web "Happy Paws Care Central" para la clínica veterinaria Happy Paws. El sistema debe permitir gestionar propietarios, mascotas, agendamiento de citas, registro de notas clínicas, control de vacunas y un portal seguro para clientes.

# Dónde vive y Stack Tecnológico
El proyecto está organizado en un monorepo con dos carpetas principales:
- `/back`: API REST construida con Node.js, Express.js, TypeScript, Prisma ORM y PostgreSQL.
- `/front`: Aplicación web e interfaz web construida con Next.js (App Router), React y Tailwind CSS.

# Restricciones (Qué NO tocar)
- NO implementar pasarelas de pago, cobros ni integración con servicios financieros (Stripe, PayPal, etc.).
- NO integrar proveedores externos de SMS o envío activo de correos electrónicos (ej. Twilio, SendGrid). Mantener únicamente como placeholders.
- NO permitir que los usuarios con rol "Propietario/Cliente" puedan modificar o editar historiales clínicos o registros de vacunas (acceso de SOLO LECTURA).
- NO modificar la estructura de las tablas de la base de datos sin autorización previa.

## prompt 3
Actúa como un Desarrollador Full Stack Senior experto en Node.js, Express, PostgreSQL, Next.js y React.

# Objetivo
Desarrollar la aplicación web "Happy Paws Care Central" para la clínica veterinaria Happy Paws. El sistema debe permitir gestionar propietarios, mascotas, agendamiento de citas, registro de notas clínicas, control de vacunas y un portal seguro para clientes.

# Dónde vive y Stack Tecnológico
El proyecto está organizado en un monorepo con dos carpetas principales:
- `/back`: API REST construida con Node.js, Express.js, TypeScript, Prisma ORM y PostgreSQL.
- `/front`: Aplicación web e interfaz web construida con Next.js (App Router), React y Tailwind CSS.

# Restricciones (Qué NO tocar)
- NO implementar pasarelas de pago ni comercio electrónico.
- NO integrar servicios externos de SMS o email (Twilio/SendGrid).
- NO permitir que usuarios con rol "OWNER" editen o creen notas médicas o registros de vacunación (estricto SOLO LECTURA).

# Criterios de Aceptación (Verificables)
El trabajo se dará por concluido únicamente si cumple estos 8 criterios de evaluación:
1. [RF-01/02] Existe un CRUD completo para Propietarios y Mascotas asociadas con su código único `pet_tag`.
2. [RF-03] La búsqueda de mascotas/propietarios responde en menos de 2 segundos buscando por nombre, teléfono o `pet_tag`.
3. [RF-04/05] Los recepcionistas pueden agendar citas y los veterinarios pueden guardar notas clínicas usando plantillas estandarizadas.
4. [RF-06] El panel de vacunación calcula y resalta automáticamente las vacunas pendientes y vencidas (`OVERDUE`).
5. [RF-07/08] Se cuenta con autenticación JWT y Middleware RBAC que restringe rutas según el rol (`ADMIN`, `VET`, `RECEPTIONIST`, `OWNER`).
6. [RF-09/10/11] El portal del propietario aísla los datos: un cliente autenticado SOLO puede ver la información de sus propias mascotas.
7. [RF-12/13] El Dashboard principal muestra métricas operativas por rol y guarda un registro de auditoría de eventos clave.
8. [Calidad] Todos los tests unitarios e integración en `/back` y `/front` pasan con éxito con `npm run test`.

# Formato de Salida Exigido
1. Genera siempre archivos COMPLETOS. No uses comentarios de omisión tipo `// ... resto del código`.
2. Incluye la ruta relativa del archivo al inicio de cada bloque de código (ejemplo: `// back/src/services/appointment.service.ts`).
3. Usa TypeScript estricto sin el tipo `any`.
4. Incluye al final una breve explicación de los archivos creados y las instrucciones para probar el código.

## promt 4
Actúa como un Desarrollador Full Stack Senior experto en Node.js, Express, PostgreSQL, Next.js y React.

# Objetivo
Desarrollar la aplicación web "Happy Paws Care Central" para la clínica veterinaria Happy Paws. El sistema debe permitir gestionar propietarios, mascotas, agendamiento de citas, registro de notas clínicas, control de vacunas y un portal seguro para clientes.

# Dónde vive y Stack Tecnológico
El proyecto está organizado en un monorepo con dos carpetas principales:
- `/back`: API REST construida con Node.js, Express.js, TypeScript, Prisma ORM y PostgreSQL.
- `/front`: Aplicación web e interfaz web construida con Next.js (App Router), React y Tailwind CSS.

# Restricciones (Qué NO tocar)
- NO implementar pasarelas de pago ni comercio electrónico.
- NO integrar servicios externos de SMS o email (Twilio/SendGrid).
- NO permitir que usuarios con rol "OWNER" editen o creen notas médicas o registros de vacunación (estricto SOLO LECTURA).

# Criterios de Aceptación (Verificables)
El trabajo se dará por concluido únicamente si cumple estos 8 criterios de evaluación:
1. [RF-01/02] Existe un CRUD completo para Propietarios y Mascotas asociadas con su código único `pet_tag`.
2. [RF-03] La búsqueda de mascotas/propietarios responde en menos de 2 segundos buscando por nombre, teléfono o `pet_tag`.
3. [RF-04/05] Los recepcionistas pueden agendar citas y los veterinarios pueden guardar notas clínicas usando plantillas estandarizadas.
4. [RF-06] El panel de vacunación calcula y resalta automáticamente las vacunas pendientes y vencidas (`OVERDUE`).
5. [RF-07/08] Se cuenta con autenticación JWT y Middleware RBAC que restringe rutas según el rol (`ADMIN`, `VET`, `RECEPTIONIST`, `OWNER`).
6. [RF-09/10/11] El portal del propietario aísla los datos: un cliente autenticado SOLO puede ver la información de sus propias mascotas.
7. [RF-12/13] El Dashboard principal muestra métricas operativas por rol y guarda un registro de auditoría de eventos clave.
8. [Calidad] Todos los tests unitarios e integración en `/back` y `/front` pasan con éxito con `npm run test`.

# Formato de Salida Exigido
1. Genera siempre archivos COMPLETOS. No uses comentarios de omisión tipo `// ... resto del código`.
2. Incluye la ruta relativa del archivo al inicio de cada bloque de código (ejemplo: `// back/src/services/appointment.service.ts`).
3. Usa TypeScript estricto sin el tipo `any`.
4. Incluye al final una breve explicación de los archivos creados y las instrucciones para probar el código.

# Ejemplos / Convenciones del Repositorio (Few-Shot)

Sigue de manera estricta el estilo, manejo de excepciones y estructura presentados en estos dos archivos del proyecto:

Ejemplo 1: Servicio del Backend con Prisma (`back/src/services/pet.service.ts`)
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
      include: { owner: true },
      take: 20
    });
  }
}