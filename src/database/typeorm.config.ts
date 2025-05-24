import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Zone } from '../zones/zone.entity';
import { Cattle } from '../cattle/entity/cattle.entity';
import { webcrypto } from 'node:crypto';

// Ensure crypto is available globally
if (!global.crypto) {
    global.crypto = webcrypto as any;
}

export const getTypeOrmConfig = async (
    configService: ConfigService,
): Promise<TypeOrmModuleOptions> => ({
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USER'),
    password: configService.get('DB_PASS'),
    database: configService.get('DB_NAME'),
    schema: configService.get('DB_SCHEMA'),
    autoLoadEntities: true,
    entities: [Zone, Cattle],
    synchronize: true,
});
