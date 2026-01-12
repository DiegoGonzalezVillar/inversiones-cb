-- ============================
-- LIMPIEZA (solo para desarrollo)
-- ============================

DROP TABLE IF EXISTS auditoria_logs CASCADE;
DROP TABLE IF EXISTS pagos CASCADE;
DROP TABLE IF EXISTS facturas CASCADE;
DROP TABLE IF EXISTS proyectos CASCADE;
DROP TABLE IF EXISTS tmp_empresas CASCADE;
DROP TABLE IF EXISTS empresas CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

DROP TYPE IF EXISTS estado_proyecto;
DROP TYPE IF EXISTS estado_factura;
DROP TYPE IF EXISTS moneda_tipo;

-- ============================
-- ENUMS
-- ============================

CREATE TYPE estado_proyecto AS ENUM (
  'INGRESADO',
  'APROBADO',
  'OBSERVADO',
  'FINALIZADO'
);

CREATE TYPE estado_factura AS ENUM (
  'BORRADOR',
  'FACTURADO',
  'ANULADO'
);

CREATE TYPE moneda_tipo AS ENUM (
  'UYU',
  'USD'
);

-- ============================
-- USUARIOS (empleados)
-- ============================

CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nombre TEXT NOT NULL,
  rol VARCHAR(20) NOT NULL DEFAULT 'user',
  creado_en TIMESTAMP DEFAULT now()
);

-- ============================
-- EMPRESAS
-- ============================

CREATE TABLE empresas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  rut VARCHAR(20),
  email VARCHAR(255)
);

-- ============================
-- PROYECTOS / EXPEDIENTES
-- ============================

CREATE TABLE proyectos (
  id SERIAL PRIMARY KEY,
  empresa_id INT NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  fecha_ingreso DATE NOT NULL,
  numero_expediente VARCHAR(50) NOT NULL,
  estado estado_proyecto NOT NULL,
  ministerio VARCHAR(150),
  decreto VARCHAR(150),
  creado_en TIMESTAMP DEFAULT now(),
  actualizado_en TIMESTAMP DEFAULT now()
);

-- ============================
-- FACTURAS
-- ============================

CREATE TABLE facturas (
  id SERIAL PRIMARY KEY,
  proyecto_id INT NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE,
  fecha DATE NOT NULL,
  estado estado_factura NOT NULL,
  tipo VARCHAR(20),
  serie VARCHAR(10),
  numero INT,
  numero_interno INT,
  cliente_nombre VARCHAR(255),
  moneda moneda_tipo NOT NULL,
  tipo_cambio NUMERIC(10,3),
  neto NUMERIC(14,2) NOT NULL,
  iva NUMERIC(14,2) NOT NULL,
  total NUMERIC(14,2) NOT NULL,
  cfe_numero INT,
  creado_en TIMESTAMP DEFAULT now()
);

-- ============================
-- PAGOS
-- ============================

CREATE TABLE pagos (
  id SERIAL PRIMARY KEY,
  factura_id INT NOT NULL REFERENCES facturas(id) ON DELETE CASCADE,
  fecha DATE NOT NULL,
  monto NUMERIC(14,2) NOT NULL,
  moneda moneda_tipo NOT NULL,
  tipo_cambio NUMERIC(10,3),
  metodo VARCHAR(50),
  creado_en TIMESTAMP DEFAULT now()
);

-- ============================
-- AUDITORIA
-- ============================

CREATE TABLE auditoria_logs (
  id SERIAL PRIMARY KEY,
  usuario_id INT REFERENCES usuarios(id) ON DELETE SET NULL,
  accion VARCHAR(20) NOT NULL,
  entidad VARCHAR(50) NOT NULL,
  entidad_id INT,
  datos_antes JSONB,
  datos_despues JSONB,
  creado_en TIMESTAMP DEFAULT now()
);

-- ============================
-- TABLA TEMPORAL (importación / staging)
-- ============================

CREATE TABLE tmp_empresas (
  nombre TEXT,
  rut TEXT,
  email TEXT
);

-- ============================
-- ÍNDICES
-- ============================

-- Único por nombre, case-insensitive
CREATE UNIQUE INDEX idx_empresas_nombre_unico
  ON empresas (lower(nombre));

CREATE INDEX idx_proyectos_empresa
  ON proyectos(empresa_id);

CREATE INDEX idx_facturas_proyecto
  ON facturas(proyecto_id);

CREATE INDEX idx_facturas_estado
  ON facturas(estado);

CREATE INDEX idx_pagos_factura
  ON pagos(factura_id);

CREATE INDEX idx_auditoria_entidad
  ON auditoria_logs(entidad, entidad_id);
