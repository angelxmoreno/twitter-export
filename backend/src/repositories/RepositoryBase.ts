import { AbstractRepository } from 'typeorm';
import { FindConditions } from 'typeorm/find-options/FindConditions';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { SaveOptions } from 'typeorm/repository/SaveOptions';
import buildPaginator from 'pagination-apis';

type PaginateOptions = {
  page: number;
  limit: number;
  maximumLimit: number;
};

interface Paginate {
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

  create(entityLike: DeepPartial<Entity>): Entity {
    return this.repository.create(entityLike);
  }

  save(entity: Entity, options?: SaveOptions): Promise<Entity> {
    return this.repository.save(entity, options);
  }

  get(id: string): Promise<Entity> {
    return this.repository.findOneOrFail(id);
  }
}
