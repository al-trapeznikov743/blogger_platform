import {NextFunction, Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/httpStatuses';
import {postsService} from '../../domain/posts.service';

export const updatePostHandler = async (
  {params, body}: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await postsService.update(params.id, body);

    res.sendStatus(HttpStatus.NO_CONTENT_204);
  } catch (err: unknown) {
    next(err);
  }
};
