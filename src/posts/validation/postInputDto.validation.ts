import {stringValidation} from '../../core/middlewares/validation/bodyValidation.middleware';
import {idValidation} from '../../core/middlewares/validation/paramsValidation.middleware';

export const postInputDtoValidation = [
  stringValidation({key: 'title', min: 1, max: 30}),
  stringValidation({key: 'shortDescription', min: 1, max: 100}),
  stringValidation({key: 'content', min: 1, max: 1000}),
  idValidation('blogId')
];

export const postInputWithoutBlogIdValidation = [
  stringValidation({key: 'title', min: 1, max: 30}),
  stringValidation({key: 'shortDescription', min: 1, max: 100}),
  stringValidation({key: 'content', min: 1, max: 1000})
];
