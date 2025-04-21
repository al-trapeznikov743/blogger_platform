import {stringValidation} from '../../core/middlewares/validation/bodyValidation.middleware';
import {idValidation} from '../../core/middlewares/validation/paramsValidation.middleware';

export const postInputDtoValitation = [
  stringValidation({key: 'title', min: 1, max: 30}),
  stringValidation({key: 'shortDescription', min: 1, max: 100}),
  stringValidation({key: 'content', min: 1, max: 1000}),
  // stringValidation({key: 'blogId', min: 1, isNumeric: true})
  idValidation('blogId')
];
