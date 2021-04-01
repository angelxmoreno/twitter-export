import { Column, Entity, Index } from 'typeorm';
import { EntityBase } from './EntityBase';
import twitterUserServiceFactory, { TwitterUserService } from '../services/TwitterUserService';

@Entity()
export class UserEntity extends EntityBase {
  @Column()
  oauthToken: string;

  @Column()
  oauthTokenSecret: string;

  @Index({ unique: true })
  @Column()
  twitterUserId: string;

  @Index({ unique: true })
  @Column()
  screenName: string;

  protected twitterUserService: TwitterUserService;

  get twitterClient(): TwitterUserService {
    if (!this.twitterUserService) {
      this.twitterUserService = twitterUserServiceFactory(this);
    }
    return this.twitterUserService;
  }
}
