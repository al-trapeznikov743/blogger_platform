import {NextFunction, Response} from 'express';
import {authService} from '../../domain/auth.service';
import {HttpStatus} from '../../../core/types/httpStatuses';
import {RequestWithBody} from '../../../core/types/requests';
import {EmailResendDto} from '../../types/auth';

export const registrationEmailResendHandler = async (
  {body: {email}}: RequestWithBody<EmailResendDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    await authService.emailResending(email);

    res.sendStatus(HttpStatus.NO_CONTENT_204);
  } catch (err: unknown) {
    next(err);
  }
};
