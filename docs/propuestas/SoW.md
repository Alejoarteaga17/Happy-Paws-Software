# Declaración de Trabajo (SOW)

## Contenido:

- [Introducción](#introducción)
- [Plantilla de la declaración de trabajo](#plantilla-de-la-declaración-de-trabajo)
  - [Título](#título)
  - [Resumen](#resumen)
  - [Valor](#valor)
  - [Alcance](#alcance)
  - [Pago](#pago)
- [Propósito](#propósito)
  - [Objetivos](#objetivos)
  - [Rendimiento](#rendimiento)
- [Quién hace qué](#quién-hace-qué)
  - [Personas](#personas)
  - [Roles](#roles)
  - [Responsabilidades](#responsabilidades)
- [Contexto](#contexto)
  - [Situación actual](#situación-actual)
  - [Futuro](#futuro)
- [Planificación](#planificación)
  - [Requisitos](#requisitos)
- [Otros términos y condiciones](#otros-términos-y-condiciones)
  - [Obligaciones del cliente](#obligaciones-del-cliente)
- [Cronograma](#cronograma)
  - [Fecha de inicio y fecha de finalización previstas](#fecha-de-inicio-y-fecha-de-finalización-previstas)
  - [Aprobación](#aprobación)

# Declaración de Trabajo (SOW)

---

## 1. Introducción

### Título
**Declaración de Trabajo para la Aplicación Web Interna Happy Paws Care Central**

### Resumen
Esta Declaración de Trabajo (SOW) establece los objetivos, alcance, entregables, roles y cronograma para el diseño, desarrollo e implementación de **Happy Paws Care Central**, una aplicación web para **Happy Paws Veterinary Clinic**. El proyecto busca eliminar los flujos de trabajo dependientes del papel, centralizar los perfiles de propietarios y mascotas, agilizar el registro de citas y automatizar el seguimiento de vacunaciones. Adicionalmente, el sistema incluirá un portal para propietarios de mascotas que les permitirá acceder de manera segura a la información de sus mascotas, incluyendo historiales de atención y estados de vacunación.

El proveedor, **AACCode**, será responsable del ciclo completo de desarrollo de software, incluyendo la arquitectura del sistema, el desarrollo del MVP principal, los flujos de trabajo basados en roles, el portal de propietarios, las pruebas unitarias y del sistema, la documentación operativa y la entrega final. El proyecto tendrá una duración de 13 semanas (del 6 de agosto de 2026 al 5 de noviembre de 2026), con hitos principales vinculados a entregas iterativas. El presupuesto y las condiciones de pago acordadas garantizan una responsabilidad clara y una calidad funcional antes del despliegue final.

### Valor
El valor estimado del trabajo descrito en esta SOW se basa en un presupuesto fijo diseñado para el desarrollo personalizado del MVP de **Happy Paws Care Central**. Este cubre el análisis de requisitos, la arquitectura de software, el diseño UI/UX, el desarrollo de los módulos principales (Gestión de Mascotas/Propietarios, Registro de Citas y Seguimiento de Vacunaciones), la implementación del Control de Acceso Basado en Roles (RBAC), las pruebas de QA, la documentación operativa y la entrega posterior al despliegue. Los pagos se distribuirán de acuerdo con los principales hitos del proyecto para alinear los gastos con el progreso verificado. Cualquier adición al alcance o ampliación de funcionalidades posteriores al MVP más allá de este acuerdo estará sujeta a una Solicitud de Cambio independiente y será facturada de acuerdo con lo establecido.

### Alcance
El alcance de este proyecto comprende el desarrollo y despliegue de extremo a extremo de una aplicación web para Happy Paws Veterinary Clinic. El trabajo incluye la centralización de los perfiles de mascotas y propietarios para realizar búsquedas rápidas, el establecimiento de un registro estructurado de citas y notas clínicas, la creación de un panel para el seguimiento del estado de cuidados y vacunaciones, y la implementación de vistas basadas en roles para Recepcionistas, Veterinarios y Administradores de la Clínica.

Además, el sistema incluirá un portal orientado a propietarios de mascotas que permitirá autenticarse y consultar información relevante de sus mascotas, incluyendo datos básicos del perfil, historial de citas, historial clínico autorizado y estado de vacunaciones.

El proyecto requiere colaboración entre el equipo de desarrollo de AACCode y las partes interesadas principales de la clínica (Pepito Perez y el personal interno). Quedan excluidos de esta fase el comercio electrónico, el procesamiento de pagos, las notificaciones activas por SMS/correo electrónico, las herramientas complejas de auditoría de cumplimiento normativo y cualquier funcionalidad que permita a los propietarios modificar registros clínicos. El trabajo se entregará de forma iterativa siguiendo prácticas Agile y DataOps durante un período de 13 semanas.

### Pago
El valor total del proyecto será pagado en cuotas vinculadas directamente a cuatro hitos principales del proyecto. Un anticipo inicial del 20% deberá pagarse al momento de la aprobación y firma del contrato para iniciar la recopilación de requisitos y la configuración de la arquitectura. Los pagos posteriores se estructuran de la siguiente manera: 30% al completar y aprobar los módulos principales del MVP (Gestión de Mascotas/Propietarios y Registro de Consultas), 30% al entregar el Seguimiento de Vacunaciones, RBAC y los casos de prueba del sistema de QA, y el 20% final tras la entrega exitosa del sistema, la aprobación de la documentación operativa y la firma de aceptación. Las facturas se emitirán tras la aceptación de cada hito y deberán pagarse mediante transferencia bancaria electrónica dentro de los 15 días hábiles siguientes.

---

## 2. Propósito

### Objetivos
El objetivo principal de este proyecto es diseñar, desarrollar y desplegar una aplicación web interna segura, responsiva y ligera que reemplace los archivos manuales en papel de Happy Paws Veterinary Clinic por un sistema digital centralizado.

#### Objetivos y Resultados Clave (OKRs)

* **Objetivo 1: Digitalizar las Operaciones Principales de la Clínica y los Registros de Pacientes**
    * *KR 1.1:* Registrar digitalmente el 100% de los nuevos ingresos de pacientes y citas durante la validación del sistema.
    * *KR 1.2:* Reducir el tiempo promedio de búsqueda de archivos de mascotas de minutos a menos de 5 segundos mediante una búsqueda centralizada (por nombre del propietario, teléfono o placa de identificación de la mascota).

* **Objetivo 2: Mejorar la Continuidad de la Atención y el Seguimiento Preventivo**
    * *KR 2.1:* Implementar un panel de vacunación en tiempo real que destaque el 100% de los seguimientos de cuidados próximos y vencidos.
    * *KR 2.2:* Eliminar las variaciones en las notas en papel mediante la introducción de plantillas estandarizadas de notas clínicas para los veterinarios.

* **Objetivo 3: Entregar Alta Calidad y Confiabilidad Funcional**
    * *KR 3.1:* Completar el 100% de la ejecución de los casos de prueba predefinidos en todos los flujos de trabajo principales antes de la entrega final.
    * *KR 3.2:* Lograr cero vulnerabilidades críticas de seguridad o de manejo de datos durante las pruebas internas de aceptación.
  
* **Objetivo 4: Mejorar la Transparencia y Accesibilidad de la Información para los Propietarios**
    * *KR 4.1:* Permitir que el 100% de los propietarios registrados puedan acceder a la información de sus mascotas mediante autenticación segura.
    * *KR 4.2:* Reducir la necesidad de consultas telefónicas relacionadas con historiales médicos y estados de vacunación mediante acceso digital directo a la información.

---

## 3. Rendimiento

### Indicadores Clave de Rendimiento (KPIs)

El rendimiento del proyecto será monitoreado mediante reuniones periódicas de seguimiento, revisiones de entregables y evaluaciones técnicas de acuerdo con las siguientes métricas:

#### Métricas Empresariales y Operativas

* **Eficiencia en la Búsqueda de Registros:** Los resultados de búsqueda de pacientes/propietarios deberán mostrarse en < 2 segundos dentro de la red interna.
* **Tasa de Adopción del Personal:** Al menos el 85% del personal objetivo (recepcionistas y veterinarios) deberá completar correctamente los flujos de trabajo diarios simulados sin necesidad de asistencia durante las pruebas.
* **Tasa de Integridad de los Datos:** 100% de cumplimiento de las estructuras de datos definidas durante el registro de información y creación de perfiles de pacientes.

#### Métricas de Experiencia del Propietario

* **Accesibilidad del Portal de Propietarios:** El portal deberá estar disponible desde navegadores modernos en dispositivos móviles y escritorio.
* **Tiempo de Consulta de Información:** Los propietarios deberán poder acceder a la información de sus mascotas en menos de 3 segundos después de autenticarse.
* **Control de Acceso Seguro:** Cada propietario únicamente podrá visualizar información asociada a sus propias mascotas.

#### Métricas Técnicas y de Rendimiento del Sistema

* **Disponibilidad del Sistema / Uptime:** Objetivo de 99.5% de disponibilidad durante el horario de funcionamiento de la clínica.
* **Tiempo de Carga de las Páginas:** El panel de control y las páginas de perfiles de pacientes deberán cargar en < 3 segundos bajo una carga operativa estándar.
* **Tasa de Aprobación de Casos de Prueba:** Mínimo de 95% de aprobación en todos los escenarios de prueba documentados antes de la aprobación final.
---

## 4. Quién Hace Qué

### Personas

#### Equipo del Cliente — Happy Paws Veterinary Clinic
* **Pepito Perez** — Contacto Principal / Parte Interesada del Cliente
    * *Ubicación:* Universidad EAFIT
    * *Teléfono:* +57...
    * *Correo Electrónico:* ...@eafit.edu.co

#### Equipo del Proveedor — AACCode (Software Solutions SAS)
* **Camila Vélez** — Ingeniera de Software / Miembro del Equipo
    * *Ubicación:* Universidad EAFIT
* **Alejandra Suarez** — Ingeniera de Software / Miembro del Equipo
    * *Ubicación:* Universidad EAFIT
* **Alejandro Arteaga** — Líder Principal / Ingeniero de Software
    * *Ubicación:* Universidad EAFIT
    * *Teléfono:* +57...
    * *Correo Electrónico:* aarteagah@eafit.edu.co

---

### Roles

* **Líder del Proyecto del Cliente (Pepito Perez):** Representa los intereses de la clínica, proporciona los requisitos del dominio, aprueba los entregables y coordina los comentarios internos.
* **Líder de Desarrollo de Software (Alejandro Arteaga):** Gestiona la ejecución técnica general, la comunicación con el cliente, la arquitectura y la entrega del proyecto.
* **Desarrolladoras de Software / Ingenieras de QA (Camila Vélez, Alejandra Suarez):** Responsables de la implementación de funcionalidades frontend/backend, modelado de bases de datos, integración de la interfaz de usuario, creación de casos de prueba y documentación técnica.
* **Usuarios Finales de la Clínica (Recepcionistas, Veterinarios, Administradores de la Clínica):** Participan en la validación de los flujos de trabajo, proporcionan comentarios durante las revisiones operativas y ejecutan las pruebas de aceptación.
* **Usuarios Finales del Sistema (Recepcionistas, Veterinarios, Administradores de la Clínica y Propietarios de Mascotas):** Participan en la validación de los flujos de trabajo, proporcionan comentarios durante las revisiones operativas y ejecutan las pruebas de aceptación correspondientes a sus funcionalidades.

---

### Responsabilidades (Matriz RACIO)

> **Leyenda:**  
> **R** = Responsable (Realiza el trabajo) | **A** = Responsable final (Aprueba el trabajo) | **C** = Consultado (Proporciona información) | **I** = Informado (Se mantiene actualizado) | **O** = Omitido (No participa)

| Área de Responsabilidad / Tarea | Líder del Cliente (Pepito Perez) | Líder de Desarrollo (A. Arteaga) | Equipo de Desarrollo (C. Vélez, A. Suarez) | Personal de la Clínica |
| :--- | :---: | :---: | :---: | :---: |
| **Aclaración de Requisitos** | A | R | C | C |
| **Arquitectura del Sistema y Diseño de BD** | I | A | R | O |
| **Módulo de Gestión de Mascotas y Propietarios** | I | A | R | I |
| **Registro de Citas y Notas** | I | A | R | C |
| **Módulo de Seguimiento de Vacunaciones** | I | A | R | C |
| **Control de Acceso Basado en Roles (RBAC)** | I | A | R | O |
| **Casos de Prueba y Documentación Operativa** | C | A | R | I |
| **Pruebas de Aceptación del Usuario (UAT)** | A | C | C | R |
| **Despliegue Final y Entrega** | A | R | R | I |

---

## 5. Contexto

### Situación Actual
Actualmente, Happy Paws Veterinary Clinic depende de archivos físicos para mantener los historiales médicos de las mascotas, registrar los resultados de las citas y realizar el seguimiento de los calendarios de cuidados preventivos. Este flujo de trabajo tradicional genera cuellos de botella operativos: los recepcionistas pierden tiempo buscando físicamente las carpetas, los veterinarios registran las notas clínicas en formatos fragmentados y los seguimientos de vacunaciones omitidos pueden generar pérdidas en la continuidad de la atención.

El proyecto **Happy Paws Care Central** introduce una solución digital moderna y ligera para eliminar la dependencia del papel, centralizar los registros y agilizar los flujos de trabajo sin sobrecargar al personal con una complejidad innecesaria del sistema.

### Futuro
Aunque el MVP inicial se centra estrictamente en los flujos de trabajo internos principales de la clínica, la aplicación está diseñada con una arquitectura escalable para permitir futuras ampliaciones, entre ellas:

* Activadores de notificaciones automáticas por SMS y correo electrónico para recordatorios de citas de los clientes.
* Un portal orientado a los propietarios de mascotas para consultar registros de forma remota y solicitar citas.
* Utilidades de importación de datos para digitalizar los archivos históricos en papel.
* Soporte para múltiples sedes en caso de que la clínica se expanda a nuevas ubicaciones físicas.

---

## 6. Planificación

### Requisitos


| ID | Requisito Funcional | Descripción |
|----|--------------------|-------------|
| **RF-01** | Gestión de Propietarios | El sistema deberá permitir registrar, consultar, actualizar y administrar la información de los propietarios de mascotas, incluyendo datos de contacto y la relación con las mascotas registradas en la clínica. |
| **RF-02** | Gestión de Mascotas | El sistema deberá permitir crear, consultar, actualizar y administrar perfiles de mascotas, almacenando información relevante como nombre, especie, raza, fecha de nacimiento, sexo, peso e historial asociado. |
| **RF-03** | Búsqueda de Propietarios y Mascotas | El sistema deberá proporcionar un mecanismo de búsqueda rápida que permita localizar propietarios y mascotas mediante diferentes criterios, como nombre, número de teléfono o identificador de la mascota. |
| **RF-04** | Gestión de Citas Veterinarias | El sistema deberá permitir registrar, consultar, modificar y administrar citas veterinarias, asociándolas a una mascota y almacenando información como fecha, hora, motivo de consulta y estado de la cita. |
| **RF-05** | Registro de Notas Clínicas | El sistema deberá permitir a los veterinarios registrar y consultar observaciones clínicas, diagnósticos, tratamientos y recomendaciones realizadas durante una consulta médica. |
| **RF-06** | Gestión y Seguimiento de Vacunaciones | El sistema deberá registrar las vacunas aplicadas a cada mascota y realizar el seguimiento de próximas dosis, vacunas vigentes y vacunas vencidas para facilitar el control preventivo. |
| **RF-07** | Control de Acceso Basado en Roles (RBAC) | El sistema deberá gestionar permisos y restricciones de acceso según el rol asignado a cada usuario, garantizando que únicamente pueda acceder a las funcionalidades correspondientes a sus responsabilidades. |
| **RF-08** | Autenticación de Usuarios | El sistema deberá permitir que los usuarios se autentiquen mediante credenciales seguras para acceder a las funcionalidades autorizadas según su rol. |
| **RF-09** | Portal de Propietarios | El sistema deberá proporcionar un portal web para propietarios de mascotas donde puedan acceder de forma segura a la información relacionada con sus animales registrados. |
| **RF-10** | Consulta de Historial Clínico por Propietarios | El sistema deberá permitir que los propietarios visualicen la información clínica autorizada de sus mascotas, incluyendo consultas previas, tratamientos registrados y observaciones compartidas por la clínica. |
| **RF-11** | Consulta de Estado de Vacunaciones por Propietarios | El sistema deberá permitir que los propietarios consulten el historial de vacunación de sus mascotas, incluyendo vacunas aplicadas, próximas dosis y estados de seguimiento. |
| **RF-12** | Dashboard Principal del Sistema | El sistema deberá proporcionar paneles de visualización adaptados a cada rol, mostrando información relevante, accesos rápidos y resúmenes operativos según el tipo de usuario. |
| **RF-13** | Auditoría Básica de Operaciones | El sistema deberá registrar eventos relevantes del sistema, como inicios de sesión, creación o actualización de registros y acciones críticas, con el fin de facilitar el seguimiento y control de actividades. |
| **RF-14** | Gestión de Usuarios Internos | El sistema deberá permitir a los administradores crear, modificar, activar o desactivar cuentas de usuarios internos, así como asignarles roles y permisos correspondientes. |
| **RF-15** | Gestión de Cuentas de Propietarios | El sistema deberá permitir la creación y administración de cuentas para propietarios de mascotas, garantizando que cada cuenta quede asociada únicamente a las mascotas correspondientes. |

---

## 7. Otros Términos y Condiciones

### Obligaciones del Cliente

Para garantizar la entrega del proyecto dentro del cronograma establecido, Happy Paws Veterinary Clinic se compromete a:

* Mantener disponible a **Pepito Perez** (o a un representante autorizado) para reuniones semanales de seguimiento y proporcionar comentarios oportunos.
* Proporcionar registros físicos de ejemplo (anonimizados) y estructuras de datos de ejemplo dentro de los 5 días hábiles posteriores al inicio del proyecto.
* Proporcionar comentarios o aprobación sobre los entregables dentro de los cinco (5) días hábiles posteriores a su recepción.
* Facilitar el acceso a los usuarios finales objetivo (recepcionistas y veterinarios) para las sesiones de pruebas operativas y recopilación de comentarios.
* Garantizar que la infraestructura de red local de la clínica cumpla con los estándares básicos de conectividad Wi-Fi necesarios para el acceso mediante navegador.

---

## 8. Cronograma

### Fecha de Inicio y Fecha de Finalización Previstas

* **Fecha Estimada de Inicio:** 6 de agosto de 2026
* **Fecha Estimada de Finalización:** 5 de noviembre de 2026
* **Duración Total:** 13 semanas (Ciclo Agile Iterativo)

### Aprobación

**NOTA:** Antes de firmar la Declaración de Trabajo, si tiene alguna pregunta o inquietud, comuníquese con la autoridad de trabajo indicada anteriormente para negociar cualquier asunto pendiente.

Si está de acuerdo con los requisitos de esta Declaración de Trabajo, firme y feche el documento. Este será aceptado como su propuesta por parte del Cliente y deberá ser devuelto a nuestra atención.

Por favor, envíe una copia original firmada por correo.

**Nombre en letra de imprenta:**

__________________________________________


**Firma:**

__________________________________________


**Fecha:**

__________________________________________
