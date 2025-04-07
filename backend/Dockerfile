# Dockerfile para el backend de ApruebaYa
FROM node:18-alpine

WORKDIR /app

# Instalar dependencias necesarias para Tesseract.js y compilación de paquetes nativos
RUN apk add --no-cache tesseract-ocr python3 make g++ build-base openssl

# Copiar archivos de configuración
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Crear directorio para seeds
RUN mkdir -p /app/database/seeds

# Generar cliente Prisma
RUN npx prisma generate

# Modificar permisos del script de inicialización
RUN chmod +x init.sh

# Exponer el puerto
EXPOSE 3001

# Comando para iniciar la aplicación usando el script de inicialización
CMD ["./init.sh"]
