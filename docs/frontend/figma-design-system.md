# Design System Frontend de Happy Paws

## Fuente de verdad

- Archivo Figma: [Happy Paws](https://www.figma.com/design/KqHYFT8b9p6uMC9cg7jPHw/Happy-Paws?node-id=0-1&m=dev)
- Archivo key: `KqHYFT8b9p6uMC9cg7jPHw`
- Página raíz: `Page 1` (`0:1`)
- Estado de acceso verificado: disponible para inspección desde Figma MCP
- Librerías externas suscritas: ninguna
- Design system: componentes y tokens locales dentro del archivo Figma

Este documento registra la información visual extraída del archivo y su traducción al frontend actual. Las decisiones de interacción y los datos siguen perteneciendo a la aplicación; Figma define la identidad visual, los componentes y las pantallas de referencia.

## Estructura del archivo Figma

### `Create Atomic Design System` (`37:1615`)

Tablero de tokens y fundamentos visuales.

Incluye:

- Paleta de colores y swatches.
- Referencias de color.
- Familias tipográficas.
- Jerarquía de títulos y textos.
- Espaciados.
- Bordes y radios.
- Iconos.
- Navegación del propio tablero hacia Tokens, Atoms, Components y Example View.

### `ATOMS` (`28:263`)

Tablero de elementos básicos reutilizables.

Incluye:

- Botones Primary, Success, Danger, Warning, Outlined, Ghost y Disabled.
- Tamaños XS, SM, MD, LG y XL.
- Badges Blue, Green, Red, Yellow y Gray.
- Divisores.
- Estados Active, Warning, Error, Info y Neutral.

### `COMPONENTS` (`28:483`)

Tablero de componentes compuestos.

Incluye:

- Cards informativas y métricas.
- Tabs.
- Tabla de datos.
- Barras de progreso.
- Notificaciones y alertas informativas, exitosas, de advertencia y de error.
- Patrones de dashboard.

### `Example Page` (`34:1232`)

Dashboard operativo de referencia.

Incluye:

- Header de Happy Paws.
- Perfil de usuario con rol.
- Saludo contextual por fecha y turno.
- Acción `Nuevo check-in`.
- Tarjetas de estadísticas.
- Agenda clínica.
- Panel de control preventivo.
- Cuidados pendientes.
- Estados de citas y vencimientos.

### `Inicio de Sesion` (`37:2264`)

Pantalla de autenticación de referencia.

Incluye:

- Panel de acceso.
- Campos de correo y contraseña.
- Opción de recordar sesión.
- Recuperación de contraseña.
- Acceso alternativo.
- Mensaje de bienvenida.
- Tarjeta visual de mascota.

### `AppHeader` (`36:1564`)

Header reutilizable de la aplicación, con marca, navegación y acceso de usuario.

## Tokens verificados

### Tipografía

| Uso | Fuente | Estilo observado |
| --- | --- | --- |
| Títulos principales | `Quattrocento` | Regular, grande, editorial |
| Títulos secundarios | `Newsreader` | Regular |
| Texto de interfaz | `Iosevka Charon Mono` | Regular |
| Texto destacado | `Iosevka Charon Mono` | Bold |
| Texto pequeño | `Iosevka Charon Mono` | Regular / Bold |

Referencias concretas extraídas:

- `H1`: Quattrocento, 60 px.
- `H3`: Newsreader, 40 px.
- `Texto SM`: Iosevka Charon Mono, 14 px.
- `Texto SM Bold`: Iosevka Charon Mono, 14 px, bold.
- `Texto XSM`: Iosevka Charon Mono, 12 px.
- `Texto XSM Bold`: Iosevka Charon Mono, 12 px, bold.

En el frontend estas familias se cargan desde [layout.tsx](../../front/src/app/layout.tsx) y se consumen mediante variables CSS.

### Colores y estados

Tokens identificados en Figma:

| Token Figma | Valor | Uso |
| --- | --- | --- |
| `Neutro/100` | `#FFFFFF` | Superficie blanca |
| `Neutro/200` | `#E8E8E8` | Líneas y superficies suaves |
| `Neutro/300` | `#C6C6C6` | Bordes secundarios |
| `Neutro/400` | `#A4A4A4` | Texto neutro |
| `Neutro/500` | `#827E7E` | Texto secundario |
| `Neutro/600` | `#605B5B` | Texto de mayor contraste |
| `Aceptacion/100` | `#EBFFF8` | Fondo de éxito |
| `Aceptacion/600` | `#00754E` | Texto de éxito |
| `Alertas/100` | `#FFF6E6` | Fondo de advertencia |
| `Alertas/200` | `#FFDB9D` | Advertencia suave |
| `Alertas/500` | `#B16F00` | Texto de advertencia |
| `Alertas/600` | `#6D4500` | Advertencia de alto contraste |
| `Error/100` | `#FFEDED` | Fondo de error |
| `Error/200` | `#FF9A9A` | Error suave |
| `Error/400` | `#BC2828` | Error |
| `Error/500` | `#891313` | Error de alto contraste |
| `Error/600` | `#560505` | Error máximo |
| `Iconos/En accion` | `#FFFFFF` | Iconos sobre acciones |
| `Bordes/fondo` | `#FFFFFF` | Fondo de bordes |

El frontend usa además una capa semántica orientada a la aplicación en [globals.css](../../front/src/app/globals.css): `--primary`, `--primary-pale`, `--success`, `--warning`, `--danger`, `--paper`, `--background`, `--line` y `--muted`.

### Bordes y dimensiones

| Token | Valor |
| --- | --- |
| `AnchoBorde/sm` | `1 px` |
| `AnchoBorde/md` | `2 px` |
| `RadioBorde/md` | `4 px` |
| `RadioBorde/lg` | `8 px` |

Regla de implementación: usar `4 px` para controles y campos, `8 px` para cards, paneles y modales, y reservar bordes de `2 px` para estados que necesiten énfasis.

## Componentes en código

Los componentes comunes viven en [front/src/components](../../front/src/components):

- `ui.tsx`
  - `BrandMark`: marca textual `HP` reutilizable.
  - `Icon`: wrapper común para Material Symbols.
  - `StatusBadge`: badge semántico compartido.
- `app-header.tsx`
  - Header fijo con marca, navegación y perfil.
- `vaccination-dashboard.tsx`
  - Dashboard de vacunaciones que compone `AppHeader`, `Icon` y `StatusBadge`.

Los estados visuales se representan con clases semánticas:

- `status-scheduled`
- `status-completed`
- `status-cancelled`
- `status-administered`
- `status-pending`
- `status-overdue`

No crear badges o icon wrappers nuevos por pantalla. Extender los componentes compartidos cuando aparezca un nuevo estado.

## Pantallas conectadas

| Ruta | Referencia Figma | Responsabilidad |
| --- | --- | --- |
| `/login` | `Inicio de Sesion` | Autenticación con Supabase |
| `/` | `Example Page` | Resumen operativo |
| `/appointments` | Patrones de `COMPONENTS` y `Example Page` | Crear, editar y cancelar citas |
| `/pets` | Patrones de cards y formularios | Registrar y listar mascotas |
| `/vaccinations` | Patrones de `COMPONENTS` | Seguimiento y registro de vacunas |

## Convenciones de implementación

1. Reutilizar `BrandMark`, `Icon`, `StatusBadge` y `AppHeader` antes de crear markup equivalente.
2. Mantener los tokens en `globals.css`; no introducir colores o radios arbitrarios en páginas individuales.
3. Usar `Quattrocento` o `Newsreader` para títulos y `Iosevka Charon Mono` para controles, etiquetas, datos y estados.
4. Usar superficies blancas, bordes finos, radios de 4/8 px y sombras discretas.
5. Mantener el layout responsive: dashboard en columnas en escritorio y una columna en móvil.
6. Los botones de acción usan `primary-button` y las acciones secundarias `secondary-button`.
7. No modificar el backend al adaptar la presentación del frontend.
8. Las imágenes o iconos estáticos provenientes de una nueva referencia Figma deben revisarse antes de implementarse; no usar URLs temporales de Figma en producción.

## Validación

Desde `front/`:

```bash
npm test
npx tsc --noEmit
npm run build
```

Validación verificada al crear este documento:

- 4 archivos de test.
- 13 tests pasando.
- TypeScript sin errores.
- Build de Next.js exitoso.

## Nota de mantenimiento

El agente de proyecto contiene una descripción histórica que menciona Tailwind y otras rutas todavía no implementadas. Para el frontend actual, esta documentación y el código de `front/src` son la referencia operativa: el estilo se implementa con CSS global y componentes React reutilizables.
