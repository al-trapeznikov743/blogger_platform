import jwt, {JwtPayload, SignOptions} from 'jsonwebtoken';
import {injectable} from 'inversify';
import {v4 as uuidv4} from 'uuid';
import {UnauthorizedError} from '../../core/errors';
import {Payload} from '../types/adapters';

@injectable()
export class JwtService {
  async createToken(
    {userId, deviceId, iat, exp}: Payload,
    secret: string,
    expiresIn?: string
  ): Promise<string> {
    const payload = {userId, jti: uuidv4()} as JwtPayload;
    const options = {} as SignOptions;

    if (deviceId) {
      payload.deviceId = deviceId;
    }

    if (iat) {
      payload.iat = iat;
    }

    if (exp) {
      payload.exp = exp;
    }

    if (!exp && expiresIn) {
      options.expiresIn = expiresIn as SignOptions['expiresIn'];
    }

    return jwt.sign(payload, secret, options);
  }

  async verifyToken(token: string, secret: string): Promise<JwtPayload> {
    try {
      return jwt.verify(token, secret) as JwtPayload;
    } catch (err) {
      // console.log('Verify token error: ', err);
      throw new UnauthorizedError('Incorrect login or password');
    }
  }
}
