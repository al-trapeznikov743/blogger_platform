export type ErrorType = {
  field: string;
  message: string;
};

export type ValidationErrorType = {errorsMessages: ErrorType[]};
