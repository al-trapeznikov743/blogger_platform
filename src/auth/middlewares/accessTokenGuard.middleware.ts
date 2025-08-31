import {NextFunction, Request, Response} from 'express';
import {container} from '../../compositionRoot';
import {config} from '../../core/settings/config';
import {HttpStatus} from '../../core/types/httpStatuses';
import {JwtService} from '../adapters/jwt.adapter';
import {ADAPTERS_DI_TYPES} from '../types/adapters';

const jwtService = container.get<JwtService>(ADAPTERS_DI_TYPES.JwtService);

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
