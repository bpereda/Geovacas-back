import { ApiProperty } from '@nestjs/swagger';

export class UpdateZoneDto {
    @ApiProperty({ example: 'Zona 2', description: 'Nuevo nombre de la zona' })
    name: string;

    @ApiProperty({
        example: [
            [-37.795, -56.36],
            [-32.675, -60.467],
            [-34.604, -58.379],
        ],
        description: 'Nuevos puntos de la zona',
    })
    coordinates: [number, number][];

    @ApiProperty({
        example: 'Zona de pastoreo',
        description: 'Descripción de la zona actualizada',
    })
    description: string;
}
