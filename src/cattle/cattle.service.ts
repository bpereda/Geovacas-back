import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Cattle } from './entity/cattle.entity';
import { CattleGateway } from './cattle.gateway';
import { UpdateLocationDTO } from './dto/updateLocationDTO';
import { CreateCowDTO } from './dto/createCowDTO';
import { Zone } from '../zones/zone.entity';

@Injectable()
export class CattleService {
    constructor(
        @InjectRepository(Cattle)
        private cattleRepository: Repository<Cattle>,
        private dataSource: DataSource,
        @InjectRepository(Zone)
        private zoneRepository: Repository<Zone>,
        private readonly gateway: CattleGateway,
    ) {}

    async updateLocation(dto: UpdateLocationDTO) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
    
        try {
            // Find the cattle by deviceId
            const cattle = await this.cattleRepository.findOne({
                where: { deviceId: dto.deviceId },
                relations: ['zone']
            });
    
            if (!cattle) {
                throw new NotFoundException(`Cattle with device ID ${dto.deviceId} not found`);
            }
    
            // Update location
            const point = {
                type: 'Point',
                coordinates: [dto.long, dto.lat] // Note: PostGIS expects [longitude, latitude]
            };
            
            cattle.location = point;
            await queryRunner.manager.save(cattle);
    
            // Check if zone update is needed
            if (cattle.zone && dto.zoneVersion !== cattle.zone.version) {
                await queryRunner.commitTransaction();
                return cattle.zone;
            }
    
            await queryRunner.commitTransaction();
            return null;
    
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException(
                `Error updating cattle location: ${error.message}`
            );
        } finally {
            await queryRunner.release();
        }
    }
    async createCow(dto: CreateCowDTO) {
        const cow = new Cattle();
        cow.deviceId = dto.deviceId;
    
        const zone = await this.zoneRepository.findOne({
            where: { id: parseInt(dto.zoneId) },
        });
        if (!zone) {
            throw new NotFoundException('Zone not found');
        }
    
        cow.zone = zone;
        try {
            const savedCow = await this.cattleRepository.save<Cattle>(cow); // ✅ guardar
            return savedCow; // ✅ retornar objeto con id, zone, deviceId
        } catch (error) {
            console.error(error);
            throw new NotFoundException('Cow not found');
        }
    }
    

    async findAll(): Promise<Cattle[]> {
        const cattle = await this.cattleRepository
            .createQueryBuilder('cattle')
            .leftJoinAndSelect('cattle.zone', 'zone')
            .select([
                'cattle.id',
                'cattle.deviceId',
                'cattle.createdAt',
                'cattle.location',
                'cattle.updatedAt',
                'zone.id',
                'zone.name',
                'zone.description'
            ])
            .getMany();

        return cattle;
    }
}
