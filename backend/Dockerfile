FROM node:20-slim

# Instalar Python + pip + venv
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-venv python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Crear venv y usarlo por defecto
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Instalar librerías de Python
RUN pip install --no-cache-dir --upgrade pip setuptools wheel
RUN pip install --no-cache-dir pandas numpy xlrd==2.0.1 openpyxl

WORKDIR /app

# Instalar deps de Node (solo prod)
COPY package*.json ./
RUN npm install --omit=dev

# Copiar el código
COPY . .

ENV NODE_ENV=production
EXPOSE 3000

# Render ejecuta esto
CMD ["npm", "start"]



