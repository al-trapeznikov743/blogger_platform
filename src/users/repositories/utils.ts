import {UserDbType} from '../types/user';

export const getUserInView = (user: UserDbType | null) =>
  user
    ? {
        id: user._id!.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
      }
    : user;
