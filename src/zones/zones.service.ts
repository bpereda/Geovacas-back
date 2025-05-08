import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Zone } from './zone.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/updateZone.dto';

@Injectable()
export class ZonesService {
    constructor(
        @InjectRepository(Zone)
        private zoneRepository: Repository<Zone>,
        private dataSource: DataSource,
    ) {}

    private toGeoJsonPolygon(coords: [number, number][]) {
        if (coords.length < 3) {
            throw new Error('Un polígono necesita al menos 3 puntos');
        }

        const formatted = coords.map(([lat, lon]) => [lon, lat]);

        if (
            formatted[0][0] !== formatted[formatted.length - 1][0] ||
            formatted[0][1] !== formatted[formatted.length - 1][1]
        ) {
            formatted.push(formatted[0]);
        }

        return {
            type: 'Polygon',
            coordinates: [formatted],
        };
    }

    async createZone(dto: CreateZoneDto): Promise<Zone> {
        const { name, description, coordinates } = dto;
        const geoJson = this.toGeoJsonPolygon(coordinates);

        const zone = this.zoneRepository.create({
            name: name,
            description: description,
            geom: geoJson,
        });
        return this.zoneRepository.save<Zone>(zone);
    }

    async findAll(): Promise<any[]> {
        const rawZones: {
            zone_id: number;
            zone_name: string;
            zone_description: string;
            zone_version: number;
            zone_createdAt: Date;
            zone_updatedAt: Date;
            geojson: string;
        }[] = await this.zoneRepository
            .createQueryBuilder('zone')
            .select([
                'zone.id',
                'zone.name',
                'zone.description',
                'zone.version',
                'zone.createdAt',
                'zone.updatedAt',
                'ST_AsGeoJSON(zone.geom) as geojson',
            ])
            .getRawMany();

        return rawZones.map((z) => ({
            id: z.zone_id,
            name: z.zone_name,
            description: z.zone_description,
            version: z.zone_version,
            createdAt: z.zone_createdAt,
            updatedAt: z.zone_updatedAt,
            geom: JSON.parse(z.geojson),
        }));
    }

    async modifyZone(dto: UpdateZoneDto, id: number): Promise<Zone> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        
        try {
            const zone = await this.zoneRepository.findOne({ where: { id } });
    
            if (!zone) {
                throw new NotFoundException(`Zone with ID ${id} not found`);
            }
    
            zone.name = dto.name;
            zone.description = dto.description;
            zone.geom = this.toGeoJsonPolygon(dto.coordinates);
    

            const updatedZone = await queryRunner.manager.save(zone);
            await queryRunner.commitTransaction();
            
            return updatedZone;
    
        } catch (error) {
            await queryRunner.rollbackTransaction();
            
            if (error instanceof NotFoundException) {
                throw error;
            }
            
            throw new InternalServerErrorException(
                'Error updating zone: ' + error.message
            );
        } finally {
            await queryRunner.release();
        }
    }
}
