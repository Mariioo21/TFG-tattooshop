# ============ BUILD ============ 
FROM node:20 AS build
WORKDIR /app

# 1) Instalar dependencias
COPY package*.json ./
RUN npm install

# 2) Copiar el resto del código y hacer build de producción
COPY . .
RUN npm run build   # CRA genera la carpeta /build

# ============ RUNTIME ============ 
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# 3) Copiar el build estático generado por CRA
COPY --from=build /app/build ./

# 4) Servir por el puerto 80 dentro del contenedor
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
