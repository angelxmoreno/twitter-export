import { Column, Entity, Index } from 'typeorm';
import { EntityBase } from './EntityBase';

@Entity()
export class User extends EntityBase {
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
}
