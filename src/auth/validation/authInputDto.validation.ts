import {stringValidation} from '../../core/middlewares/validation/bodyValidation.middleware';

export const loginInputDtoValitation = [
  stringValidation({key: 'loginOrEmail'}),
  stringValidation({key: 'password'})
];
