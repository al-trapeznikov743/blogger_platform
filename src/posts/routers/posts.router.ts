import {Router} from 'express';
import {superAdminGuardMiddleware} from '../../auth/middlewares/superAdminGuard.middleware';
import {getPostsHandler} from './handlers/getPosts.handler';
import {getPostByIdHandler} from './handlers/getPostById.handler';
import {updatePostHandler} from './handlers/updatePost.handler';
import {createPostHandler} from './handlers/createPost.handler';
import {deletePostHandler} from './handlers/deletePost.handler';
import {idValidation} from '../../core/middlewares/validation/paramsValidation.middleware';
import {validationResultMiddleware} from '../../core/middlewares/validation/validationResult.middleware';
import {queryValidation} from '../../core/middlewares/validation/queryValidation.middleware';
import {postInputDtoValidation} from '../validation/postInputDto.validation';
import {PostSortFields} from '../enums';

export const postsRouter = Router();

postsRouter
  .get('', queryValidation(PostSortFields), validationResultMiddleware, getPostsHandler)

  .get('/:id', idValidation(), validationResultMiddleware, getPostByIdHandler)

  .post(
    '',
    superAdminGuardMiddleware,
    postInputDtoValidation,
    validationResultMiddleware,
    createPostHandler
  )

  .put(
    '/:id',
    superAdminGuardMiddleware,
    idValidation(),
    postInputDtoValidation,
    validationResultMiddleware,
    updatePostHandler
  )

  .delete(
    '/:id',
    superAdminGuardMiddleware,
    idValidation(),
    validationResultMiddleware,
    deletePostHandler
  );
