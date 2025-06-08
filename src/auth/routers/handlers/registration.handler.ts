import {NextFunction, Response} from 'express';
import {authService} from '../../domain/auth.service';
import {HttpStatus} from '../../../core/types/httpStatuses';
import {RequestWithBody} from '../../../core/types/requests';
import {UserInputDto} from '../../../users/types/user';

export const registrationHandler = async (
  {body: {login, email, password}}: RequestWithBody<UserInputDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    await authService.registerUser(login, password, email);

    res.sendStatus(HttpStatus.NO_CONTENT_204);
  } catch (err: unknown) {
    next(err);
  }
};
