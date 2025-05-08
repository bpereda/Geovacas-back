import { Body, Controller, Post, Patch, Get } from '@nestjs/common';
import { CattleService } from './cattle.service';
import { UpdateLocationDTO } from './dto/updateLocationDTO';
import { CreateCowDTO } from './dto/createCowDTO';
import {
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { Cattle } from './entity/cattle.entity';

@ApiTags('Ganado')
@Controller('cattle')
export class CattleController {
    constructor(private readonly cattleService: CattleService) {}

    @Get()
    @ApiTags('Ganado')
    @ApiOperation({ summary: 'Obtener listado de ganado' })
    @ApiOkResponse({
        description: 'Lista de ganado con su información y zona asociada',
        type: [Cattle]
    })
    findAll() {
        return this.cattleService.findAll();
    }

    @Patch('location')
    @ApiTags('Ganado')
    @ApiOperation({ summary: 'Actualizar localización de la vaca' })
    @ApiOkResponse({
        description: 'Ubicación actualizada.',
        examples: {
            ['withZoneUpdate']: {
                summary:
                    'El dispositivo de la vaca tiene una verisón antigua de la zona.',
                value: {
                    id: 1,
                    name: 'Zona 1',
                    description: 'Zona al lado del lago',
                    geom: {
                        type: 'Polygon',
                        coordinates: [
                            [
                                [-58.3816, -34.6037],
                                [-58.38, -34.603],
                                [-58.379, -34.604],
                                [-58.3816, -34.6037],
                            ],
                        ],
                    },
                    version: 2,
                },
            },
            ['noUpdate']: {
                summary:
                    'El dispositivo de la vaca tiene la versión actual de la zona.',
                value: null,
            },
        },
    })
    updateCowLocation(@Body() dto: UpdateLocationDTO) {
        return this.cattleService.updateLocation(dto);
    }

    @Post('new-cattle')
    @ApiTags('Ganado')
    @ApiOperation({ summary: 'Crear nueva vaca' })
    @ApiCreatedResponse({ description: 'Vaca creada exitosamente' })
    createCow(@Body() dto: CreateCowDTO) {
        return this.cattleService.createCow(dto);
    }
}
