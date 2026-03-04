# TattooShop

Aplicacion web desarrollada como **TFG** para la **gestion y venta online de material de tatuajes**.  
El proyecto incluye una arquitectura separada en **frontend** y **backend**, con autenticacion por roles, catalogo de productos, carrito, pedidos y paneles de gestion para administradores y vendedores.

---

## Descripción general

TattooShop esta pensada como una plataforma de comercio electrónico orientada a la venta de productos de tatuaje, como tintas, agujas, cartuchos, guantes, stencils y otros accesorios.

La aplicacion permite:

- navegar por un catalogo de productos
- registrarse e iniciar sesion
- comprar productos y gestionar pedidos
- administrar categorias, usuarios y productos como Administrador
- permitir a vendedores gestionar sus propios productos (Añadir, Editar, Eliminar, etc)

---

## Tecnologias utilizadas

### Backend

| Tecnologia | Uso |
|------------|-----|
| **Java 17** | Lenguaje principal |
| **Spring Boot 3.3.5** | Framework backend |
| **Spring Security** | Seguridad y control de acceso |
| **JWT** | Autenticacion y autorizacion |
| **Spring Data JPA / Hibernate** | Persistencia y ORM |
| **MySQL 8** | Base de datos principal |
| **Maven** | Gestion de dependencias |

### Frontend

| Tecnologia | Uso |
|------------|-----|
| **React 18** | Interfaz de usuario |
| **React Router DOM** | Navegación entre vistas |
| **Axios** | Comunicación con la API |
| **Lucide React** | Iconografía |
| **CSS** | Maquetación y estilos personalizados |

### Infraestructura

| Tecnologia | Uso |
|------------|-----|
| **Docker** | Contenerización |
| **Docker Compose** | Orquestación de servicios |
| **Nginx** | Servido del frontend en contenedor |

---

## Estructura del proyecto

```text
TFG-tattooshop/
├── docker-compose.yml
├── iniciar.bat
├── detener.bat
├── README.md
├── tattoshop-frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
└── tattoshop-backend/
    └── tattoshop-backend/
        ├── src/main/java/
        └── src/main/resources/
```

---

## Arquitectura

El proyecto sigue una arquitectura cliente-servidor:

- **Frontend React**:
  - gestiona la interfaz
  - controla la navegación
  - consume la API REST
  - adapta la interfaz segun el rol autenticado

- **Backend Spring Boot**:
  - expone endpoints REST
  - valida usuarios y permisos
  - genera y valida tokens JWT
  - gestiona entidades como usuarios, productos, categorias, carrito y pedidos

- **Base de datos MySQL**:
  - almacena usuarios, productos, categorias, carritos y pedidos

---

## Roles del sistema

La aplicacion trabaja con tres roles principales:

### ADMIN

Puede acceder a:

- gestión de usuarios
- gestión de productos
- gestión de categorias
- catálogo general

### SELLER

Puede acceder a:

- mis productos
- añadir producto
- editar producto
- eliminar producto
- catálogo general

### USER

Puede acceder a:

- catálogo
- detalle de producto
- carrito
- resumen de compra
- envíos pendientes
- historial de pedidos
- mi cuenta

---

## Funcionalidades principales

### Autenticación

- inicio de sesión
- registro de nuevos usuarios
- autenticacion mediante JWT
- interfaz adaptada segun el rol autenticado

### Catálogo y compra

- listado de productos
- vista en grid y lista
- filtro por categorias
- filtro por precio mínimo y máximo
- búsqueda de productos
- detalle individual de producto
- selección de cantidad
- añadir al carrito

### Carrito y pedidos

- ver carrito actual
- actualizar cantidad
- eliminar productos del carrito
- vaciar carrito
- finalizar compra
- ver resumen del pedido
- consultar envíos pendientes
- consultar historial de pedidos

### Gestión de administrador

- gestionar usuarios
- gestionar productos
- gestionar categorias

### Gestión de vendedor

- ver sus propios productos
- añadir productos nuevos
- editar productos existentes
- eliminar productos
- buscador en editar y eliminar producto para localizar articulos rapidamente

---

## Rutas principales del frontend

Estas son las rutas principales definidas actualmente en la aplicacion:

### Públicas

- `/login`
- `/register`

### Compartidas

- `/catalog`
- `/product/:id`

### Seller

- `/my-products`
- `/add-product`
- `/edit-product`
- `/delete-product`

### Admin

- `/manage-users`
- `/manage-products`
- `/manage-categories`

### User

- `/account`
- `/cart`
- `/order-summary`
- `/orders`
- `/pendingOrders`

---

## Mejoras visuales realizadas

Durante el desarrollo se ha realizado una revisión completa de la interfaz con una linea visual unificada basada en la paleta, de más ocuro a más claro:

- `#2A2438`
- `#352F44`
- `#5C5470`
- `#DBD8E3`

Entre las mejoras aplicadas destacan:

- rediseño completo de login y registro
- animación entre login y registro
- iconos con la librería de iconos de `lucide-react`
- rediseño del header segun el rol
- rediseño del catálogo y del detalle de producto
- rediseño de paneles de administrador
- rediseño de paneles de vendedor
- rediseño de carrito, cuenta y pedidos
- mejora del branding con favicon y logotipos personalizados

---

## Instalación y ejecución

### Requisitos previos

- **Docker Desktop** instalado
- **Git**
- opcionalmente **Node.js** si se quiere ejecutar el frontend fuera de Docker
- opcionalmente **Java 17** y **Maven** si se quiere ejecutar el backend fuera de Docker

---

## Ejecución con Docker

Desde la raíz del proyecto:

```bash
docker compose up -d --build
```

O usando el script incluido:

```bash
.\iniciar
```

Para detener los contenedores:

```bash
docker compose down
```

O usando el script incluido:

```bash
.\detener
```

### Servicios levantados

- **Frontend**: `http://localhost:3000`
- **Backend**: `http://localhost:8080`
- **MySQL**: `localhost:3307`

---

## Ejecución manual en desarrollo

### Frontend

Ruta:

```bash
cd tattoshop-frontend
```

Instalar dependencias:

```bash
npm install
```

Iniciar en desarrollo:

```bash
npm start
```

### Backend

Ruta:

```bash
cd tattoshop-backend/tattoshop-backend
```

Ejecutar con Maven Wrapper en Windows:

```bash
.\mvnw.cmd spring-boot:run
```

---

## Configuración de base de datos

En Docker, la base de datos se levanta con:

- **Host**: `localhost`
- **Puerto**: `3307`
- **Base de datos**: `tattoo_shop`
- **Usuario**: `tattooshop`
- **Contraseña**: `tattooshop`

Los datos se almacenan en el volumen:

```bash
mysql_data
```

Para reiniciar la base de datos desde cero:

```bash
docker compose down -v
```

---

## Usuarios iniciales

Al levantar el proyecto por primera vez, se crean usuarios iniciales:

| Rol | Usuario | Contraseña |
|-----|---------|------------|
| **ADMIN** | `Admin` | `Admin` |
| **SELLER** | `Seller` | `Seller` |
| **USER** | `User` | `User` |

---

## Dependencias relevantes

### Frontend

- `react`
- `react-router-dom`
- `axios`
- `lucide-react`

### Backend

- `spring-boot-starter-web`
- `spring-boot-starter-data-jpa`
- `spring-boot-starter-security`
- `spring-boot-starter-validation`
- `jjwt`
- `mysql-connector-j`

---

## Comandos utiles

### Docker

```bash
docker ps
docker logs -f tattoo_backend
docker logs -f tattoo_frontend
docker logs -f mysql_tattoo
docker compose down -v
```

### Frontend

```bash
npm install
npm start
npm run build
```

### Backend

```bash
.\mvnw.cmd spring-boot:run
.\mvnw.cmd test
```

---

## Dashboard de administrador

Se ha incorporado una nueva vista de administracion accesible desde:

```bash
/admin-dashboard
```

Este panel funciona como pantalla principal para el rol **ADMIN** y muestra un resumen general del estado de la plataforma.

### Informacion mostrada

- usuarios totales
- vendedores registrados
- clientes registrados
- productos totales
- categorias totales
- pedidos totales
- pedidos pendientes
- pedidos entregados

### Funcionalidades incluidas

- tarjetas con metricas generales de la tienda
- panel de resumen del catalogo, usuarios y pedidos
- accesos rapidos a:
  - gestion de usuarios
  - gestion de productos
  - gestion de categorias
  - catalogo general
- integracion visual con la misma paleta y estilo del resto del proyecto

### Comportamiento

- cuando un usuario con rol **ADMIN** inicia sesion, la aplicacion redirige automaticamente al dashboard en lugar de al catalogo
- si el administrador entra por la ruta raiz `/`, tambien se redirige al dashboard

### Backend asociado

Para alimentar esta vista se ha añadido un endpoint especifico:

```bash
GET /api/admin/dashboard
```

Este endpoint devuelve las metricas agregadas necesarias para construir el panel de administracion.

---

## Autor

**Mario Espasandín Hernández**  
Grado en Ingeniería de Computadores - Universidad Rey Juan Carlos

- Personal: [espasandinhernandez@gmail.com](mailto:espasandinhernandez@gmail.com)
- Universitario: [m.espasandin.2021@alumnos.urjc.es](mailto:m.espasandin.2021@alumnos.urjc.es)
- GitHub: [github.com/Mariioo21](https://github.com/Mariioo21)
