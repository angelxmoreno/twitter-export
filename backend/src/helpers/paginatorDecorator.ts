export type PaginatorResponse<T> = {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    prev: boolean;
    next: boolean;
  };
};

const paginatorDecorator = <T>(data: T[], total: number, page: number, limit: number): PaginatorResponse<T> => {
  const totalPages = Math.ceil(total / limit);

  return {
    pagination: {
      total,
      page,
      limit,
      totalPages,
      prev: page > 1,
      next: page < totalPages,
    },
    data,
  };
};

export default paginatorDecorator;
