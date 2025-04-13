export type ErrorType = {
  field: string;
  message: string;
};

export type ValidationErrorType = {errorMessages: ErrorType[]};
