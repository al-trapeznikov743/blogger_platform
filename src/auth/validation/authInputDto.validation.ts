import {stringValidation} from '../../core/middlewares/validation/bodyValidation.middleware';

export const loginInputDtoValitation = [
  stringValidation({key: 'loginOrEmail', min: 3, max: 10}),
  stringValidation({key: 'password', min: 6, max: 20})
];
