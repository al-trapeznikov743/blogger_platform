import jwt, {JwtPayload, SignOptions} from 'jsonwebtoken';
import {config} from '../../core/settings/config';
import {UnauthorizedError} from '../../core/errors';

export const jwtService = {
  async createToken(userId: string): Promise<string> {
    return jwt.sign({userId}, config.AC_SECRET, {
      expiresIn: '1h' // config.AC_TIME
    } as SignOptions);
  },

  async verifyToken(token: string): Promise<JwtPayload> {
    try {
      return jwt.verify(token, config.AC_SECRET) as JwtPayload;
    } catch (error) {
      console.log('Verify token error');
      throw new UnauthorizedError('Incorrect login or password');
    }
  }
};
