import { Controller, Post, Body, Get, Patch, Param, ParseIntPipe } from '@nestjs/common';
import { ZonesService } from './zones.service';
import { CreateZoneDto } from './dto/create-zone.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateZoneDto } from './dto/updateZone.dto';

@ApiTags('Zonas')
@Controller('zones')
export class ZonesController {
    constructor(private readonly zonesService: ZonesService) {}

    @Post()
    @ApiTags('Zonas')
    @ApiOperation({ summary: 'Crear una nueva zona' })
    @ApiCreatedResponse({ description: 'Zona creada exitosamente' })
    createZone(@Body() zoneDto: CreateZoneDto) {
        return this.zonesService.createZone(zoneDto);
    }

    @Get()
    @ApiTags('Zonas')
    @ApiOperation({ summary: 'Obtener zonas' })
    @ApiOkResponse({
        description: 'Listado de zonas, con geometría en formato GeoJSON',
    })
    findAll() {
        return this.zonesService.findAll();
    }

    @Patch('/:id')
    @ApiTags('Zonas')
    @ApiOperation({ summary: 'Modificar zona' })
    @ApiResponse({ status: 200, description: 'Zona modificada exitosamente' })
    @ApiResponse({ status: 404, description: 'Zona no encontrada' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    async modifyZone(
        @Body() zoneDto: UpdateZoneDto,
        @Param('id', ParseIntPipe) id: number
    ) {
        return await this.zonesService.modifyZone(zoneDto, id);
    }
}
