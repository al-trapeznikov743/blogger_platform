import {Router} from 'express';
import {container} from '../../compositionRoot';
import {BLOG_DI_TYPES} from '../types/blog';
import {baseAuthGuard} from '../../auth/middlewares/baseAuthGuard.middleware';
import {queryValidation} from './../../core/middlewares/validation/queryValidation.middleware';
import {validationResultMiddleware} from '../../core/middlewares/validation/validationResult.middleware';
import {idValidation} from '../../core/middlewares/validation/paramsValidation.middleware';
import {blogInputDtoValitation} from '../validation/blogInputDto.validation';
import {postInputWithoutBlogIdValidation} from '../../posts/validation/postInputDto.validation';
import {BlogSortFields} from '../enums';
import {PostSortFields} from '../../posts/enums';
import {BlogsController} from './blogs.controller';

export const blogsRouter = Router();
const blogsController = container.get<BlogsController>(BLOG_DI_TYPES.BlogsController);

blogsRouter
  .get(
    '',
    queryValidation(BlogSortFields),
    validationResultMiddleware,
    blogsController.getBlogs.bind(blogsController)
  )

  .get(
    '/:id',
    idValidation(),
    validationResultMiddleware,
    blogsController.getBlogById.bind(blogsController)
  )

  .get(
    '/:id/posts',
    idValidation(),
    queryValidation(PostSortFields),
    validationResultMiddleware,
    blogsController.getPostsByBlogId.bind(blogsController)
  )

  .post(
    '',
    baseAuthGuard,
    blogInputDtoValitation,
    validationResultMiddleware,
    blogsController.createBlog.bind(blogsController)
  )

  .post(
    '/:id/posts',
    baseAuthGuard,
    idValidation(),
    postInputWithoutBlogIdValidation,
    validationResultMiddleware,
    blogsController.createPostForBlog.bind(blogsController)
  )

  .put(
    '/:id',
    baseAuthGuard,
    idValidation(),
    blogInputDtoValitation,
    validationResultMiddleware,
    blogsController.updateBlog.bind(blogsController)
  )

  .delete(
    '/:id',
    baseAuthGuard,
    idValidation(),
    validationResultMiddleware,
    blogsController.deleteBlog.bind(blogsController)
  );
