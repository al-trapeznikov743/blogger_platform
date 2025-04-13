import {stringValidation} from '../../core/middlewares/validation/bodyValidation.middleware';

const websiteUrlRegex =
  /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;

export const blogInputDtoValitation = [
  stringValidation({key: 'name', min: 1, max: 15}),
  stringValidation({key: 'description', min: 1, max: 500}),
  stringValidation({key: 'websiteUrl', max: 100, pattern: websiteUrlRegex})
];
