import { ApiProperty } from '@nestjs/swagger';

export class UpdateLocationDTO {
    @ApiProperty({ example: 'device123', description: 'ID del dispositivo de la vaca' })
    deviceId: string;

    @ApiProperty({
        example: -34.6037,
        description: 'Coordenada de latitud de la vaca',
    })
    lat: number;

    @ApiProperty({
        example: -58.3816,
        description: 'Coordenada de longitud de la vaca',
    })
    long: number;

    @ApiProperty({
        description: 'Tiempo en el cual la vaca modificó su localización',
        required: false,
    })
    timestamp?: Date;

    @ApiProperty({
        example: 1,
        description: 'Versión de zona que tiene la vaca',
        required: false
    })
    zoneVersion?: number;
}