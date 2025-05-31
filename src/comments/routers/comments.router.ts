import {Router} from 'express';
import {accessTokenGuard} from '../../auth/middlewares/accessTokenGuard.middleware';
import {getCommentByIdHandler} from './handlers/getCommentById.handler';
import {updateCommentHandler} from './handlers/updateComment.handler';
import {deleteCommentHandler} from './handlers/deleteComment.handler';
import {idValidation} from '../../core/middlewares/validation/paramsValidation.middleware';
import {validationResultMiddleware} from '../../core/middlewares/validation/validationResult.middleware';
import {commentInputDtoValitation} from '../validation/commentinputDto.validation';

export const commentsRouter = Router();

commentsRouter
  .get('/:id', idValidation(), validationResultMiddleware, getCommentByIdHandler)

  .put(
    '/:id',
    accessTokenGuard,
    idValidation(),
    commentInputDtoValitation,
    validationResultMiddleware,
    updateCommentHandler
  )

  .delete(
    '/:id',
    accessTokenGuard,
    idValidation(),
    validationResultMiddleware,
    deleteCommentHandler
  );
