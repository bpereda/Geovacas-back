<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# GeoVacasProject - Backend

## Descripción

App server, desarrollado con NestJS. Provee los endpoints necesarios para la creación de cercos virtuales,
la ubicación en tiempo real del ganado, la gerencia de usuarios y del ganado.

## Setup de desarrollo

### Base de Datos

El script para la creación de las tablas de la base de datos, junto con la base de datos, están en el directorio
``postgres-docker``. Primero, definir la contraseña de la base de datos en el archivo ``docker-compose.yaml``, Luego,
ejecutar:

```bash
$ cd postgres-docker
$ docker compose up -d
```

Abrir una consola y ejecutar el contenido de ``script.sql``.

### Entornos

En la raíz del proyecto, crear ``.env``, ``.env.development.local``, ``env.test.local``. Cada uno de esos
archivos debe tener las siguientes variables:

```text
NODE_ENV={el entorno correspondiente}
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS={la contraseña definida en docker-compose.yaml}
DB_NAME=postgres
DB_SCHEMA={el schema, geovacas para desarrollo, geo_vacas_test para testing}
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
