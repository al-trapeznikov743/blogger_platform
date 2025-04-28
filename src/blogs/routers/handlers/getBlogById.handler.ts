import {NextFunction, Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/httpStatuses';
import {blogsService} from '../../application/blogs.service';

export const getBlogByIdHandler = async (
  {params}: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blog = await blogsService.findById(params.id);

    res.status(HttpStatus.OK_200).send(blog);
  } catch (err: unknown) {
    next(err);
  }
};
