import {NextFunction, Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/httpStatuses';
import {postsService} from '../../domain/posts.service';
import {getQueryOptions} from '../../../shared/utils';

export const getPostsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const options = getQueryOptions(req.query);

  try {
    const posts = await postsService.findMany(options);

    res.status(HttpStatus.OK_200).send(posts);
  } catch (err: unknown) {
    next(err);
  }
};
