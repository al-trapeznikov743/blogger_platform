import {
  FullPaginationSorting,
  InputPaginationSorting
} from './../core/types/paginationAndSorting';

export type InputQueryOptions = InputPaginationSorting & {
  [key: string]: any;
};

export type FullQueryOptions = FullPaginationSorting & {
  [key: string]: any;
};

export const getQueryOptions = ({
  pageSize,
  pageNumber,
  sortBy,
  sortDirection,
  ...otherOptions
}: InputQueryOptions): FullQueryOptions => {
  return {
    pageSize: pageSize ? Number(pageSize) : 10,
    pageNumber: pageNumber ? Number(pageNumber) : 1,
    sortBy: sortBy ?? 'createdAt',
    sortDirection: sortDirection ?? 'desc',
    ...otherOptions
  };
};
