import {Router} from 'express';
import {container} from '../../compositionRoot';
import {COMMENTS_DI_TYPES} from '../types/comment';
import {accessTokenGuard} from '../../auth/middlewares/accessTokenGuard.middleware';
import {idValidation} from '../../core/middlewares/validation/paramsValidation.middleware';
import {validationResultMiddleware} from '../../core/middlewares/validation/validationResult.middleware';
import {commentInputDtoValitation} from '../validation/commentinputDto.validation';
import {CommentsController} from './comments.controller';

export const commentsRouter = Router();
const commentsController = container.get<CommentsController>(
  COMMENTS_DI_TYPES.CommentsController
);

commentsRouter
  .get(
    '/:id',
    idValidation(),
    validationResultMiddleware,
    commentsController.getCommentById.bind(commentsController)
  )

  .put(
    '/:id',
    accessTokenGuard,
    idValidation(),
    commentInputDtoValitation,
    validationResultMiddleware,
    commentsController.updateComment.bind(commentsController)
  )

  .delete(
    '/:id',
    accessTokenGuard,
    idValidation(),
    validationResultMiddleware,
    commentsController.deleteComment.bind(commentsController)
  );
