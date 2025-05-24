import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZonesModule } from './zones/zones.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getTypeOrmConfig } from './database/typeorm.config';
import { DataSource } from 'typeorm';
import { CattleModule } from './cattle/cattle.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            // Only load .env file in development
            envFilePath: process.env.NODE_ENV === 'development' ? '.env' : undefined,
            // Always load environment variables from the system
            ignoreEnvFile: process.env.NODE_ENV === 'production',
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: getTypeOrmConfig,
        }),
        UsersModule,
        ZonesModule,
        CattleModule,
        AuthModule,
    ],
})
export class AppModule {
    constructor(private dataSource: DataSource) {}
}
