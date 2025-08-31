import {ObjectId} from 'mongodb';
import {FullPaginationSorting} from '../../core/types/paginationAndSorting';

export const USERS_DI_TYPES = {
  UsersQueryRepository: Symbol.for('UsersQueryRepository'),
  UsersRepository: Symbol.for('UsersRepository'),
  UsersService: Symbol.for('UsersService'),
  UsersController: Symbol.for('UsersController')
};

export type UserType = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};

export type BaseUserData = {
  login: string;
  email: string;
  passwordHash: string;
  expirationDate?: string;
  confirmationCode?: string;
  isConfirmed?: boolean;
  recoveryCode?: string;
};

export type EmailConfirmation = {
  confirmationCode: string;
  expirationDate: string;
  isConfirmed: boolean;
};

export type RecoveryPassword = {
  recoveryCode: string;
  expirationDate: string;
};

export type BaseUser = {
  login: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  emailConfirmation: EmailConfirmation;
  recoveryPassword?: RecoveryPassword;
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
