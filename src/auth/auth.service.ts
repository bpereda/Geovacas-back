import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  NotAuthorizedException,
  UserNotFoundException,
  type CognitoIdentityProviderClientConfig,
} from '@aws-sdk/client-cognito-identity-provider';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private cognitoClient: CognitoIdentityProviderClient;

  constructor(private configService: ConfigService) {
    const region = this.configService.get<string>('AWS_REGION');
    const accessKeyId = this.configService.get<string>('aws_access_key_id');
    const secretAccessKey = this.configService.get<string>('aws_secret_access_key');

    if (!region || !accessKeyId || !secretAccessKey) {
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
  }

  async login(username: string, password: string) {
    try {
      const command = new InitiateAuthCommand({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: this.configService.get<string>('COGNITO_CLIENT_ID'),
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
        },
      });

      const response = await this.cognitoClient.send(command);

      if (!response.AuthenticationResult) {
        throw new UnauthorizedException('Authentication failed');
      }

      return {
        accessToken: response.AuthenticationResult.AccessToken,
        idToken: response.AuthenticationResult.IdToken,
        refreshToken: response.AuthenticationResult.RefreshToken,
      };
    } catch (error) {
      if (error instanceof NotAuthorizedException) {
        throw new UnauthorizedException('Invalid username or password');
      }
      if (error instanceof UserNotFoundException) {
        throw new UnauthorizedException('User not found');
      }
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
