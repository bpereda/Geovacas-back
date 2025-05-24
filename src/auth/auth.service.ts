import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  NotAuthorizedException,
  UserNotFoundException,
  type CognitoIdentityProviderClientConfig,
} from '@aws-sdk/client-cognito-identity-provider';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private cognitoClient: CognitoIdentityProviderClient;
  private readonly logger = new Logger(AuthService.name);

  constructor(private configService: ConfigService) {
    const region = this.configService.get<string>('AWS_REGION');
    const accessKeyId = this.configService.get<string>('aws_access_key_id');
    const secretAccessKey = this.configService.get<string>('aws_secret_access_key');

    if (!region || !accessKeyId || !secretAccessKey) {
      this.logger.error('Missing AWS configuration');
      throw new Error('Missing AWS configuration. Please check your environment variables.');
    }

    const config: CognitoIdentityProviderClientConfig = {
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    };

    this.cognitoClient = new CognitoIdentityProviderClient(config);
    this.logger.log('AWS Cognito client initialized successfully');
  }

  async login(loginDto: LoginDto) {
    try {
      const clientId = this.configService.get<string>('COGNITO_CLIENT_ID');

      if (!clientId) {
        this.logger.error('Missing COGNITO_CLIENT_ID configuration');
        throw new Error('Missing Cognito configuration');
      }

      this.logger.debug(`Attempting login for user: ${loginDto.USERNAME}`);
      this.logger.debug(`Using Client ID: ${clientId}`);

      const command = new InitiateAuthCommand({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: clientId,
        AuthParameters: {
          USERNAME: loginDto.USERNAME,
          PASSWORD: loginDto.PASSWORD,
        },
      });

      this.logger.debug('Auth parameters:', command.input);
      const response = await this.cognitoClient.send(command);

      if (!response.AuthenticationResult) {
        this.logger.error('Authentication failed - No authentication result');
        throw new UnauthorizedException('Authentication failed');
      }

      this.logger.debug('Authentication successful');
      return {
        accessToken: response.AuthenticationResult.AccessToken,
        idToken: response.AuthenticationResult.IdToken,
        refreshToken: response.AuthenticationResult.RefreshToken,
      };
    } catch (error) {
      if (error instanceof NotAuthorizedException) {
        this.logger.warn(`Invalid credentials for user: ${loginDto.USERNAME}`);
        throw new UnauthorizedException('Invalid username or password');
      }
      if (error instanceof UserNotFoundException) {
        this.logger.warn(`User not found: ${loginDto.USERNAME}`);
        throw new UnauthorizedException('User not found');
      }

      if (error instanceof Error) {
        this.logger.error(`Authentication error: ${error.message}`);
      }
      throw new UnauthorizedException('Authentication failed');
    }
  }
}

