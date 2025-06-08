import {NextFunction, Response} from 'express';
import {authService} from '../../domain/auth.service';
import {HttpStatus} from '../../../core/types/httpStatuses';
import {RequestWithBody} from '../../../core/types/requests';
import {ConfirmCodeType} from '../../types/auth';

export const registrationConfirmHandler = async (
  {body: {code}}: RequestWithBody<ConfirmCodeType>,
  res: Response,
  next: NextFunction
) => {
  try {
    await authService.confirmEmail(code);

    res.sendStatus(HttpStatus.NO_CONTENT_204);
  } catch (err: unknown) {
    next(err);
  }
};
