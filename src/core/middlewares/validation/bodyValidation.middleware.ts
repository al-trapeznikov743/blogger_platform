import {body} from 'express-validator';

type stringValidationOptions = {
  key: string;
  min?: number;
  max?: number;
  nullable?: boolean;
  isNumeric?: boolean;
  pattern?: RegExp;
};

export const stringValidation = ({
  key,
  min,
  max,
  nullable,
  isNumeric,
  pattern
}: stringValidationOptions) => {
  let validator = body(key);

  if (nullable) {
    validator = validator.optional({nullable: true});
  }

  validator = validator.isString().withMessage(`${key} should be a string`).trim();

  const lengthOptions: {min?: number; max?: number} = {};

  if (min) lengthOptions.min = min;
  if (max) lengthOptions.max = max;

  if (Object.keys(lengthOptions).length) {
    const minTxt = min ? ` at least ${min}` : '';
    const maxTxt = max ? ` at most ${max}` : '';
    const message = `Length of ${key} must be${minTxt}${min && max ? ' and' : ''}${maxTxt}`;

    validator = validator.isLength(lengthOptions).withMessage(message);
  }

  if (isNumeric) {
    validator = validator.isNumeric().withMessage(`${key} must be a numeric string`);
  }

  if (pattern) {
    validator = validator
      .matches(pattern)
      .withMessage(`${key} does not match required format`);
  }

  return validator;
};
