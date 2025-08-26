import {NextFunction, Request, Response} from 'express';
import {config} from '../../core/settings/config';
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

  const {userId} = await jwtService.verifyToken(token, config.AC_SECRET);

  req.user = {id: userId};

  next();
};
