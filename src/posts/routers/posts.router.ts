import {Router} from 'express';
import {container} from '../../compositionRoot';
import {POST_DI_TYPES} from '../types/post';
import {baseAuthGuard} from '../../auth/middlewares/baseAuthGuard.middleware';
import {accessTokenGuard} from '../../auth/middlewares/accessTokenGuard.middleware';
import {idValidation} from '../../core/middlewares/validation/paramsValidation.middleware';
import {validationResultMiddleware} from '../../core/middlewares/validation/validationResult.middleware';
import {queryValidation} from '../../core/middlewares/validation/queryValidation.middleware';
import {postInputDtoValidation} from '../validation/postInputDto.validation';
import {commentInputDtoValitation} from '../../comments/validation/commentinputDto.validation';
import {PostSortFields} from '../enums';
import {CommentSortFields} from '../../comments/enums/comment.enums';
import {PostsController} from './posts.controller';

export const postsRouter = Router();
const postsController = container.get<PostsController>(POST_DI_TYPES.PostsController);

postsRouter
  .get(
    '',
    queryValidation(PostSortFields),
    validationResultMiddleware,
    postsController.getPosts.bind(postsController)
  )

  .get(
    '/:id',
    idValidation(),
    validationResultMiddleware,
    postsController.getPostById.bind(postsController)
  )

  .get(
    '/:id/comments',
    idValidation(),
    queryValidation(CommentSortFields),
    validationResultMiddleware,
    postsController.searchComments.bind(postsController)
  )

  .post(
    '',
    baseAuthGuard,
    postInputDtoValidation,
    validationResultMiddleware,
    postsController.createPost.bind(postsController)
  )

  .post(
    '/:id/comments',
    accessTokenGuard,
    idValidation(),
    commentInputDtoValitation,
    validationResultMiddleware,
    postsController.createComment.bind(postsController)
  )

  .put(
    '/:id',
    baseAuthGuard,
    idValidation(),
    postInputDtoValidation,
    validationResultMiddleware,
    postsController.updatePost.bind(postsController)
  )

  .delete(
    '/:id',
    baseAuthGuard,
    idValidation(),
    validationResultMiddleware,
    postsController.deletePost.bind(postsController)
  );
