import jwt, {SignOptions} from 'jsonwebtoken';
import {config} from '../../core/settings/config';
import {UnauthorizedError} from '../../core/errors';

export const jwtService = {
  async createToken(userId: string): Promise<string> {
    return jwt.sign({userId}, config.AC_SECRET, {
      expiresIn: config.AC_TIME
    } as SignOptions);
  },

  async verifyToken(token: string): Promise<{userId: string} | null> {
    try {
      return jwt.verify(token, config.AC_SECRET) as {userId: string};
    } catch (error) {
      throw new UnauthorizedError('Incorrect login or password');
    }
  }
};
