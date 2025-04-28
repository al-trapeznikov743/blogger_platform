import {NextFunction, Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/httpStatuses';
import {blogsService} from '../../application/blogs.service';

export const deleteBlogHandler = async (
  {params}: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await blogsService.delete(params.id);

    res.sendStatus(HttpStatus.NO_CONTENT_204);
  } catch (err: unknown) {
    next(err);
  }
};
