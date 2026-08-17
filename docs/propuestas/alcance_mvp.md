# Alcance del MVP - Utilizando el marco IN, OUT, LATER, UNKNOWN

---

### 1. ✅ IN (Dentro del alcance — MVP actual)

Características y entregables esenciales para reemplazar los flujos de trabajo basados en papel y que serán diseñados, desarrollados, probados y desplegados durante esta fase del proyecto:

* **Gestión de Perfiles de Mascotas y Propietarios:** Repositorio centralizado para crear, actualizar y buscar registros de clientes vinculados a sus mascotas mediante el nombre del propietario, número de teléfono o placa de identificación de la mascota.
* **Registro de Citas y Notas Clínicas:** Formularios estandarizados para registrar los motivos de las consultas, diagnósticos clínicos, historial de tratamientos y notas del veterinario.
* **Módulo de Seguimiento de Vacunación y Cuidados:** Interfaz de panel de control que destaca las vacunas próximas, vigentes y vencidas, así como las acciones clínicas de seguimiento pendientes.
* **Control de Acceso Basado en Roles (RBAC):** Vistas y conjuntos de permisos adaptados para Recepcionistas, Veterinarios y Administradores de la Clínica.
* **Documentación Operativa y de QA:** Casos de prueba completos, guías operativas y protocolos para el manejo de datos sensibles destinados a la validación del sistema.

---

### 2. 🛑 OUT (Fuera del alcance — Exclusiones explícitas)

Funcionalidades que quedan estrictamente excluidas del alcance actual para mantener el enfoque del proyecto y evitar retrasos en el cronograma:

* **Comercio Electrónico y Facturación Financiera:** Integraciones con pasarelas de pago, venta de productos, sistemas de punto de venta (POS) o gestión de inventario.
* **Telemedicina y Atención Virtual:** Herramientas para consultas por videollamada, monitoreo remoto de mascotas o sistemas de mensajería en tiempo real orientados a los clientes.
* **Infraestructura de Mensajería Externa Automatizada:** Integraciones con APIs de terceros (por ejemplo, Twilio, SendGrid) para enviar recordatorios automáticos por SMS o correo electrónico (*solo se incluirán marcadores de posición estáticos en la interfaz*).
* **Herramientas Complejas de Cumplimiento Normativo:** Sistemas avanzados de auditoría regulatoria o herramientas empresariales completas de cumplimiento de HIPAA/GDPR.

---

### 3. 🕤 LATER (Posterior al MVP — Hoja de ruta futura)

Características aplazadas para ciclos de desarrollo posteriores, una vez se haya completado el despliegue y validación del MVP principal con las partes interesadas:

* **Recordatorios Automatizados para Clientes:** Servicio activo de notificaciones por SMS y correo electrónico para próximas citas y vacunas pendientes.
* **Portal Web para Propietarios de Mascotas:** Portal externo dedicado para que los propietarios puedan consultar el historial médico, verificar el estado de las vacunas y solicitar citas.
* **Herramientas de Migración de Datos Históricos:** Herramientas de importación masiva o utilidades de OCR para digitalizar automáticamente los archivos físicos existentes.
* **Analítica Operativa Avanzada:** Informes sobre la productividad de la clínica, tendencias en el volumen de pacientes y tasas de cumplimiento de los cuidados.
* **Soporte para Múltiples Sedes:** Ampliación de la arquitectura del sistema para soportar operaciones de múltiples clínicas y una gestión centralizada.

---

### 4. ⍰ UNKNOWN (Requiere mayor aclaración técnica y operativa)

Elementos que requieren análisis adicional, investigación técnica o toma de decisiones con las partes interesadas de la clínica durante los primeros sprints de configuración:

* **Integración con Hardware y Periféricos:** Determinar si es necesaria la integración directa con impresoras físicas de etiquetas o placas de identificación.
* **Límites de Hosting y Almacenamiento de Archivos:** Definir las restricciones finales del servicio de alojamiento en la nube para almacenar archivos adjuntos o imágenes médicas.
* **Formatos de Exportación de Datos:** Confirmar si los historiales médicos deben poder exportarse en formatos estandarizados como PDF o CSV para transferencias externas.
* **Almacenamiento en Caché sin Conexión:** Evaluar el nivel de funcionamiento sin conexión necesario para manejar interrupciones intermitentes de la red Wi-Fi de la clínica.
* **Especilidad o enfoque del centro veterinario:** No sabemos si es centro general o se enfoca en alguna especialidad por lo que el sistema a medida puede tener algunas modificaciones en caso tal de ser la segunda opcion.