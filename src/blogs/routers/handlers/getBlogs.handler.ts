import {NextFunction, Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/httpStatuses';
import {blogsService} from '../../application/blogs.service';
import {getQueryOptions} from '../../../shared/utils';

export const getBlogsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const options = getQueryOptions(req.query);

  try {
    const blogs = await blogsService.findMany(options);

    res.status(HttpStatus.OK_200).send(blogs);
  } catch (err: unknown) {
    next(err);
  }
};
