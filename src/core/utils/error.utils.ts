import {ErrorType} from '../types/errors';

export const createErrorMessages = (
  errors: ErrorType[]
): {errorsMessages: ErrorType[]} => {
  return {errorsMessages: errors};
};