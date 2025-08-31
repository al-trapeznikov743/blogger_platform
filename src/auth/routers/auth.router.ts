import {Router} from 'express';
import {container} from '../../compositionRoot';
import {AUTH_DI_TYPES} from '../types/auth';
import {loginInputDtoValitation} from '../validation/authInputDto.validation';
import {newPasswordRecoveryDtoValidation} from '../validation/newPasswordRecoveryDto.validation';
import {rateLimitValidation} from '../../core/middlewares/validation/rateLimitValidation.middleware';
import {validationResultMiddleware} from '../../core/middlewares/validation/validationResult.middleware';
import {accessTokenGuard} from '../middlewares/accessTokenGuard.middleware';
import {userInputDtoValitation} from '../../users/validation/userInputDto.validation';
import {confirmCodeDtoValitation} from '../validation/confirmCode.validation';
import {emailDtoValitation} from '../validation/emailInputDto.validation';
import {refreshTokenGuard} from '../middlewares/refreshTokenGuard.middleware';
import {AuthController} from './auth.controller';

export const authRouter = Router();
const authController = container.get<AuthController>(AUTH_DI_TYPES.AuthController);

authRouter
  .get(
    '/me',
    accessTokenGuard,
    validationResultMiddleware,
    authController.authMe.bind(authController)
  )

  .post(
    '/login',
    rateLimitValidation,
    loginInputDtoValitation,
    validationResultMiddleware,
    authController.login.bind(authController)
  )

  .post('/logout', refreshTokenGuard, authController.logout.bind(authController))

  .post(
    '/refresh-token',
    refreshTokenGuard,
    authController.refreshToken.bind(authController)
  )

  .post(
    '/registration',
    rateLimitValidation,
    userInputDtoValitation,
    validationResultMiddleware,
    authController.registration.bind(authController)
  )

  .post(
    '/registration-confirmation',
    rateLimitValidation,
    confirmCodeDtoValitation,
    validationResultMiddleware,
    authController.registrationConfirm.bind(authController)
  )

  .post(
    '/registration-email-resending',
    rateLimitValidation,
    emailDtoValitation,
    validationResultMiddleware,
    authController.registrationEmailResending.bind(authController)
  )

  .post(
    '/password-recovery',
    rateLimitValidation,
    emailDtoValitation,
    validationResultMiddleware,
    authController.passwordRecovery.bind(authController)
  )

  .post(
    '/new-password',
    rateLimitValidation,
    newPasswordRecoveryDtoValidation,
    validationResultMiddleware,
    authController.newPassword.bind(authController)
  );
