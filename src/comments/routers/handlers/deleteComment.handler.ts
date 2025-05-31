import {NextFunction, Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/httpStatuses';
import {commentsService} from '../../domain/comments.service';

export const deleteCommentHandler = async (
  {params, user}: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await commentsService.delete(user!.id, params.id);

    res.sendStatus(HttpStatus.NO_CONTENT_204);
  } catch (err: unknown) {
    next(err);
  }
};
