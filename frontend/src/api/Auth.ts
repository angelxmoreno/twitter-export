import axios from 'axios';
import getenv from 'getenv';
import { UserEntity } from '../mobx/entities/UserEntity';
import isDevelopment from '../utils/isDevelopment';

const BASE_DOMAIN = isDevelopment() ? 'http://localhost:4000' : getenv('REACT_APP_BE_DOMAIN');
const REQUEST_TOKEN_URL = '/auth/request-token';
const ACCESS_TOKEN_URL = '/auth/access-token';
const CALLBACK_URL = isDevelopment() ? 'http://localhost:3000/' : getenv.url('REACT_APP_CALLBACK_URL');

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

const getRequestTokens = async (fromPath?: string): Promise<RequestTokenResponse> => {
  try {
    const { data } = await axios.get<RequestTokenResponse>(BASE_DOMAIN + REQUEST_TOKEN_URL, {
      params: { callback_url: `${CALLBACK_URL}?returnTo=${fromPath}` },
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

const getAuthorizeUrl = async (fromPath?: string): Promise<string> => {
  const requestTokens = await getRequestTokens(fromPath);
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
