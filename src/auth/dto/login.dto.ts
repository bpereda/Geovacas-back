import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        example: 'bpereda',
        description: 'Username for login'
    })
    @IsString()
    @IsNotEmpty()
    USERNAME: string;

    @ApiProperty({
        example: 'Hola1234#',
        description: 'Password for login'
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    PASSWORD: string;
}
