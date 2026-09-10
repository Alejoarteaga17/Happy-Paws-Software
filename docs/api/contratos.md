# Contratos de API

Contratos vigentes entre el backend Express y el frontend Next.js de Happy Paws Care Central.

## 1. Información general

### URL base

El frontend obtiene la URL desde `NEXT_PUBLIC_API_URL` y agrega el prefijo `/api/v1`.

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

La URL final de cada recurso sigue este formato:

```text
{NEXT_PUBLIC_API_URL}/api/v1/{recurso}
```

### Formato de respuesta

Todas las respuestas de la API usan el siguiente envoltorio:

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

En caso de error:

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "Descripción del error"
  }
}
```

El frontend debe comprobar `response.ok`, `success` y que `data` no sea `null` antes de usar la respuesta. El token de sesión se obtiene de Supabase Auth y se envía así:

```http
Authorization: Bearer <supabase-access-token>
Content-Type: application/json
```

### Autenticación y autorización

| Recurso | Método | Requisito actual |
| --- | --- | --- |
| `/health` | `GET` | Público |
| `/pets` | `GET` | Token válido y rol `ADMIN`, `VET` o `RECEPTIONIST` |
| `/pets` | `POST` | Token válido y rol `ADMIN` o `RECEPTIONIST` |
| `/appointments` | Todos | Token válido |
| `/vaccinations` | `GET` | Token válido, salvo que `ALLOW_ANONYMOUS_READS=true` |
| `/vaccinations` | `POST` | Token válido |

La clave `SUPABASE_SERVICE_ROLE_KEY` se usa únicamente en el backend y nunca debe enviarse desde el frontend.

## 2. Endpoint de salud

### `GET /health`

Comprueba que el backend está disponible.

**Respuesta `200 OK`**

```json
{
  "success": true,
  "data": { "status": "ok" },
  "error": null
}
```

## 3. Mascotas

Ruta base: `/api/v1/pets`

### `GET /api/v1/pets`

Lista las mascotas ordenadas alfabéticamente por nombre e incluye el nombre del propietario.

**Respuesta `200 OK`**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "ownerId": 1,
      "ownerName": "Ana Pérez",
      "petTag": "HP-0001",
      "name": "Coco",
      "species": "Perro",
      "breed": "Beagle",
      "birthDate": "2021-05-10",
      "weight": 12.5
    }
  ],
  "error": null
}
```

### `POST /api/v1/pets`

Crea una mascota asociada a un propietario existente.

**Entrada**

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `ownerId` | `number` entero positivo | Sí | ID del propietario |
| `petTag` | `string` | Sí | Identificador único de la mascota |
| `name` | `string` | Sí | Nombre |
| `species` | `string` | Sí | Especie |
| `breed` | `string` | No | Raza |
| `birthDate` | `string` | No | Fecha válida, preferiblemente `YYYY-MM-DD` |
| `weight` | `number` positivo | No | Peso en kilogramos |

```json
{
  "ownerId": 1,
  "petTag": "HP-0005",
  "name": "Luna",
  "species": "Gato",
  "breed": "Criollo",
  "birthDate": "2022-08-14",
  "weight": 4.2
}
```

**Respuesta `201 Created`**

Devuelve un objeto `Pet` con la misma estructura de la respuesta de listado.

**Errores relevantes:** `400 INVALID_PET`, `400 OWNER_NOT_FOUND`, `409 PET_TAG_ALREADY_EXISTS`.

## 4. Citas

Ruta base: `/api/v1/appointments`

### Modelo `Appointment`

```json
{
  "id": 10,
  "petId": 1,
  "petName": "Coco",
  "vetId": "uuid-del-veterinario",
  "scheduledAt": "2026-09-15T14:30:00.000Z",
  "reason": "Control general",
  "notes": null,
  "status": "SCHEDULED"
}
```

Valores permitidos para `status`: `SCHEDULED`, `COMPLETED`, `CANCELLED`.

### `GET /api/v1/appointments`

Lista las citas ordenadas por `scheduledAt` ascendente.

**Respuesta `200 OK`**

`data` es un arreglo de objetos `Appointment`.

### `GET /api/v1/appointments/:id`

Consulta una cita por su ID.

**Respuesta `200 OK`**

`data` es un objeto `Appointment`.

**Errores relevantes:** `400 INVALID_APPOINTMENT_ID`, `404 APPOINTMENT_NOT_FOUND`.

### `POST /api/v1/appointments`

Crea una cita con estado inicial `SCHEDULED`. Si no se envía `vetId`, el backend asigna el primer perfil disponible con rol `VET`.

**Entrada**

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `petId` | `number` entero | Sí | ID de la mascota |
| `scheduledAt` | `string` | Sí | Fecha y hora válidas |
| `reason` | `string` | Sí | Motivo de consulta |
| `vetId` | `string` UUID | No | Veterinario asignado |

```json
{
  "petId": 1,
  "scheduledAt": "2026-09-15T14:30:00.000Z",
  "reason": "Control general"
}
```

**Respuesta `201 Created`**

`data` es la cita creada.

**Errores relevantes:** `400 INVALID_APPOINTMENT`, `400 VET_NOT_FOUND`, `500 VET_LOOKUP_FAILED`.

### `PUT /api/v1/appointments/:id`

Actualiza uno o más campos de una cita. El cuerpo no puede estar vacío.

**Entrada**

Todos los campos son opcionales, pero debe enviarse al menos uno:

```json
{
  "petId": 2,
  "scheduledAt": "2026-09-16T09:00:00.000Z",
  "reason": "Vacunación anual",
  "vetId": "uuid-del-veterinario",
  "status": "COMPLETED"
}
```

`vetId` también puede ser `null` para quitar la asignación. `status` acepta `SCHEDULED`, `COMPLETED` o `CANCELLED`.

**Respuesta `200 OK`**

`data` es la cita actualizada.

**Errores relevantes:** `400 INVALID_APPOINTMENT`, `404 APPOINTMENT_NOT_FOUND`.

### `PATCH /api/v1/appointments/:id/cancel`

Cambia el estado de la cita a `CANCELLED`.

**Respuesta `200 OK`**

`data` es la cita cancelada.

**Errores relevantes:** `400 INVALID_APPOINTMENT_ID`, `404 APPOINTMENT_NOT_FOUND`.

## 5. Vacunaciones

Ruta base: `/api/v1/vaccinations`

### Modelo `Vaccination`

```json
{
  "id": 20,
  "petId": 1,
  "petName": "Coco",
  "vaccineName": "Rabia",
  "administeredAt": "2026-09-10",
  "nextDueDate": "2027-09-10",
  "status": "PENDING"
}
```

Valores permitidos para `status`: `ADMINISTERED`, `PENDING`, `OVERDUE`. Al crear una vacunación, el backend calcula el estado a partir de `nextDueDate`; actualmente el servicio genera `PENDING` u `OVERDUE`.

### `GET /api/v1/vaccinations`

Lista las vacunaciones ordenadas por `nextDueDate` ascendente.

**Respuesta `200 OK`**

`data` es un arreglo de objetos `Vaccination`.

### `POST /api/v1/vaccinations`

Registra una vacunación para una mascota existente.

**Entrada**

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `petId` | `number` entero positivo | Sí | ID de la mascota |
| `vaccineName` | `string` no vacío | Sí | Nombre de la vacuna |
| `administeredAt` | `string` | Sí | Fecha de aplicación |
| `nextDueDate` | `string` | Sí | Próxima fecha de aplicación |

```json
{
  "petId": 1,
  "vaccineName": "Rabia",
  "administeredAt": "2026-09-10",
  "nextDueDate": "2027-09-10"
}
```

**Respuesta `201 Created`**

`data` es la vacunación creada con su `status` calculado.

**Errores relevantes:** `400 INVALID_VACCINATION`, `404 PET_NOT_FOUND`.

## 6. Consumo desde el frontend

Los servicios del frontend están en `front/src/services` y usan `fetch`. La URL base se normaliza quitando la barra final y cada servicio conserva el envoltorio de respuesta de la API.

### Obtener la sesión y crear headers

Para endpoints protegidos, el frontend obtiene el access token desde Supabase Auth:

```typescript
const { data, error } = await getSupabaseClient().auth.getSession();
if (error) throw new Error(`Supabase session failed: ${error.message}`);
if (!data.session) throw new Error('Debes iniciar sesión');

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${data.session.access_token}`
};
```

### Ejemplos equivalentes a los servicios actuales

```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');

const petsResponse = await fetch(`${apiUrl}/api/v1/pets`, {
  cache: 'no-store',
  headers
});
const petsPayload = await petsResponse.json();
if (!petsResponse.ok || !petsPayload.success || petsPayload.data === null) {
  throw new Error(petsPayload.error?.message ?? 'No se pudieron cargar las mascotas');
}
const pets = petsPayload.data;
```

```typescript
const appointmentResponse = await fetch(`${apiUrl}/api/v1/appointments`, {
  method: 'POST',
  headers,
  body: JSON.stringify({
    petId: 1,
    scheduledAt: '2026-09-15T14:30:00.000Z',
    reason: 'Control general'
  })
});
const appointmentPayload = await appointmentResponse.json();
```

Los servicios implementados actualmente son:

| Archivo | Funciones | Endpoints usados |
| --- | --- | --- |
| `front/src/services/pet-service.ts` | `getPets`, `createPet` | `GET` y `POST /api/v1/pets` |
| `front/src/services/appointment-service.ts` | `getAppointments`, `createAppointment`, `updateAppointment`, `cancelAppointment` | `GET`, `POST`, `PUT` y `PATCH /api/v1/appointments` |
| `front/src/services/vaccination-service.ts` | `getVaccinations`, `createVaccination` | `GET` y `POST /api/v1/vaccinations` |

El frontend no debe enviar `SUPABASE_SERVICE_ROLE_KEY`. Para ejecutar ambos proyectos, el backend escucha por defecto en `http://localhost:4000` y el frontend debe tener `NEXT_PUBLIC_API_URL=http://localhost:4000`.

## 7. Errores de transporte

| HTTP | Significado | Acción recomendada en frontend |
| --- | --- | --- |
| `400` | Entrada inválida o ID incorrecto | Mostrar el mensaje de `error.message` y corregir el formulario |
| `401` | Falta el token o es inválido | Renovar sesión o enviar al login |
| `403` | El rol no tiene permisos | Mostrar acceso no autorizado |
| `404` | Recurso inexistente | Mostrar que el recurso no fue encontrado |
| `409` | Conflicto de unicidad, como `petTag` duplicado | Mostrar el conflicto y solicitar otro valor |
| `500` | Error interno o de Supabase | Mostrar error genérico y conservar la entrada del formulario |

## 8. Endpoints aún no implementados

Los endpoints de propietarios, servicios, usuarios, auditoría y autenticación propia no forman parte de este contrato porque todavía no están registrados en `back/src/app.ts`. Cuando se implementen, deben agregarse aquí junto con sus tipos, permisos, ejemplos de request/response y funciones correspondientes en `front/src/services`.
