# TattooShop

TattooShop es una aplicación web de comercio electrónico desarrollada como Trabajo Fin de Grado para la gestión y venta online de material de tatuaje. El proyecto se plantea como una plataforma especializada en este sector, con una arquitectura separada en frontend y backend, autenticación por roles y funcionalidades diferenciadas para clientes, vendedores y administradores.

## Descripción del proyecto

La aplicación permite centralizar en un mismo sistema la consulta del catálogo, la gestión de productos, el proceso de compra y el control general de la plataforma.

El sistema está orientado a tres perfiles principales:

- Cliente: consulta productos, gestiona el carrito, realiza pedidos y revisa su estado.
- Vendedor: publica y administra sus propios productos.
- Administrador: supervisa el sistema, gestiona usuarios, productos y categorías, y consulta métricas generales.

Desde el punto de vista funcional, TattooShop cubre los principales flujos de una tienda online especializada:

- registro e inicio de sesión
- autenticación y autorización mediante JWT
- catálogo de productos con búsqueda y filtros
- detalle de producto
- carrito de compra
- creación y consulta de pedidos
- gestión de productos por parte del vendedor
- gestión de usuarios, productos y categorías por parte del administrador
- panel de administración con métricas generales

## Objetivo

El objetivo del proyecto es desarrollar una aplicación web full-stack basada en una arquitectura cliente-servidor que permita gestionar y comercializar productos de tatuaje mediante una interfaz clara y diferenciada según el rol del usuario autenticado.

## Arquitectura

TattooShop sigue una arquitectura cliente-servidor compuesta por tres bloques principales:

- Frontend en React, encargado de la interfaz y de la navegación de la aplicación.
- Backend en Spring Boot, responsable de la lógica de negocio, la seguridad y la exposición de la API REST.
- Base de datos MySQL, donde se almacenan usuarios, productos, categorías, carritos y pedidos.

La comunicación entre frontend y backend se realiza mediante peticiones HTTP. La autenticación se basa en tokens JWT, lo que permite restringir el acceso a determinadas operaciones según el rol del usuario.

## Tecnologías utilizadas

### Backend

- Java
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- JWT
- Maven

### Frontend

- React
- React Router DOM
- Axios
- Lucide React
- CSS

### Persistencia e infraestructura

- MySQL
- Docker
- Docker Compose
- Nginx

## Estructura del repositorio

```text
TFG-tattooshop/
|-- docker-compose.yml
|-- iniciar.bat
|-- detener.bat
|-- README.md
|-- tattoshop-frontend/
|   |-- public/
|   |-- src/
|   |   |-- components/
|   |   |-- pages/
|   |   |-- services/
|   |   `-- styles/
`-- tattoshop-backend/
    `-- tattoshop-backend/
        |-- src/main/java/
        |-- src/main/resources/
        `-- pom.xml
```

## Funcionalidades por rol

### Cliente

- registrarse e iniciar sesión
- consultar el catálogo
- buscar, filtrar y ordenar productos
- acceder al detalle de cada producto
- añadir productos al carrito
- modificar cantidades y eliminar productos del carrito
- finalizar compras
- consultar pedidos pendientes
- consultar historial de pedidos
- revisar la información de su cuenta

### Vendedor

- consultar sus productos publicados
- añadir nuevos productos
- editar productos existentes
- eliminar productos

### Administrador

- acceder al panel principal de administración
- consultar métricas generales del sistema
- gestionar usuarios
- gestionar productos
- gestionar categorías

## Rutas principales del frontend

### Públicas

- `/login`
- `/register`

### Compartidas

- `/`
- `/catalog`
- `/product/:id`

### Cliente

- `/account`
- `/cart`
- `/order-summary`
- `/orders`
- `/pendingOrders`

### Vendedor

- `/my-products`
- `/add-product`
- `/edit-product`
- `/delete-product`

### Administrador

- `/admin-dashboard`
- `/manage-users`
- `/manage-products`
- `/manage-categories`

## Backend y organización interna

El backend está organizado en capas, separando responsabilidades entre controladores, servicios, repositorios, entidades y configuración de seguridad. Entre las áreas principales del sistema se encuentran:

- autenticación de usuarios
- gestión de productos
- gestión de categorías
- carrito de compra
- pedidos
- panel de administración

Las entidades principales del dominio son:

- `User`
- `Product`
- `Category`
- `Cart`
- `CartItem`
- `Order`
- `OrderItem`

## Usuarios de prueba

Al inicializar la aplicación con una base de datos vacía, el backend crea usuarios de prueba para los tres roles principales:

| Rol | Usuario | Contraseña |
| --- | --- | --- |
| Administrador | `Admin` | `Admin` |
| Vendedor | `Seller` | `Seller` |
| Cliente | `User` | `User` |

## Requisitos previos

Para ejecutar el proyecto en local se recomienda disponer de:

- Docker Desktop
- un navegador web actualizado

Si se quiere trabajar fuera de Docker, también será necesario disponer de:

- Node.js y npm
- Java
- Maven o Maven Wrapper

## Ejecución recomendada con Docker

La forma más sencilla y coherente de ejecutar el proyecto es mediante Docker Compose.

Desde la raíz del repositorio:

```bash
docker compose up -d --build
```

O bien mediante el script incluido:

```bash
.\iniciar.bat
```

Para detener los servicios:

```bash
docker compose down
```

O bien:

```bash
.\detener.bat
```

## Servicios disponibles

Una vez levantado el entorno, la aplicación queda accesible en:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`
- MySQL: `localhost:3307`

## Configuración de base de datos en Docker

La configuración definida en `docker-compose.yml` expone la base de datos con los siguientes valores:

- host: `localhost`
- puerto: `3307`
- base de datos: `tattoo_shop`
- usuario: `tattooshop`
- contraseña: `tattooshop`

El volumen persistente utilizado por MySQL es:

```bash
mysql_data
```

Si se desea reiniciar completamente la base de datos:

```bash
docker compose down -v
```

## Ejecución manual en desarrollo

El repositorio incluye estructura para ejecutar frontend y backend por separado, pero la configuración actual está pensada principalmente para su uso con Docker Compose. Por eso, la vía recomendada para revisar el proyecto o ponerlo en marcha es la ejecución con contenedores.

### Frontend

```bash
cd tattoshop-frontend
npm install
npm start
```

### Backend

```bash
cd tattoshop-backend/tattoshop-backend
.\mvnw.cmd spring-boot:run
```

Si se ejecuta el backend fuera de Docker, puede ser necesario adaptar la configuración de conexión a base de datos del archivo `application.yml` al entorno local disponible.

## Pruebas y validación

De acuerdo con el planteamiento del TFG, la validación del sistema se ha centrado principalmente en pruebas funcionales y de integración ejecutadas sobre el entorno completo de la aplicación.

Entre los flujos validados se encuentran:

- registro de usuarios
- inicio de sesión
- autenticación por roles
- consulta del catálogo
- búsqueda, filtrado y ordenación de productos
- gestión del carrito
- realización de pedidos
- consulta de pedidos pendientes e historial
- gestión de productos por parte del vendedor
- gestión de usuarios, productos y categorías por parte del administrador

En el estado actual del repositorio, el frontend genera correctamente el build de producción. La ejecución de tests automáticos en backend depende de disponer de una base de datos accesible con la configuración activa del proyecto.

## Estado del proyecto

TattooShop constituye una base funcional y organizada para una plataforma e-commerce especializada en material de tatuaje. El proyecto cubre la autenticación, la diferenciación por roles, la gestión del catálogo, el carrito, los pedidos y la administración del sistema.

Como posibles líneas de mejora futuras, la memoria del TFG plantea:

- integración con una pasarela de pago real
- mejora del sistema de envíos y trazabilidad
- ampliación de funcionalidades del panel de administración
- refuerzo de pruebas automatizadas
- despliegue más cercano a un entorno real de producción

## Autor

Mario Espasandín Hernández  
Grado en Ingeniería de Computadores  
Universidad Rey Juan Carlos

- Correo personal: [espasandinhernandez@gmail.com](mailto:espasandinhernandez@gmail.com)
- Correo universitario: [m.espasandin.2021@alumnos.urjc.es](mailto:m.espasandin.2021@alumnos.urjc.es)
- GitHub: [github.com/Mariioo21](https://github.com/Mariioo21)
