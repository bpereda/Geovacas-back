DROP SCHEMA IF EXISTS geovacas;
DROP SCHEMA IF EXISTS geo_vacas_test;
CREATE SCHEMA IF NOT EXISTS geovacas;
CREATE SCHEMA IF NOT EXISTS geo_vacas_test;

CREATE EXTENSION IF NOT EXISTS postgis;

SET search_path TO geovacas, geo_vacas_test, public;

CREATE TABLE geovacas.cattle
(
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(255),
    device_id  TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    location_id INTEGER UNIQUE,
    CONSTRAINT LOCATION_FK FOREIGN KEY (location_id) REFERENCES cattle_location(id) ON DELETE SET NULL
);

CREATE TABLE geovacas.virtual_zones
(
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255)            NOT NULL,
    description TEXT,
    geom        GEOMETRY(POLYGON, 4326) NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE geovacas.cattle_location
(
    id SERIAL PRIMARY KEY,
    position geometry(POINT, 4326) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE geovacas.infractions
(
    id        SERIAL PRIMARY KEY,
    cattle_id INT REFERENCES geovacas.cattle (id) ON DELETE CASCADE,
    zone_id   INT                   REFERENCES geovacas.virtual_zones (id) ON DELETE SET NULL,
    timestamp TIMESTAMPTZ           NOT NULL DEFAULT now(),
    location  GEOMETRY(POINT, 4326) NOT NULL,
    reason    TEXT                           DEFAULT 'OUT OF VIRTUAL ZONE'
);

CREATE TABLE geovacas.users
(
    id            SERIAL PRIMARY KEY,
    name          TEXT        NOT NULL,
    username      TEXT UNIQUE NOT NULL,
    password_hash TEXT        NOT NULL,
    created_at    TIMESTAMPTZ DEFAULT now(),
    active        BOOLEAN     DEFAULT TRUE
);

CREATE INDEX idx_zones_geom ON geovacas.virtual_zones USING GIST (geom);
CREATE INDEX idx_infractions_location ON geovacas.infractions USING GIST (location);
CREATE INDEX idx_infractions_date ON geovacas.infractions (timestamp);
CREATE INDEX idx_infractions_cattle ON geovacas.infractions (cattle_id);

CREATE TABLE geo_vacas_test.cattle
(
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(255),
    device_id  TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    location_id INTEGER UNIQUE,
    CONSTRAINT LOCATION_FK FOREIGN KEY (location_id) REFERENCES cattle_location(id) ON DELETE SET NULL
);

CREATE TABLE geo_vacas_test.virtual_zones
(
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255)            NOT NULL,
    description TEXT,
    geom        GEOMETRY(POLYGON, 4326) NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE geo_vacas_test.cattle_location
(
    id SERIAL PRIMARY KEY,
    position geometry(POINT, 4326) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE geo_vacas_test.infractions
(
    id        SERIAL PRIMARY KEY,
    cattle_id INT REFERENCES geo_vacas_test.cattle (id) ON DELETE CASCADE,
    zone_id   INT                   REFERENCES geo_vacas_test.virtual_zones (id) ON DELETE SET NULL,
    timestamp TIMESTAMPTZ           NOT NULL DEFAULT now(),
    location  GEOMETRY(POINT, 4326) NOT NULL,
    reason    TEXT                           DEFAULT 'OUT OF VIRTUAL ZONE'
);

CREATE TABLE geo_vacas_test.users
(
    id            SERIAL PRIMARY KEY,
    name          TEXT        NOT NULL,
    username      TEXT UNIQUE NOT NULL,
    password_hash TEXT        NOT NULL,
    created_at    TIMESTAMPTZ DEFAULT now(),
    active        BOOLEAN     DEFAULT TRUE
);

CREATE INDEX idx_zones_geom ON geo_vacas_test.virtual_zones USING GIST (geom);
CREATE INDEX idx_infractions_location ON geo_vacas_test.infractions USING GIST (location);
CREATE INDEX idx_infractions_date ON geo_vacas_test.infractions (timestamp);
CREATE INDEX idx_infractions_cattle ON geo_vacas_test.infractions (cattle_id);