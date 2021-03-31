import { PrimaryGeneratedColumn } from 'typeorm';
import { EntityTimeBase } from './EntityTimeBase';

export abstract class EntityBase extends EntityTimeBase {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
