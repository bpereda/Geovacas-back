import { ApiProperty } from '@nestjs/swagger';

export class CreateCowDTO {
    @ApiProperty({ example: 1, description: 'Identificador del dispositivo' })
    deviceId: string;

    @ApiProperty({
        example: 1,
        description:
            'Identificador de la zona a la cual estará vinculada la vaca',
    })
    zoneId: string;
}
