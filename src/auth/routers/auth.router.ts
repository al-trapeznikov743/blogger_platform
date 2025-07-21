import {Router} from 'express';
import {loginHandler} from './handlers/login.handler';
import {refreshTokenHandler} from './handlers/refreshToken.handler';
import {loginInputDtoValitation} from '../validation/authInputDto.validation';
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

export const authRouter = Router();

authRouter
  .get('/me', accessTokenGuard, validationResultMiddleware, authMeHandler)

  .post('/login', loginInputDtoValitation, validationResultMiddleware, loginHandler)

  .post('/logout', logoutHandler)

  .post('/refresh-token', refreshTokenHandler)

  .post(
    '/registration',
    userInputDtoValitation,
    validationResultMiddleware,
    registrationHandler
  )

  .post(
    '/registration-confirmation',
    confirmCodeDtoValitation,
    validationResultMiddleware,
    registrationConfirmHandler
  )

  .post(
    '/registration-email-resending',
    emailResendDtoValitation,
    validationResultMiddleware,
    registrationEmailResendHandler
  );
