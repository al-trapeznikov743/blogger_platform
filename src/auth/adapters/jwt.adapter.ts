import jwt, {JwtPayload, SignOptions} from 'jsonwebtoken';
import {v4 as uuidv4} from 'uuid';
import {UnauthorizedError} from '../../core/errors';

type Payload = {
  userId: string;
  deviceId?: string;
  iat?: number;
  exp?: number;
};

export const jwtService = {
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
  },

  async verifyToken(token: string, secret: string): Promise<JwtPayload> {
    try {
      return jwt.verify(token, secret) as JwtPayload;
    } catch (err) {
      // console.log('Verify token error: ', err);
      throw new UnauthorizedError('Incorrect login or password');
    }
  }
};
