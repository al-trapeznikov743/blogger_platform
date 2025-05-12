import {NextFunction, Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/httpStatuses';
import {postsService} from '../../domain/posts.service';

export const createPostHandler = async (
  {body}: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await postsService.create(body);

    res.status(HttpStatus.CREATED_201).send(post);
  } catch (err: unknown) {
    next(err);
  }
};
