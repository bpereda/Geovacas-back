import { webcrypto } from 'node:crypto';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as YAML from 'yaml';
import { writeFileSync } from 'fs';
import { ValidationPipe, Logger } from '@nestjs/common';
import { config } from 'dotenv';

// Load environment variables
config();

// Initialize crypto for TypeORM
if (typeof globalThis.crypto === 'undefined') {
    // @ts-expect-error - webcrypto is compatible with the expected Crypto interface
    globalThis.crypto = webcrypto;
}

async function bootstrap() {
    const logger = new Logger('Bootstrap');
    try {
        // Log environment variables for debugging (excluding sensitive data)
        logger.debug(`Environment: ${process.env.NODE_ENV}`);
        logger.debug(`AWS Region: ${process.env.AWS_REGION}`);
        logger.debug(`DB Host: ${process.env.DB_HOST}`);

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
    } catch (error) {
        logger.error('Error during application bootstrap', error);
        process.exit(1);
    }
}

bootstrap();

