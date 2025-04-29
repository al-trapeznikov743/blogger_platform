import {NextFunction, Request, Response} from 'express';
import {FieldValidationError, ValidationError, validationResult} from 'express-validator';
import {ErrorType, ValidationErrorType} from '../../errors/types';
import {HttpStatus} from '../../types/httpStatuses';

export const createErrorMessages = (errors: ErrorType[]): ValidationErrorType => {
  return {errorsMessages: errors};
};

const formatErrors = (error: ValidationError): ErrorType => {
  const expressError = error as unknown as FieldValidationError;

  return {
    field: expressError.path,
    message: expressError.msg
  };
};

export const validationResultMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errs = validationResult(req).formatWith(formatErrors);

  const errors1 = errs.array();

  console.log('=========================================');
  errors1.forEach((err) => {
    if (['sortBy', 'sortDirection'].includes(err.field)) {
      console.log('error##########: ', err);
      console.log('req.query##########: ', req.query);
    }
  });
  console.log('=========================================');

  const errors = errs.array({onlyFirstError: true});

  if (errors.length) {
    res.status(HttpStatus.BAD_REQUEST_400).json({errorsMessages: errors});

    return;
  }

  next();
};
