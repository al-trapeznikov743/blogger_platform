import {NextFunction, Request, Response} from 'express';
import {authService} from '../../domain/auth.service';
import {HttpStatus} from '../../../core/types/httpStatuses';
import {RequestWithBody} from '../../../core/types/requests';
import {LoginDto} from '../../types/auth';

export const loginHandler = async (
  {body: {loginOrEmail, password}}: RequestWithBody<LoginDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    await authService.loginUser(loginOrEmail, password);

    res.status(HttpStatus.NO_CONTENT_204).send();
  } catch (err: unknown) {
    next(err);
  }
};
