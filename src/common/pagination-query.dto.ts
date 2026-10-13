import { IsOptional, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page: number = 1; // Default to first page

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  limit: number = 10; // Default to 10 items per page
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}

