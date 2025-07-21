import {NextFunction, Request, Response} from 'express';
import {config} from '../../core/settings/config';
import {HttpStatus} from '../../core/types/httpStatuses';

export const baseAuthGuard = (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization as string;

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

  if (username !== config.ADMIN_USERNAME || password !== config.ADMIN_PASSWORD) {
    res.sendStatus(HttpStatus.UNAUTHORIZED_401);

    return;
  }

  next();
};
