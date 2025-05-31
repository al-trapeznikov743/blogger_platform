import {NextFunction, Request, Response} from 'express';
import {HttpStatus} from '../types/httpStatuses';
import {NotFoundError, BadRequestError, UnauthorizedError, ForbiddenError} from '.';
import {createErrorMessages} from './utils';

export const globalErrorsHandler = (
  err: any,
  _: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof NotFoundError) {
    res.status(HttpStatus.NOT_FOUND_404).send(
      createErrorMessages([
        {
          message: err.message,
          field: err.field
        }
      ])
    );

    return;
  }

  if (err instanceof BadRequestError) {
    res.status(HttpStatus.BAD_REQUEST_400).send(
      createErrorMessages([
        {
          message: err.message,
          field: err.field
        }
      ])
    );

    return;
  }

  if (err instanceof UnauthorizedError) {
    res.status(HttpStatus.UNAUTHORIZED_401).send(
      createErrorMessages([
        {
          message: err.message,
          field: 'loginOrPassword'
        }
      ])
    );

    return;
  }

  if (err instanceof ForbiddenError) {
    res.status(HttpStatus.FORBIDDEN_403).send(
      createErrorMessages([
        {
          message: err.message,
          field: err.field
        }
      ])
    );

    return;
  }

  if (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR_500);

    return;
  }

  next();
};
