import { ApiProperty } from '@nestjs/swagger';

export class CreateZoneDto {
    @ApiProperty({ example: 'Zona 1', description: 'Nombre de la zona' })
    name: string;

    @ApiProperty({
        example: [
            [-34.6037, -58.3816],
            [-34.603, -58.38],
            [-34.604, -58.379],
        ],
        description: 'Puntos que definen a la zona',
    })
    coordinates: [number, number][];

    @ApiProperty({
        example: 'Zona de pruebas',
        description: 'Descripción de la zona',
    })
    description: string;
}
