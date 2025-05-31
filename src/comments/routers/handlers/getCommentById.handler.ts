import {NextFunction, Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/httpStatuses';
import {commentsService} from '../../domain/comments.service';

export const getCommentByIdHandler = async (
  {params}: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const comment = await commentsService.findCommentById(params.id);

    res.status(HttpStatus.OK_200).send(comment);
  } catch (err: unknown) {
    next(err);
  }
};
