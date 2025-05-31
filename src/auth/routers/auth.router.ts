import {Router} from 'express';
import {loginHandler} from './handlers/login.handler';
import {loginInputDtoValitation} from '../validation/authInputDto.validation';
import {validationResultMiddleware} from '../../core/middlewares/validation/validationResult.middleware';
import {authMeHandler} from './handlers/authMe.handler';
import {accessTokenGuard} from '../middlewares/accessTokenGuard.middleware';

export const authRouter = Router();

authRouter
  .post('/login', loginInputDtoValitation, validationResultMiddleware, loginHandler)

  .get('/me', accessTokenGuard, validationResultMiddleware, authMeHandler);
