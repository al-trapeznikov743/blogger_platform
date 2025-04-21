import {Router} from 'express';
import {superAdminGuardMiddleware} from '../../auth/middlewares/superAdminGuard.middleware';
import {validationResultMiddleware} from '../../core/middlewares/validation/validationResult.middleware';
import {idValidation} from '../../core/middlewares/validation/paramsValidation.middleware';
import {blogInputDtoValitation} from '../validation/blogInputDto.validation';
import {getBlogsHandler} from './handlers/getBlogs.handler';
import {getBlogByIdHandler} from './handlers/getBlogById.handler';
import {createBlogHandler} from './handlers/createBlog.handler';
import {deleteBlogHandler} from './handlers/deleteBlog.handler';
import {updateBlogHandler} from './handlers/updateBlog.handler';

export const blogsRouter = Router();

blogsRouter
  .get('', getBlogsHandler)

  .get('/:id', idValidation(), validationResultMiddleware, getBlogByIdHandler)

  .post(
    '',
    superAdminGuardMiddleware,
    blogInputDtoValitation,
    validationResultMiddleware,
    createBlogHandler
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
