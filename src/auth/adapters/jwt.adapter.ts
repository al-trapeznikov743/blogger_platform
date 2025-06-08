import jwt, {JwtPayload, SignOptions} from 'jsonwebtoken';
import {config} from '../../core/settings/config';
import {UnauthorizedError} from '../../core/errors';

export const jwtService = {
  async createToken(userId: string): Promise<string> {
    const payload = {userId};
    const options = {expiresIn: '1h'} as SignOptions; // config.AC_TIME

    return jwt.sign(payload, config.AC_SECRET, options);
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
