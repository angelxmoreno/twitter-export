import { AbstractRepository, FindManyOptions } from 'typeorm';
import { FindConditions } from 'typeorm/find-options/FindConditions';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { SaveOptions } from 'typeorm/repository/SaveOptions';
import buildPaginator from 'pagination-apis';
import paginatorDecorator, { PaginatorResponse } from '../helpers/paginatorDecorator';

export type PaginateOptions = {
  page: number;
  limit: number;
  maximumLimit: number;
};

export interface Paginate {
  data: Array<unknown>;
  total: number;
  totalPages: number;
  previous?: string;
  next?: string;
}

export default class RepositoryBase<Entity> extends AbstractRepository<Entity> {
  paginationOptions: PaginateOptions = {
    page: 1,
    limit: 20,
    maximumLimit: 100,
  };

  findOne(conditions?: FindConditions<Entity>, options?: FindOneOptions<Entity>): Promise<Entity | undefined> {
    return this.repository.findOne(conditions, options);
  }

  findMany(conditions?: FindManyOptions<Entity>): Promise<Entity[] | undefined> {
    return this.repository.find(conditions);
  }

  create(entityLike: DeepPartial<Entity>): Entity {
    return this.repository.create(entityLike);
  }

  save(entity: Entity, options?: SaveOptions): Promise<Entity> {
    return this.repository.save(entity, options);
  }

  get(id: string): Promise<Entity> {
    return this.repository.findOneOrFail(id);
  }

  async upsert(conditions: FindConditions<Entity>, partial: DeepPartial<Entity>): Promise<[Entity, boolean]> {
    let found = true;
    let entity = await this.findOne(conditions);

    if (!entity) {
      found = false;
      entity = this.create(partial);
    } else {
      found = true;
      entity = this.repository.merge(entity, partial);
    }

    return [await this.save(entity), found];
  }

  async paginate<T>(
    findOptions?: FindManyOptions<Entity>,
    paginationOptions?: Partial<PaginateOptions>,
    transformPredicate?: (entity: Entity) => T,
  ): Promise<PaginatorResponse<T>> {
    const { skip, limit, page } = buildPaginator({
      ...this.paginationOptions,
      ...paginationOptions,
    });

    const findPaginatedOptions: FindManyOptions<Entity> = {
      ...findOptions,
      take: limit,
      skip,
    };
    const [entities, total] = await this.repository.findAndCount(findPaginatedOptions);
    const data: T[] = transformPredicate ? entities.map(transformPredicate) : ((entities as unknown[]) as T[]);
    return paginatorDecorator<T>(data, total, page, limit);
  }
}
