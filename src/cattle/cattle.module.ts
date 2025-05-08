import { Module } from '@nestjs/common';
import { CattleGateway } from './cattle.gateway';
import { CattleService } from './cattle.service';
import { CattleController } from './cattle.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cattle } from './entity/cattle.entity';
import { Zone } from '../zones/zone.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Cattle, Zone])],
    providers: [CattleGateway, CattleService],
    controllers: [CattleController],
})
export class CattleModule {}
