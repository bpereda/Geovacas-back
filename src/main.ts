import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as YAML from 'yaml';
import { writeFileSync } from 'fs';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });
    app.use((req, res, next) => {
        console.log(`[${req.method}] ${req.originalUrl}`);
        next();
    });
    const config = new DocumentBuilder()
        .setTitle('GeoVacas API')
        .setDescription('Documentación relacionada a los endpoints de la API')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    const yamlString = YAML.stringify(document);
    writeFileSync('./GeoVacasEndpoints.yaml', yamlString);
    SwaggerModule.setup('api', app, document);
    await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}

bootstrap();
