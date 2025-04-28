import {ErrorType} from './types';

export const createErrorMessages = (
  errors: ErrorType[]
): {errorsMessages: ErrorType[]} => {
  return {errorsMessages: errors};
};
