import jwt, {SignOptions} from 'jsonwebtoken';
import {config} from '../../core/settings/config';

export const jwtService = {
  async createToken(userId: string): Promise<string> {
    return jwt.sign({userId}, config.AC_SECRET, {
      expiresIn: config.AC_TIME
    } as SignOptions);
  }
};
