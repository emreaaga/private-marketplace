import { PaginationMeta } from 'src/common/types/pagination';

export function calculatePagination(
  page: number,
  total: number,
  limit: number = 10,
): PaginationMeta {
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}
