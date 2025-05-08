import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZonesModule } from './zones/zones.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getTypeOrmConfig } from './database/typeorm.config';
import { DataSource } from 'typeorm';
import { CattleModule } from './cattle/cattle.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env.${process.env.NODE_ENV}.local`,
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: getTypeOrmConfig,
        }),
        UsersModule,
        ZonesModule,
        CattleModule,
    ],
})
export class AppModule {
    constructor(private dataSource: DataSource) {}
}
