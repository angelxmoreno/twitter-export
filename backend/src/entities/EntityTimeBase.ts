import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class EntityTimeBase {
  @UpdateDateColumn()
  updated: Date;

  @CreateDateColumn()
  created: Date;

  @DeleteDateColumn()
  deleted: Date;
}
