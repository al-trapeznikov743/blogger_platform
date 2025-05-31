import {check} from 'express-validator';

export const idValidation = (field: string = 'id') =>
  check(field)
    .exists()
    .withMessage('ID is required')
    .isString()
    .withMessage('ID must be a string')
    .isLength({min: 1})
    .withMessage('ID must not be empty')
    .isMongoId()
    .withMessage('ID must be a valid MongoDB ObjectId');
