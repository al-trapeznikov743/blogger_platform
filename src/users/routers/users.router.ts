import {validationResultMiddleware} from './../../core/middlewares/validation/validationResult.middleware';
import {Router} from 'express';
import {getUsersHandler} from './handlers/getUsers.handler';
import {createUserHandler} from './handlers/createUser.handler';
import {deleteUserHandler} from './handlers/deleteUser.handler';
import {queryValidation} from '../../core/middlewares/validation/queryValidation.middleware';
import {UserSortFields} from '../enums';
import {idValidation} from '../../core/middlewares/validation/paramsValidation.middleware';
import {superAdminGuardMiddleware} from '../../auth/middlewares/superAdminGuard.middleware';
import {userInputDtoValitation} from '../validation/userInputDto.validation';

export const usersRouter = Router();

usersRouter
  .get(
    '',
    superAdminGuardMiddleware,
    queryValidation(UserSortFields),
    validationResultMiddleware,
    getUsersHandler
  )
  .post(
    '',
    superAdminGuardMiddleware,
    userInputDtoValitation,
    validationResultMiddleware,
    createUserHandler
  )
  .delete(
    '/:id',
    superAdminGuardMiddleware,
    idValidation(),
    validationResultMiddleware,
    deleteUserHandler
  );
