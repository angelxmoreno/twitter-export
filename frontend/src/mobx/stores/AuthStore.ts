import { makeAutoObservable, runInAction, transaction } from 'mobx';
import { persist } from 'mobx-persist';
import { UserEntity } from '../entities/UserEntity';
import Auth, { UserWithJWTResponse } from '../../api/Auth';

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
  }

  async checkOAuthParams(): Promise<void> {
    const url = new URL(window.location.toString());
    const params = url.searchParams;
    if (params.has('oauth_token') && params.has('oauth_verifier')) {
      this.isLoading = true;
      const oauth_token = params.get('oauth_token') as string;
      const oauth_verifier = params.get('oauth_verifier') as string;
      url.searchParams.delete('oauth_token');
      url.searchParams.delete('oauth_verifier');
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
        window.location.href = url.toString();
      }
    }
    return undefined;
  }

  getLogInUrl(): Promise<string> {
    return Auth.getAuthorizeUrl();
  }
}
