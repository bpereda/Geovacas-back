import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ZonesModule } from './zones.module';
import * as request from 'supertest';
import { getTypeOrmConfig } from '../database/typeorm.config';
import { ZonesController } from './zones.controller';
import { DataSource } from 'typeorm';
import { Zone } from './zone.entity';
import { ZonesService } from './zones.service';

describe('ZonesController', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            controllers: [ZonesController],
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath: `.env.${process.env.NODE_ENV}.local`,
                }),
                TypeOrmModule.forRootAsync({
                    imports: [ConfigModule],
                    inject: [ConfigService],
                    useFactory: getTypeOrmConfig,
                }),
                ZonesModule,
                TypeOrmModule.forFeature([Zone]),
            ],
            providers: [ZonesService],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('should create a zone', async () => {
        const dto = {
            name: 'Test Zone',
            coordinates: [
                [-34.6037, -58.3816],
                [-34.603, -58.38],
                [-34.604, -58.379],
            ],
            description: 'This zone will be defined as a testing zone',
        };

        const res = await request(app.getHttpServer())
            .post('/zones/new-zone')
            .send(dto)
            .expect(201);

        expect(res.body).toHaveProperty('id');
    });

    it('should return an array of zones with valid GeoJSON', async () => {
        const response = await request(app.getHttpServer())
            .get('/zones')
            .expect(200);

        expect(Array.isArray(response.body)).toBe(true);

        if (response.body.length > 0) {
            const zone = response.body[0];
            expect(zone).toHaveProperty('id');
            expect(zone).toHaveProperty('name');
            expect(zone).toHaveProperty('geom');
            expect(zone.geom.type).toBe('Polygon');
            expect(Array.isArray(zone.geom.coordinates)).toBe(true);
        }
    });

    it('should modify a zone', async () => {
        const updateDto = {
            name: 'Updated Zone',
            coordinates: [
                [-34.6037, -58.3816],
                [-34.603, -58.38],
                [-34.604, -58.379],
            ],
            description: 'Updated description'
        };
    
        const response = await request(app.getHttpServer())
            .patch('/zones/1')  
            .send(updateDto)
            .expect(200);
    
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe(updateDto.name);
        expect(response.body.description).toBe(updateDto.description);
    });
});
