import {NextFunction, Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/httpStatuses';
import {commentsService} from '../../../comments/domain/comments.service';

export const createCommentHandler = async (
  {params, user, body}: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const comment = await commentsService.create(params.id, user!.id, body);

    res.status(HttpStatus.CREATED_201).send(comment);
  } catch (err: unknown) {
    next(err);
  }
};
