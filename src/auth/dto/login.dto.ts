import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({
        example: 'john.doe',
        description: 'The username for login',
    })
    username: string;

    @ApiProperty({
        example: '********',
        description: 'The password for login',
    })
    password: string;
}
