import { PaginationQueryDto, PaginatedResult } from "../pagination-query.dto";


export async function paginate<T>(queryBuilder: any, paginationQuery: PaginationQueryDto): Promise<PaginatedResult<T>> {
  const { page, limit } = paginationQuery;

  const [data, total] = await queryBuilder
    .skip((page - 1) * limit)
    .take(limit)
    .orderBy('createdAt', 'DESC')
    .getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
        data,
        meta: {
            totalItems: total,
            totalPages: totalPages,
            currentPage: page,
            itemsPerPage: limit
        }
    }
}