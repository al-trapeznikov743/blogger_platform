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

const getValidValue = (val: any, defaultVal: number) => {
  const numberVal = Number(val);

  return numberVal && !isNaN(numberVal) ? numberVal : defaultVal;
};

export const getQueryOptions = ({
  pageSize,
  pageNumber,
  sortBy,
  sortDirection,
  ...otherOptions
}: InputQueryOptions): FullQueryOptions => {
  const additionalOptions: Record<string, string> = {};

  for (const [key, value] of Object.entries(otherOptions)) {
    if (typeof value === 'string' && value.length) {
      additionalOptions[key] = value;
    }
  }

  return {
    pageSize: getValidValue(pageSize, 10),
    pageNumber: getValidValue(pageNumber, 1),
    sortBy: sortBy?.length ? sortBy : 'createdAt',
    sortDirection: sortDirection?.length ? sortDirection : 'desc',
    ...additionalOptions
  };
};
