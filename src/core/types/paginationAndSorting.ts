export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

export type InputPaginationSorting = {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
};

export type FullPaginationSorting = {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
};
