import { Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';
import { EntityTimeBase } from './EntityTimeBase';
import { TwitterUserEntity } from './TwitterUserEntity';

@Entity()
@Index(['twitterUserId', 'followerId'], { unique: true })
export class FollowerEntity extends EntityTimeBase {
  @PrimaryColumn()
  twitterUserId: string;

  @PrimaryColumn()
  followerId: string;

  @ManyToOne(() => TwitterUserEntity, {
    createForeignKeyConstraints: false,
    nullable: true,
  })
  follower: TwitterUserEntity;
}
