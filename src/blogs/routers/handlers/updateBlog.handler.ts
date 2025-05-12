import {NextFunction, Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/httpStatuses';
import {blogsService} from '../../domain/blogs.service';

export const updateBlogHandler = async (
  {params, body}: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await blogsService.update(params.id, body);

    res.sendStatus(HttpStatus.NO_CONTENT_204);
  } catch (err: unknown) {
    next(err);
  }
};
