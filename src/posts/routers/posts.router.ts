import {Router} from 'express';
import {baseAuthGuard} from '../../auth/middlewares/baseAuthGuard.middleware';
import {accessTokenGuard} from '../../auth/middlewares/accessTokenGuard.middleware';
import {getPostsHandler} from './handlers/getPosts.handler';
import {getPostByIdHandler} from './handlers/getPostById.handler';
import {updatePostHandler} from './handlers/updatePost.handler';
import {createPostHandler} from './handlers/createPost.handler';
import {deletePostHandler} from './handlers/deletePost.handler';
import {createCommentHandler} from './handlers/createComment.handler';
import {searchCommentsHandler} from './handlers/searchComments.handler';
import {idValidation} from '../../core/middlewares/validation/paramsValidation.middleware';
import {validationResultMiddleware} from '../../core/middlewares/validation/validationResult.middleware';
import {queryValidation} from '../../core/middlewares/validation/queryValidation.middleware';
import {postInputDtoValidation} from '../validation/postInputDto.validation';
import {commentInputDtoValitation} from '../../comments/validation/commentinputDto.validation';
import {PostSortFields} from '../enums';
import {CommentSortFields} from '../../comments/enums/comment.enums';

export const postsRouter = Router();

postsRouter
  .get('', queryValidation(PostSortFields), validationResultMiddleware, getPostsHandler)

  .get('/:id', idValidation(), validationResultMiddleware, getPostByIdHandler)

  .get(
    '/:id/comments',
    idValidation(),
    queryValidation(CommentSortFields),
    validationResultMiddleware,
    searchCommentsHandler
  )

  .post(
    '',
    baseAuthGuard,
    postInputDtoValidation,
    validationResultMiddleware,
    createPostHandler
  )

  .post(
    '/:id/comments',
    accessTokenGuard,
    idValidation(),
    commentInputDtoValitation,
    validationResultMiddleware,
    createCommentHandler
  )

  .put(
    '/:id',
    baseAuthGuard,
    idValidation(),
    postInputDtoValidation,
    validationResultMiddleware,
    updatePostHandler
  )

  .delete(
    '/:id',
    baseAuthGuard,
    idValidation(),
    validationResultMiddleware,
    deletePostHandler
  );
