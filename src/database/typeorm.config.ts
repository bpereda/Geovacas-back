import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Zone } from '../zones/zone.entity';
import { Cattle } from '../cattle/entity/cattle.entity';
import { webcrypto } from 'node:crypto';

try {
    if (typeof globalThis.crypto === 'undefined') {
        // @ts-expect-error - webcrypto is compatible with the expected Crypto interface
        globalThis.crypto = webcrypto;
    }
} catch (err) {
    if (err instanceof Error) {
        console.warn('Unable to assign globalThis.crypto:', err.message);
    }
}

export const getTypeOrmConfig = (
    configService: ConfigService,
): TypeOrmModuleOptions => ({
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
