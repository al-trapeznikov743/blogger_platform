import {Router} from 'express';
import {loginHandler} from './handlers/login.handler';
import {refreshTokenHandler} from './handlers/refreshToken.handler';
import {loginInputDtoValitation} from '../validation/authInputDto.validation';
import {rateLimitValidation} from '../../core/middlewares/validation/rateLimitValidation.middleware';
import {validationResultMiddleware} from '../../core/middlewares/validation/validationResult.middleware';
import {authMeHandler} from './handlers/authMe.handler';
import {accessTokenGuard} from '../middlewares/accessTokenGuard.middleware';
import {registrationHandler} from './handlers/registration.handler';
import {registrationConfirmHandler} from './handlers/registrationConfirm.handler';
import {registrationEmailResendHandler} from './handlers/registrationEmailResend.handler';
import {userInputDtoValitation} from '../../users/validation/userInputDto.validation';
import {confirmCodeDtoValitation} from '../validation/confirmCode.validation';
import {emailResendDtoValitation} from '../validation/emailInputDto.validation';
import {logoutHandler} from './handlers/logout.handler';
import {refreshTokenGuard} from '../middlewares/refreshTokenGuard.middleware';

export const authRouter = Router();

authRouter
  .get('/me', accessTokenGuard, validationResultMiddleware, authMeHandler)

  .post(
    '/login',
    rateLimitValidation,
    loginInputDtoValitation,
    validationResultMiddleware,
    loginHandler
  )

  .post('/logout', refreshTokenGuard, logoutHandler)

  .post('/refresh-token', refreshTokenGuard, refreshTokenHandler)

  .post(
    '/registration',
    rateLimitValidation,
    userInputDtoValitation,
    validationResultMiddleware,
    registrationHandler
  )

  .post(
    '/registration-confirmation',
    rateLimitValidation,
    confirmCodeDtoValitation,
    validationResultMiddleware,
    registrationConfirmHandler
  )

  .post(
    '/registration-email-resending',
    rateLimitValidation,
    emailResendDtoValitation,
    validationResultMiddleware,
    registrationEmailResendHandler
  );
