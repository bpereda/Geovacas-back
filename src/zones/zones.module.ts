import { Module } from '@nestjs/common';
import { ZonesController } from './zones.controller';
import { ZonesService } from './zones.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Zone } from './zone.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Zone])],
    controllers: [ZonesController],
    providers: [ZonesService],
})
export class ZonesModule {}
