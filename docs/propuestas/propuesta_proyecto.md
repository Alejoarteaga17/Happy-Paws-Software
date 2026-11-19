### Preparado Para
* **Empresa:** Happy Paws Veterinary Clinic
* **Nombre de Contacto:** Pepito Perez
* **Dirección:** Universidad EAFIT
* **Teléfono:** +57...
* **Correo Electrónico:** ...@eafit.edu.co

---

### Preparado Por
* **Empresa:** AACCode
* **Autores / Equipo:**
  * Camila Vélez
  * Alejandra Suarez
  * Alejandro Arteaga
* **Nombre de Contacto:** Software Solutions SAS
* **Dirección:** Universidad EAFIT
* **Teléfono:** +57 ...
* **Correo Electrónico:** aarteagah@eafit.edu.co

---

### Información del Proyecto
* **Nombre del Proyecto:** Happy Paws Software
* **Presentado A:** ...
* **Presentado Por:** AACCode
* **Fecha Estimada de Inicio:** 6 de agosto de 2026
* **Fecha Estimada de Finalización:** 5 de noviembre de 2026

---

## 3.1 Descripción General del Proyecto
- Happy Paws Veterinary Clinic depende de flujos de trabajo basados en papel que ralentizan las operaciones diarias y afectan la confianza de los clientes. Los recepcionistas y veterinarios pierden tiempo valioso buscando los archivos físicos de las mascotas durante las consultas, mientras que la toma inconsistente de notas genera historiales médicos dispersos. Además, el seguimiento manual de las vacunas provoca que se pasen por alto controles posteriores, reduciendo la continuidad en la atención de los pacientes. La clínica necesita un sistema interno centralizado que agilice los registros de los pacientes y automatice el seguimiento de los cuidados sin introducir una carga operativa innecesaria.

## 3.2 Propósito y Objetivos
### Propósito
- El propósito principal de este proyecto es diseñar, desarrollar y entregar una aplicación web interna completamente funcional para Happy Paws Veterinary Clinic. El software busca reemplazar los procesos dependientes del papel por un sistema digital para gestionar perfiles de mascotas, registros de citas y seguimiento de vacunaciones, proporcionando además un entorno de pruebas claro para validar los flujos de trabajo principales antes del despliegue.

### Objetivos
- **Digitalizar los Registros Principales:** Centralizar los perfiles de propietarios y mascotas para permitir búsquedas inmediatas y eliminar la dependencia de carpetas físicas.
- **Mejorar la Continuidad de la Atención:** Implementar el seguimiento de las fechas de vacunación y resúmenes claros de las citas para evitar controles posteriores pendientes.
- **Garantizar la Calidad Funcional y las Pruebas:** Establecer casos de prueba estructurados y escenarios operativos para evaluar exhaustivamente la confiabilidad del sistema y los flujos de usuario para clientes, recepcionistas, veterinarios y administradores de la clínica.
- **Entregar una Herramienta Ligera y Segura:** Desarrollar una interfaz fácil de usar para el personal interno y un portal de consulta OWNER, sin introducir una carga operativa adicional.

## 3.3 Alcance del Trabajo
El alcance del trabajo para **Happy Paws Care Central** se centra en entregar un Producto Mínimo Viable (MVP) funcional y adaptado a las operaciones internas de la clínica:

* **Gestión de Perfiles de Mascotas y Propietarios:** Sistema centralizado para crear, actualizar y buscar registros de clientes y perfiles de mascotas vinculados mediante los datos del propietario.
* **Registro de Citas y Notas Clínicas:** Registro de las consultas diarias, motivos de las citas y notas clínicas de los veterinarios en un formato estructurado.
* **Seguimiento de Vacunación y Cuidados:** Módulo dedicado para registrar el historial de vacunaciones y destacar las próximas acciones de cuidado o aquellas que se encuentren vencidas.
* **Portal de Consulta para Propietarios:** Acceso autenticado para propietarios registrados donde podrán visualizar información básica de sus mascotas, historial de visitas, estado de vacunaciones e información clínica autorizada.
* **Control de Acceso Basado en Roles:** Vistas y permisos diferenciados para clientes, Recepcionistas, Veterinarios y Administradores de la Clínica.
* **Documentación Operativa y Casos de Prueba:** Guía operativa completa, políticas documentadas para el manejo de datos sensibles y casos de prueba para validar los flujos de trabajo principales.

## 3.4 Fuera del Alcance
Para garantizar límites claros del proyecto y mantener un MVP enfocado, las siguientes características y capacidades quedan explícitamente excluidas de esta fase del proyecto:

* **Comercio Electrónico y Facturación:** Funcionalidad de tienda en línea, venta de productos, gestión de inventario o integraciones con pasarelas de pago.
* **Telemedicina y Servicios para Clientes:** Consultas remotas, visitas virtuales o herramientas de mensajería orientadas a los clientes. El portal autenticado de propietarios sí forma parte del MVP y se limita a consulta de información clínica autorizada.
* **Sistemas Complejos de Notificaciones:** SMS automatizados, activadores automáticos de correo electrónico o integraciones con servicios externos de mensajería (más allá de marcadores de posición básicos y documentados en la interfaz).
* **Herramientas de Cumplimiento Normativo Completo:** Marcos avanzados de cumplimiento, herramientas de auditoría HIPAA/GDPR o sistemas regulatorios complejos.

## 3.5 Obstáculos y Riesgos
* **Migración Inconsistente de Registros en Papel:** Los registros físicos históricos pueden contener datos faltantes, contradictorios o ilegibles, lo que podría generar perfiles digitales de mascotas incompletos durante la configuración inicial.
* **Adopción por Parte del Personal y Fricción en los Flujos de Trabajo:** El personal de la clínica acostumbrado a las carpetas físicas puede experimentar una curva de aprendizaje al adoptar los nuevos flujos de registro digital durante las horas de mayor actividad.
* **Wi-Fi Limitado e Inestabilidad de la Conectividad:** Las interrupciones intermitentes de la conexión de red local dentro de la clínica podrían afectar el acceso en tiempo real a los archivos de pacientes y registros de citas durante la atención.
* **Crecimiento del Alcance Relacionado con las Notificaciones a Clientes:** Las partes interesadas podrían solicitar recordatorios activos por SMS o correo electrónico, lo que podría ampliar el proyecto más allá de la arquitectura de marcadores de posición inicialmente prevista.
* **Privacidad de Datos y Manejo de Registros Sensibles:** El manejo o exposición inadecuados de los datos de contacto de los propietarios y las notas médicas de los pacientes requieren una documentación cuidadosa de los protocolos operativos sin añadir herramientas complejas de cumplimiento normativo.
* **Control de Acceso para Propietarios:** Será necesario garantizar que cada propietario únicamente pueda visualizar la información asociada a sus propias mascotas y no acceder a registros pertenecientes a terceros.

## 3.6 Cronograma/Hitos

### Descripción General

El desarrollo de **Happy Paws Care Central** sigue un ciclo Agile iterativo estructurado de **13 semanas**, dividido en cuatro fases principales. Este enfoque permite validar tempranamente los flujos de trabajo críticos, como la búsqueda de propietarios/mascotas y el registro de consultas, mientras reserva tiempo específico para las pruebas de QA, la documentación operativa y las pruebas de aceptación del usuario (UAT) antes del despliegue final.

---

### Fases del Proyecto y Desglose de Sprints

#### Fase 1: Análisis de Requisitos y Configuración del Sistema (Semanas 1–2 | 06 de agosto – 20 de agosto)
* **Enfoque:** Configuración del entorno, arquitectura técnica y alineación de requisitos.
* **Actividades Principales:**
    * Inicializar el repositorio de GitHub, la estructura de carpetas y los entornos de desarrollo.
    * Definir el esquema de la base de datos (ERD) para `Owners`, `Pets`, `Appointments`, `Vaccinations` y `Users`.
    * Establecer las Directrices para el Manejo de Datos Sensibles (`/docs/sensitive-data-policy.md`).

#### Fase 2: Desarrollo de las Funcionalidades Principales del MVP (Semanas 3–9 | 21 de agosto – 08 de octubre)
* **Enfoque:** Desarrollo iterativo de los módulos principales de la aplicación.
* **Actividades Principales:**
    * **(Semanas 3–4):** Módulo de Gestión de Mascotas y Propietarios (crear, editar y buscar propietarios/mascotas).
    * **(Semanas 5–6):** Interfaz de Registro de Citas y Notas Clínicas.
    * **(Semanas 7–8):** Panel Automatizado de Seguimiento del Estado de Vacunaciones y desarrollo del Portal de Propietarios.
    * **(Semana 9):** Implementación del Control de Acceso Basado en Roles (RBAC) (Recepcionista, Veterinario, Administrador).

#### Fase 3: Pruebas, QA y Despliegue en Staging (Semanas 10–11 | 09 de octubre – 23 de octubre)
* **Enfoque:** Validación de calidad y preparación para las pruebas de aceptación del usuario.
* **Actividades Principales:**
    * Desplegar la aplicación MVP en un entorno de staging en la nube utilizando datos de ejemplo.
    * Ejecutar casos de prueba End-to-End (E2E) que cubran todos los flujos de trabajo principales (búsqueda, registros de consultas y seguimiento de cuidados).
    * Realizar la clasificación y priorización de errores y corregir problemas críticos (con un objetivo de una tasa de aprobación de pruebas $\ge 95\%$).

#### Fase 4: Entrega Final y Aprobación Operativa (Semanas 12–13 | 24 de octubre – 05 de noviembre)
* **Enfoque:** Capacitación, documentación operativa y finalización del proyecto.
* **Actividades Principales:**
    * Realizar la revisión de las Pruebas de Aceptación del Usuario (UAT) con Pepito Perez y el personal de la clínica.
    * Entregar las guías operativas para usuarios finales y los informes de pruebas del sistema.
    * Obtener la aprobación oficial del cliente y ejecutar la entrega final del proyecto.

---

### Hitos Principales del Proyecto
| ID del Hito | Fecha Objetivo | Nombre del Hito | Descripción y Entregable Principal |
| :---: | :---: | :--- | :--- |
| **M1** | **20 de agosto de 2026** | **Configuración y Arquitectura** | **Completo local.** Repositorio, arquitectura, ERD y configuración documentada. |
| **M2** | **03 de septiembre de 2026** | **Módulo de Mascotas y Propietarios** | **Parcial.** CRUD, `sex`, `updated_at` y búsqueda implementados; falta aplicar migraciones y medir < 2 s en staging. |
| **M3** | **17 de septiembre de 2026** | **Registro de Consultas Clínicas** | **Completo local.** Notas estandarizadas vinculadas a cita, mascota y veterinario. |
| **M4** | **01 de octubre de 2026** | **Seguimiento de Vacunaciones** | **Completo local.** Panel e indicadores de estado implementados y probados. |
| **M5** | **08 de octubre de 2026** | **Portal de Propietarios y RBAC** | **Parcial.** Flujos implementados; falta certificación RLS y aislamiento en Supabase. |
| **M6** | **23 de octubre de 2026** | **Staging y Finalización de QA** | **Pendiente externo.** El entorno local pasa 64 pruebas backend y 28 frontend; faltan staging, E2E y aprobación ≥95 %. |
| **M7** | **05 de noviembre de 2026** | **Entrega Final del Proyecto** | **Pendiente externo.** Falta UAT, aprobación del cliente y acta de aceptación. |

La matriz detallada y la evidencia por requisito se mantienen en [`estado-requisitos.md`](./estado-requisitos.md).
