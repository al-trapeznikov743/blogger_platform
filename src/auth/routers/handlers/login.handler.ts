import {NextFunction, Request, Response} from 'express';
import {authService} from '../../domain/auth.service';
import {HttpStatus} from '../../../core/types/httpStatuses';

export const loginHandler = async (
  {body: {loginOrEmail, password}}: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await authService.loginUser(loginOrEmail, password);

    res.status(HttpStatus.NO_CONTENT_204);
  } catch (err: unknown) {
    next(err);
  }
};
