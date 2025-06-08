import {stringValidation} from '../../core/middlewares/validation/bodyValidation.middleware';

const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const emailResendDtoValitation = [
  stringValidation({key: 'email', pattern: emailPattern})
];
