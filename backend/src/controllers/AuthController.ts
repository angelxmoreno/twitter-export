import { CurrentUser, Get, JsonController, QueryParam } from 'routing-controllers';
import { AccessTokenOptions, AccessTokenResponse } from 'twitter-lite';
import twitterService, { RequestTokenResponse } from '../services/TwitterService';
import RepositoryManager from '../services/RepositoryManager';
import { UserEntity } from '../entities/UserEntity';
import userWithJwtResponse, { UserWithJWTResponse } from '../helpers/userWithJwtResponse';

@JsonController('/auth')
export default class AuthController {
  @Get('/request-token')
  getRequestToken(@QueryParam('callback_url') callbackUrl: string): Promise<RequestTokenResponse> {
    return twitterService.getRequestToken(callbackUrl);
  }

  @Get('/access-token')
  async getJwtFromAccessToken(
    @QueryParam('oauth_token') oauthToken: string,
    @QueryParam('oauth_verifier') oauthVerifier: string,
  ): Promise<UserWithJWTResponse> {
    const options: AccessTokenOptions = {
      oauth_token: oauthToken,
      oauth_verifier: oauthVerifier,
    };

    const accessTokens: AccessTokenResponse = await twitterService.getAccessToken(options);
    const user = await RepositoryManager.getUsers().createFromAccessTokenResponse(accessTokens);

    return userWithJwtResponse(user);
  }

  @Get('/check')
  async getCurrentUser(@CurrentUser({ required: true }) user: UserEntity): Promise<UserWithJWTResponse> {
    return userWithJwtResponse(user);
  }
}
