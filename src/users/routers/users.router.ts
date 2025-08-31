import {Router} from 'express';
import {container} from '../../compositionRoot';
import {USERS_DI_TYPES} from '../types/user';
import {validationResultMiddleware} from './../../core/middlewares/validation/validationResult.middleware';
import {queryValidation} from '../../core/middlewares/validation/queryValidation.middleware';
import {UserSortFields} from '../enums';
import {idValidation} from '../../core/middlewares/validation/paramsValidation.middleware';
import {baseAuthGuard} from '../../auth/middlewares/baseAuthGuard.middleware';
import {userInputDtoValitation} from '../validation/userInputDto.validation';
import {UsersController} from './users.controller';

export const usersRouter = Router();
const usersController = container.get<UsersController>(USERS_DI_TYPES.UsersController);

usersRouter
  .get(
    '',
    baseAuthGuard,
    queryValidation(UserSortFields),
    validationResultMiddleware,
    usersController.getUsers.bind(usersController)
  )
  .post(
    '',
    baseAuthGuard,
    userInputDtoValitation,
    validationResultMiddleware,
    usersController.createUser.bind(usersController)
  )
  .delete(
    '/:id',
    baseAuthGuard,
    idValidation(),
    validationResultMiddleware,
    usersController.deleteUser.bind(usersController)
  );
