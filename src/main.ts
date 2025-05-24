import { webcrypto } from 'node:crypto';
if (!global.crypto) {
    global.crypto = webcrypto as any;
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as YAML from 'yaml';
import { writeFileSync } from 'fs';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        cors: true,
        logger: process.env.NODE_ENV === 'production'
            ? ['error', 'warn']
            : ['error', 'warn', 'log', 'debug']
    });

    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
    }));

    if (process.env.NODE_ENV !== 'production') {
        const config = new DocumentBuilder()
            .setTitle('GeoVacas API')
            .setDescription('Documentación relacionada a los endpoints de la API')
            .setVersion('1.0')
            .build();
        const document = SwaggerModule.createDocument(app, config);
        const yamlString = YAML.stringify(document);
        writeFileSync('/tmp/GeoVacasEndpoints.yaml', yamlString);
        SwaggerModule.setup('api', app, document);
    }

    await app.listen(process.env.PORT || 3000, '0.0.0.0');
}

bootstrap();

