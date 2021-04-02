import axios from 'axios';
import { UserEntity } from '../mobx/entities/UserEntity';

const BASE_DOMAIN = 'http://localhost:4000';
const REQUEST_TOKEN_URL = '/auth/request-token';
const ACCESS_TOKEN_URL = '/auth/access-token';
const CALLBACK_URL = 'http://localhost:3000/';

export interface RequestTokenResponse {
  oauth_token: string;
  oauth_token_secret: string;
  oauth_callback_confirmed: 'true';
}

export interface UserWithJWTResponse {
  jwt: string;
  user: UserEntity;
}

const buildAuthorizeUrlFromRequestTokens = (requestTokens: RequestTokenResponse): string =>
  `https://api.twitter.com/oauth/authorize?oauth_token=${requestTokens.oauth_token}`;

const getRequestTokens = async (): Promise<RequestTokenResponse> => {
  try {
    const { data } = await axios.get<RequestTokenResponse>(BASE_DOMAIN + REQUEST_TOKEN_URL, {
      params: { callback_url: CALLBACK_URL },
    });
    // eslint-disable-next-line no-console
    console.log('RequestTokenResponse', data);
    return data;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(BASE_DOMAIN + REQUEST_TOKEN_URL, e);
    throw new Error(e.message);
  }
};

const getAuthorizeUrl = async (): Promise<string> => {
  const requestTokens = await getRequestTokens();
  return buildAuthorizeUrlFromRequestTokens(requestTokens);
};

const getAccessTokens = async (oauth_token: string, oauth_verifier: string): Promise<UserWithJWTResponse> => {
  try {
    const { data } = await axios.get<UserWithJWTResponse>(BASE_DOMAIN + ACCESS_TOKEN_URL, {
      params: { oauth_token, oauth_verifier },
    });
    // eslint-disable-next-line no-console
    console.log('UserWithJWTResponse', data);
    return data;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(BASE_DOMAIN + REQUEST_TOKEN_URL, e);
    throw new Error(e.message);
  }
};
const Auth = { getAuthorizeUrl, getAccessTokens };

export default Auth;
