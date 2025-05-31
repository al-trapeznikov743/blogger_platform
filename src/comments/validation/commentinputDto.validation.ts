import {stringValidation} from '../../core/middlewares/validation/bodyValidation.middleware';

export const commentInputDtoValitation = [
  stringValidation({key: 'content', min: 20, max: 300})
];
