import {ObjectId} from 'mongodb';
import {FullPaginationSorting} from '../../core/types/paginationAndSorting';

export type UserType = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};

export type emailConfirmation = {
  confirmationCode: string;
  expirationDate: string;
  isConfirmed: boolean;
};

export type BaseUser = {
  login: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  emailConfirmation: emailConfirmation;
};

export type UserDbType = BaseUser & {
  _id?: ObjectId;
};

export type UserViewType = BaseUser & {
  id: string;
};

export type UserInputDto = {
  login: string;
  email: string;
  password: string;
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
  items: UserType[];
};

export type FindUsersQueryOptions = FullPaginationSorting & {
  searchLoginTerm?: string;
  searchEmailTerm?: string;
};
