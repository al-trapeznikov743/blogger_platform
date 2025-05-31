import {NextFunction, Request, Response} from 'express';
import {IdType} from './../../core/types/shared';
import {HttpStatus} from '../../core/types/httpStatuses';
import {jwtService} from '../adapters/jwt.adapter';

export const accessTokenGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    res.sendStatus(HttpStatus.UNAUTHORIZED_401);

    return;
  }

  const [authType, token] = req.headers.authorization.split(' ');

  if (authType !== 'Bearer') {
    res.sendStatus(HttpStatus.UNAUTHORIZED_401);

    return;
  }

  const payload = await jwtService.verifyToken(token);

  if (payload) {
    const {userId} = payload;

    req.user = {id: userId} as IdType;

    next();

    return;
  }

  res.sendStatus(HttpStatus.UNAUTHORIZED_401);
};
