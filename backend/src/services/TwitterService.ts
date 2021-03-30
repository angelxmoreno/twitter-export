/* eslint-disable camelcase */
import Twitter, { AccessTokenOptions, AccessTokenResponse } from 'twitter-lite';
import Env from '../helpers/Env';

export interface RequestTokenResponse {
  oauth_token: string;
  oauth_token_secret: string;
  oauth_callback_confirmed: 'true';
}

export class TwitterService {
  protected consumer_key: string;

  protected consumer_secret: string;

  protected authClient: Twitter;

  constructor(consumer_key: string, consumer_secret: string) {
    this.consumer_key = consumer_key;
    this.consumer_secret = consumer_secret;
    this.authClient = new Twitter({ consumer_key, consumer_secret });
  }

  getAccessToken(options: AccessTokenOptions): Promise<AccessTokenResponse> {
    return this.authClient.getAccessToken(options);
  }

  getRequestToken(twitterCallbackUrl: string | 'oob'): Promise<RequestTokenResponse> {
    return (this.authClient.getRequestToken(twitterCallbackUrl) as unknown) as Promise<RequestTokenResponse>;
  }
}

const twitterService = new TwitterService(Env.string('TWITTER_CONSUMER_KEY'), Env.string('TWITTER_CONSUMER_SECRET'));

export default twitterService;
