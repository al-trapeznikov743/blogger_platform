import {stringValidation} from '../../core/middlewares/validation/bodyValidation.middleware';

export const newPasswordRecoveryDtoValidation = [
  stringValidation({key: 'newPassword', min: 6, max: 20}),
  stringValidation({key: 'recoveryCode'})
];
