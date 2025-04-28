import {NextFunction, Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/httpStatuses';
import {postsService} from '../../application/posts.service';

export const deletePostHandler = async (
  {params}: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await postsService.delete(params.id);

    res.sendStatus(HttpStatus.NO_CONTENT_204);
  } catch (err: unknown) {
    next(err);
  }
};
