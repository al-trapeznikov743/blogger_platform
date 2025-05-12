import {stringValidation} from '../../core/middlewares/validation/bodyValidation.middleware';

const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const loginPattern = /^[a-zA-Z0-9_-]*$/;

export const userInputDtoValitation = [
  stringValidation({key: 'email', pattern: emailPattern}),
  stringValidation({key: 'login', min: 3, max: 10, pattern: loginPattern}),
  stringValidation({key: 'password', min: 6, max: 20})
];
