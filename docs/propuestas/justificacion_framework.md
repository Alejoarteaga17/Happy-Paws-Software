## Stack Tecnológico Seleccionado

Para el desarrollo de **Happy Paws Care Central**, se seleccionó una arquitectura basada en tecnologías web modernas que permiten construir una aplicación escalable, mantenible y adecuada para los requerimientos funcionales y técnicos del proyecto.

### Frontend: React + Next.js

Se seleccionó **React** junto con **Next.js** para el desarrollo de la interfaz de usuario debido a su flexibilidad, rendimiento y amplia adopción en la industria.

**Justificación:**

* Permite construir interfaces modernas, dinámicas y responsivas mediante componentes reutilizables.
* Facilita la creación de diferentes vistas para los distintos roles del sistema (Recepcionista, Veterinario, Administrador y Propietario).
* Next.js proporciona optimizaciones automáticas de rendimiento, manejo eficiente de rutas y una estructura de proyecto organizada.
* Ofrece una excelente experiencia de desarrollo gracias a características como Hot Reloading y una amplia disponibilidad de librerías y herramientas.
* Facilita la escalabilidad futura del sistema en caso de incorporar nuevas funcionalidades como portales avanzados para propietarios, solicitudes de citas o reportes analíticos.
* Permite una integración sencilla con APIs REST desarrolladas en el backend.

---

### Backend: Node.js + Express.js

Se seleccionó **Node.js** como entorno de ejecución y **Express.js** como framework para la construcción de la API REST del sistema.

**Justificación:**

* Permite desarrollar servicios web rápidos y ligeros utilizando JavaScript tanto en frontend como en backend, reduciendo la complejidad tecnológica del proyecto.
* Express.js proporciona una estructura simple y flexible para la construcción de APIs REST escalables.
* Facilita la implementación de autenticación, autorización basada en roles (RBAC) y validaciones de negocio.
* Cuenta con una amplia comunidad y ecosistema de paquetes que aceleran el desarrollo.
* Su arquitectura basada en eventos y operaciones asíncronas permite manejar eficientemente múltiples solicitudes concurrentes.
* Resulta adecuado para aplicaciones empresariales de tamaño pequeño y mediano como Happy Paws Care Central.

---

### Base de Datos: PostgreSQL

Se seleccionó **PostgreSQL** como sistema de gestión de bases de datos relacional para almacenar toda la información operativa del sistema.

**Justificación:**

* El dominio del problema presenta relaciones claramente estructuradas entre entidades como propietarios, mascotas, citas, vacunaciones y usuarios.
* Proporciona integridad referencial mediante claves primarias y foráneas, garantizando la consistencia de los datos.
* Ofrece un excelente rendimiento para operaciones transaccionales y consultas complejas.
* Es una solución robusta, gratuita y ampliamente utilizada en entornos empresariales.
* Facilita la implementación de restricciones, validaciones y mecanismos de seguridad a nivel de base de datos.
* Permite escalar el sistema en futuras versiones sin necesidad de migrar a otra tecnología de almacenamiento.

---

### Arquitectura General

La solución seguirá una arquitectura cliente-servidor basada en servicios REST:

```text
Frontend (React + Next.js)
            │
            ▼
Backend API (Node.js + Express.js)
            │
            ▼
      PostgreSQL
```

Esta arquitectura permite mantener una separación clara de responsabilidades entre la capa de presentación, la lógica de negocio y la persistencia de datos, facilitando el mantenimiento, las pruebas y la evolución futura del sistema.
