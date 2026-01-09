FROM node:20

# Python + venv + pip
RUN apt-get update && apt-get install -y \
    python3 python3-venv python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Crear venv
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Instalar librerías (ahora sí pip funciona dentro del venv)
RUN pip install --no-cache-dir --upgrade pip setuptools wheel
RUN pip install --no-cache-dir pandas numpy xlrd==2.0.1 openpyxl

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
CMD ["node", "src/server.js"]



