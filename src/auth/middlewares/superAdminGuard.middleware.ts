import {NextFunction, Request, Response} from 'express';
import {HttpStatus} from '../../core/types/httpStatuses';

export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'qwerty';

export const superAdminGuardMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = req.headers['authorization'] as string;

  if (!auth) {
    res.sendStatus(HttpStatus.UNAUTHORIZED_401);

    return;
  }

  const [type, token] = auth.split(' ');

  if (type !== 'Basic') {
    res.sendStatus(HttpStatus.UNAUTHORIZED_401);

    return;
  }

  const credentials = Buffer.from(token, 'base64').toString('utf-8');

  const [username, password] = credentials.split(':');

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    res.sendStatus(HttpStatus.UNAUTHORIZED_401);

    return;
  }

  next();
};
