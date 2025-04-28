import {NextFunction, Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/httpStatuses';
import {blogsService} from '../../application/blogs.service';

export const createBlogHandler = async (
  {body}: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const createdBlog = await blogsService.create(body);

    res.status(HttpStatus.CREATED_201).send(createdBlog);
  } catch (err: unknown) {
    next(err);
  }
};
