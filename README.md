# TattooShop Backend

Backend **TattooShop**, una aplicación web para la **gestión y venta de material de tatuajes**, desarrollada con **Spring Boot**, **MySQL** y **Docker**.

---

## Características principales

- **Gestión de usuarios** con roles (`ADMIN`, `SELLER`, `USER`)
- **Gestión de productos** (crear, listar, eliminar, actualizar)
- **Pedidos y carritos de compra**
- **Autenticación con JWT**
- **Persistencia en base de datos MySQL**
- **Totalmente dockerizado**, sin necesidad de instalaciones adicionales

---

## Tecnologías utilizadas

| Tecnología | Descripción |
|-------------|-------------|
| **Java 17** | Lenguaje principal |
| **Spring Boot 3.3.5** | Framework backend |
| **Spring Security + JWT** | Autenticación y autorización |
| **Spring Data JPA / Hibernate** | Mapeo ORM y persistencia |
| **MySQL 8.0 (Docker)** | Base de datos relacional |
| **Docker Compose** | Orquestación de contenedores |
| **Maven** | Gestión de dependencias |

---

## Instalación y ejecución

> **Requisitos previos:**
> - Tener **Docker Desktop** o **Docker Engine + Compose**
> - Tener **Git**

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/Mariioo21/TFG-tattooshop
cd tattoshop-backend
````

### 2️⃣ Construir y ejecutar con Docker

```bash
docker compose up -d
```

### 3️⃣ Verificar contenedores

```bash
docker ps
```

Deberias ver algo como:

```bash
CONTAINER ID          IMAGE                          STATUS          PORTS
95db43a0873d        mysql:8.0                        healthy         3307->3306/tcp
e53c016f7a85       tattoshop-backend-backend         Up 10s          8080->8080/tcp
```

## 🌐 Acceso al backend

- **API disponible en:** http://localhost:8080

- **Base de datos MySQL accesible en:** localhost:3307

- **Usuario de base de datos:** tattooshop

- **Contraseña:** tattooshop

## Usuarios iniciales

Al levantar el contenedor por primera vez, se crean automáticamente estos usuarios:

| Rol        | Usuario | Contraseña |
|------------|---------|------------|
| **ADMIN**  | Admin   | Admin      |
| **SELLER** | Seller  | Seller     | 
| **USER**   | User    | User       | 

## Servicios (docker-compose.yml)

El proyecto levanta dos contenedores:

- **MySQL (mysql_tattoo)** → mysql:8.0 con volumen persistente

- **Backend (tattoo_backend)** → construido desde el Dockerfile

## Persistencia de datos

Los datos se guardan en un volumen de Docker llamado mysql_data, por lo que no se pierden aunque apagues los contenedores.

Si quieres reiniciar la base de datos desde cero:

```bash
docker compose down -v
```

## Comandos útiles

| Comando                                                 | Descripción |
|---------------------------------------------------------|--|
| **docker logs -f tattoo_backend**                       | Muestra los logs del backend |
| **docker exec -it mysql_tattoo mysql -u tattooshop -p** | Entra en la base de datos MySQL |
| **docker volume ls**                               | Lista los volúmenes persistentes |


## Autor

Mario Espasandín Hernández
Grado en Ingeniería de Computadores — Universidad Rey Juan Carlos
- **Personal:** [espasandinhernandez@gmail.com](mailto:espasandinhernandez@gmail.com)
- **Universitario:** [m.espasandin.2021@alumnos.urjc.es](mailto:m.espasandin.2021@alumnos.urjc.es)  
- **GitHub:** [github.com/Mariioo21](https://github.com/Mariioo21)





