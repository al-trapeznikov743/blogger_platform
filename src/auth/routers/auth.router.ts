import {Router} from 'express';
import {loginHandler} from './handlers/login.handler';
import {loginInputDtoValitation} from '../validation/authInputDto.validation';
import {validationResultMiddleware} from '../../core/middlewares/validation/validationResult.middleware';

export const authRouter = Router();

authRouter.post(
  '/login',
  loginInputDtoValitation,
  validationResultMiddleware,
  loginHandler
);
