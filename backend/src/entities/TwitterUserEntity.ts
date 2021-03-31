import { Column, Entity, PrimaryColumn } from 'typeorm';
import { TwitterUser } from '../TwitterEntities';
import { EntityTimeBase } from './EntityTimeBase';

@Entity()
export class TwitterUserEntity extends EntityTimeBase {
  @PrimaryColumn('varchar')
  id: string;

  @Column({ type: 'simple-json' })
  data: TwitterUser;
}
