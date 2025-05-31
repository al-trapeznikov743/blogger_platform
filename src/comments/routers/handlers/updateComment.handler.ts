import {NextFunction, Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/httpStatuses';
import {commentsService} from '../../domain/comments.service';

export const updateCommentHandler = async (
  {params, body, user}: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await commentsService.update(user!.id, params.id, body);

    res.sendStatus(HttpStatus.NO_CONTENT_204);
  } catch (err: unknown) {
    next(err);
  }
};
