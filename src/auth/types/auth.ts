import {ObjectId} from 'mongodb';

export type LoginDto = {
  loginOrEmail: string;
  password: string;
};

export type ConfirmCodeType = {
  code: string;
};

export type EmailResendDto = {
  email: string;
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type BaseRefreshToken = {
  userId: string;
  token: string;
  createdAt: string;
  expiresAt: string;
};

export type RefreshTokenDbType = BaseRefreshToken & {
  _id?: ObjectId;
};

export type RefreshTokenViewType = BaseRefreshToken & {
  id: string;
};
