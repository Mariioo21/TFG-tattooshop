# TFG - Tattoo Shop (Marketplace de material para tatuajes)

## Entidades principales

### Usuario
- id (número)
- username (texto, único)
- email (texto, único)
- password (texto, cifrado)
- rol (USER, SELLER, ADMIN)

### Categoría
- id (número)
- nombre (texto, ej: "Máquinas", "Tintas", "Agujas", "Accesorios")

### Producto
- id (número)
- nombre (texto)
- descripción (texto)
- precio (número decimal)
- imagen_url (texto, opcional)
- categoría (relación con Categoría)
- vendedor (relación con Usuario, rol SELLER)

### Carrito
- id (número)
- usuario (relación con Usuario)

### Item del carrito
- id (número)
- carrito (relación con Carrito)
- producto (relación con Producto)
- cantidad (número entero)

### Pedido
- id (número)
- usuario (relación con Usuario)
- estado (PENDIENTE, ENTREGADO)
- fecha de creación (fecha y hora)
- fecha estimada de entrega (solo fecha)

### Item del pedido
- id (número)
- pedido (relación con Pedido)
- producto (relación con Producto)
- cantidad (número entero)
- precio en el momento de la compra (decimal)

## Relaciones clave
- Un **Usuario** tiene **un Carrito**.
- Un **Carrito** tiene **muchos Items**.
- Un **Usuario** puede tener **muchos Pedidos**.
- Un **Pedido** tiene **muchos Items**.
- Un **Producto** pertenece a **una Categoría**.
- Un **Producto** es creado por **un Usuario (SELLER)**.

## Requisitos funcionales
1. Un usuario debe poder registrarse e iniciar sesión.
2. Solo los usuarios logueados pueden ver el catálogo de productos.
3. Los usuarios pueden buscar productos por nombre o descripción.
4. Los usuarios pueden añadir productos al carrito y ver su contenido.
5. Los usuarios pueden crear un pedido desde su carrito.
6. Al crear un pedido, se genera una fecha estimada de entrega (1 a 3 días desde hoy).
7. Los vendedores pueden crear, editar y eliminar sus propios productos.
8. Los administradores pueden ver todos los usuarios y productos, y gestionar categorías.
9. Todos los datos se almacenan en una base de datos MySQL.
10. La aplicación se dockerizará con Docker Compose.