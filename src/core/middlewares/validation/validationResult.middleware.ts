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
  const errors = validationResult(req)
    .formatWith(formatErrors)
    .array({onlyFirstError: true});

  console.log('=========================================');
  errors.forEach((err) => console.log('error##########: ', err));
  console.log('=========================================');

  if (errors.length) {
    res.status(HttpStatus.BAD_REQUEST_400).json({errorsMessages: errors});

    return;
  }

  next();
};
