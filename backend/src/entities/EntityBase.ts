import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class EntityBase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @UpdateDateColumn()
  updated: Date;

  @CreateDateColumn()
  created: Date;

  @DeleteDateColumn()
  deleted: Date;
}
