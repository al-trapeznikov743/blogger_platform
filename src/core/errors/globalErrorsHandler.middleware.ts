import {NextFunction, Request, Response} from 'express';
import {HttpStatus} from '../types/httpStatuses';
import {NotFoundError} from '.';
import {createErrorMessages} from './utils';

export const globalErrorsHandler = (
  err: any,
  _: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof NotFoundError) {
    const httpStatus = HttpStatus.NOT_FOUND_404;

    res.status(httpStatus).send(
      createErrorMessages([
        {
          message: err.message,
          field: 'id'
        }
      ])
    );

    return;
  }

  next();
};
