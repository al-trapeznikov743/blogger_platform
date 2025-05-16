import {validationResultMiddleware} from './../../core/middlewares/validation/validationResult.middleware';
import {Router} from 'express';
import {getUsersHandler} from './handlers/getUsers.handler';
import {createUserHandler} from './handlers/createUser.handler';
import {deleteUserHandler} from './handlers/deleteUser.handler';
import {queryValidation} from '../../core/middlewares/validation/queryValidation.middleware';
import {UserSortFields} from '../enums';
import {idValidation} from '../../core/middlewares/validation/paramsValidation.middleware';
import {baseAuthGuard} from '../../auth/middlewares/baseAuthGuard.middleware';
import {userInputDtoValitation} from '../validation/userInputDto.validation';

export const usersRouter = Router();

usersRouter
  .get(
    '',
    baseAuthGuard,
    queryValidation(UserSortFields),
    validationResultMiddleware,
    getUsersHandler
  )
  .post(
    '',
    baseAuthGuard,
    userInputDtoValitation,
    validationResultMiddleware,
    createUserHandler
  )
  .delete(
    '/:id',
    baseAuthGuard,
    idValidation(),
    validationResultMiddleware,
    deleteUserHandler
  );
