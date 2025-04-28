import {NextFunction, Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/httpStatuses';
import {postsService} from '../../application/posts.service';

export const getPostByIdHandler = async (
  {params}: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await postsService.findById(params.id);

    res.status(HttpStatus.OK_200).send(post);
  } catch (err: unknown) {
    next(err);
  }
};
