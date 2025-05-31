import {NextFunction, Response} from 'express';
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
    const accessToken = await authService.loginUser(loginOrEmail, password);

    res.status(HttpStatus.OK_200).send({accessToken});
  } catch (err: unknown) {
    next(err);
  }
};
