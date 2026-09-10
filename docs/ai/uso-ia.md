# Documentación del Uso de Inteligencia Artificial
## 1. Propósito
Durante el desarrollo de Happy Paws Care Central utilizamos herramientas de inteligencia artificial como apoyo para investigar, organizar, diseñar y desarrollar algunas partes del proyecto. La IA fue utilizada como asistente de programación y documentación, pero las decisiones finales, revisiones y validaciones fueron realizadas por el equipo.

## 2. Herramientas utilizadas
Se utilizó inteligencia artificial integrada en el entorno de desarrollo para:

- Analizar la estructura del proyecto.
- Proponer estructuras de carpetas y archivos.
- Generar borradores de código.
- Sugerir consultas SQL para Supabase.
- Crear componentes de interfaz para el dashboard de vacunaciones.
- Ayudar con la configuración del backend y frontend.
- Detectar errores de compilación y dependencias faltantes.
- Generar documentación técnica y comandos de ejecución.

## 3. Participación del equipo
Aunque la IA generó sugerencias y fragmentos de código, el equipo participó activamente en el desarrollo mediante:

- Definición del alcance y los requerimientos del sistema.
- Revisión y modificación del código generado.
- Selección de las tecnologías utilizadas.
- Adaptación de las propuestas a las necesidades de la clínica.
- Configuración manual de Supabase.
- Creación y configuración de las credenciales del proyecto.
- Ejecución de las migraciones y carga de datos.
- Pruebas funcionales en el navegador.
- Corrección de errores encontrados durante la ejecución.
- Validación de los resultados obtenidos.

La IA no tomó decisiones autónomas sobre el producto. Las funcionalidades fueron revisadas y ajustadas por los integrantes del equipo antes de incorporarse al proyecto.

## 4. Validación del código generado
El código sugerido por la IA fue sometido a diferentes procesos de validación:

- Compilación del backend con TypeScript.
- Compilación de producción del frontend con Next.js.
- Ejecución de pruebas unitarias.
- Verificación de los endpoints mediante solicitudes HTTP.
- Pruebas visuales del dashboard en el navegador.
- Revisión de las variables de entorno.
- Comprobación de la conexión con Supabase.
- Validación de los permisos y roles de usuario.
- Cuando se encontraron errores, estos fueron analizados y corregidos por el equipo con apoyo de la IA.

## 5. Responsabilidad y seguridad
Las credenciales privadas, como la SUPABASE_SERVICE_ROLE_KEY, fueron manejadas únicamente en el backend y no deben exponerse en el frontend ni publicarse en el repositorio.

La IA no recibió ni debe recibir claves privadas, contraseñas o tokens personales. Las variables sensibles fueron configuradas localmente por el equipo.

## 6. Limitaciones del uso de IA
La inteligencia artificial puede generar código incompleto, incorrecto o incompatible con el proyecto. Por esta razón, sus respuestas no fueron utilizadas de manera automática. Todo código generado fue revisado, adaptado y probado antes de incorporarse.

También fue necesario corregir algunos aspectos durante el desarrollo, como:

- Configuración de dependencias.
- Scripts de ejecución.
- Conexión con Supabase.
- Manejo de sesiones y autenticación.
- Diferencias entre los puertos del frontend.
- Errores de compilación.
- Ajustes de diseño responsive.
