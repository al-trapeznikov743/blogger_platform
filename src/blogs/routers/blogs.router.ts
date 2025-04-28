import {Router} from 'express';
import {superAdminGuardMiddleware} from '../../auth/middlewares/superAdminGuard.middleware';
import {queryValidation} from './../../core/middlewares/validation/queryValidation.middleware';
import {validationResultMiddleware} from '../../core/middlewares/validation/validationResult.middleware';
import {idValidation} from '../../core/middlewares/validation/paramsValidation.middleware';
import {blogInputDtoValitation} from '../validation/blogInputDto.validation';
import {getBlogsHandler} from './handlers/getBlogs.handler';
import {getBlogByIdHandler} from './handlers/getBlogById.handler';
import {createBlogHandler} from './handlers/createBlog.handler';
import {deleteBlogHandler} from './handlers/deleteBlog.handler';
import {updateBlogHandler} from './handlers/updateBlog.handler';
import {getPostsByBlogIdHandler} from './handlers/getPostsByBlogId.handler';
import {createPostForBlogHandler} from './handlers/createPostForBlog.handler';
import {postInputWithoutBlogIdValidation} from '../../posts/validation/postInputDto.validation';
import {BlogSortField} from '../enums';

export const blogsRouter = Router();

blogsRouter
  .get('', queryValidation(BlogSortField), validationResultMiddleware, getBlogsHandler)

  .get('/:id', idValidation(), validationResultMiddleware, getBlogByIdHandler)

  .get(
    '/:id/posts',
    idValidation(),
    queryValidation(BlogSortField),
    validationResultMiddleware,
    getPostsByBlogIdHandler
  )

  .post(
    '',
    superAdminGuardMiddleware,
    blogInputDtoValitation,
    validationResultMiddleware,
    createBlogHandler
  )

  .post(
    '/:id/posts',
    superAdminGuardMiddleware,
    idValidation(),
    postInputWithoutBlogIdValidation,
    validationResultMiddleware,
    createPostForBlogHandler
  )

  .put(
    '/:id',
    superAdminGuardMiddleware,
    idValidation(),
    blogInputDtoValitation,
    validationResultMiddleware,
    updateBlogHandler
  )

  .delete(
    '/:id',
    superAdminGuardMiddleware,
    idValidation(),
    validationResultMiddleware,
    deleteBlogHandler
  );
