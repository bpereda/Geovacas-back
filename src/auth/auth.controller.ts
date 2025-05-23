import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @ApiOperation({ summary: 'Login with username and password' })
    @ApiResponse({
        status: 200,
        description: 'Returns access, id and refresh tokens',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - Invalid credentials',
    })
    async login(@Body() loginDto: LoginDto) {
        try {
            return await this.authService.login(loginDto.username, loginDto.password);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new UnauthorizedException(error.message);
            }
            throw new UnauthorizedException('Authentication failed');
        }
    }
}
