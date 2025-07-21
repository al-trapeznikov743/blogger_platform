import jwt, {JwtPayload, SignOptions} from 'jsonwebtoken';
import {v4 as uuidv4} from 'uuid';
import {UnauthorizedError} from '../../core/errors';

export const jwtService = {
  async createToken(
    userId: string,
    expiresIn: string | number,
    secret: string
  ): Promise<string> {
    const payload = {userId, jti: uuidv4()};
    const options = {expiresIn} as SignOptions;

    return jwt.sign(payload, secret, options);
  },

  async verifyToken(token: string, secret: string): Promise<JwtPayload> {
    try {
      return jwt.verify(token, secret) as JwtPayload;
    } catch (error) {
      console.log('Verify token error');
      throw new UnauthorizedError('Incorrect login or password');
    }
  }
};
