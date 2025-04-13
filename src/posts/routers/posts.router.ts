import {Router} from 'express';
import {superAdminGuardMiddleware} from '../../auth/middlewares/superAdminGuard.middleware';
import {getPostsHandler} from './handlers/getPosts.handler';
import {getPostByIdHandler} from './handlers/getPostById.handler';
import {updatePostHandler} from './handlers/updatePost.handler';
import {createPostHandler} from './handlers/createPost.handler';
import {deletePostHandler} from './handlers/deletePost.handler';
import {idValidation} from '../../core/middlewares/validation/paramsValidation.middleware';
import {validationResultMiddleware} from '../../core/middlewares/validation/validationResult.middleware';
import {postInputDtoValitation} from '../validation/postInputDto.validation';

export const postsRouter = Router();

postsRouter
  .get('', getPostsHandler)

  .get('/:id', idValidation, validationResultMiddleware, getPostByIdHandler)

  .post(
    '',
    superAdminGuardMiddleware,
    postInputDtoValitation,
    validationResultMiddleware,
    createPostHandler
  )

  .put(
    '/:id',
    superAdminGuardMiddleware,
    postInputDtoValitation,
    validationResultMiddleware,
    updatePostHandler
  )

  .delete(
    '/:id',
    superAdminGuardMiddleware,
    idValidation,
    validationResultMiddleware,
    deletePostHandler
  );
