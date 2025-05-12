import {ObjectId} from 'mongodb';
import {FullPaginationSorting} from '../../core/types/paginationAndSorting';

export type User = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};

export type BaseUser = {
  login: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

export type UserDbType = BaseUser & {
  _id?: ObjectId;
};

export type UserInputDto = {
  login: string;
  password: string;
  email: string;
};

export type UserDtoForTest = {
  login?: string;
  password?: string;
  email?: string;
};

export type PaginatedUsers = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: User[];
};

export type FindUsersQueryOptions = FullPaginationSorting & {
  searchLoginTerm?: string;
  searchEmailTerm?: string;
};
