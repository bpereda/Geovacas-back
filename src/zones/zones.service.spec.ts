import { Test, TestingModule } from '@nestjs/testing';
import { ZonesService } from './zones.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getTypeOrmConfig } from '../database/typeorm.config';
import { ZonesModule } from './zones.module';
import { Zone } from './zone.entity';

describe('ZonesService', () => {
    let service: ZonesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ZonesService],
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
        }).compile();

        service = module.get<ZonesService>(ZonesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
