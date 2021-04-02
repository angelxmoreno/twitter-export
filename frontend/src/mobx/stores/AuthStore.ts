import { makeAutoObservable, runInAction, transaction } from 'mobx';
import { persist } from 'mobx-persist';
import { UserEntity } from '../entities/UserEntity';
import Auth, { UserWithJWTResponse } from '../../api/Auth';
import appHistory from '../../router/appHistory';

export default class AuthStore {
  @persist('object') user?: UserEntity;

  @persist jwt?: string;

  @persist isAuthenticated = false;

  isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  setUser(user: UserEntity, jwt: string): void {
    transaction(() => {
      this.isAuthenticated = true;
      this.user = user;
      this.jwt = jwt;
    });
  }

  unsetUser(): void {
    transaction(() => {
      this.isAuthenticated = false;
      this.user = undefined;
      this.jwt = undefined;
    });

    appHistory.push({
      pathname: '/',
    });
  }

  async checkOAuthParams(): Promise<void> {
    const url = new URL(window.location.toString());
    const params = url.searchParams;
    if (params.has('oauth_token') && params.has('oauth_verifier')) {
      this.isLoading = true;
      const oauth_token = params.get('oauth_token') as string;
      const oauth_verifier = params.get('oauth_verifier') as string;
      const returnTo = params.get('returnTo') as string;
      url.searchParams.delete('oauth_token');
      url.searchParams.delete('oauth_verifier');
      url.searchParams.delete('returnTo');
      try {
        const { user, jwt }: UserWithJWTResponse = await Auth.getAccessTokens(oauth_token, oauth_verifier);
        runInAction(() => {
          this.setUser(user, jwt);
          this.isLoading = false;
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error getting access tokens', e.message);
      } finally {
        this.isLoading = false;
        appHistory.push({
          pathname: returnTo,
          search: url.search,
        });
      }
    }
    return undefined;
  }

  getLogInUrl(fromPath?: string): Promise<string> {
    return Auth.getAuthorizeUrl(fromPath);
  }
}
