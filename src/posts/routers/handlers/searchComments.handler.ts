import {NextFunction, Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/httpStatuses';
import {getQueryOptions} from '../../../shared/utils';
import {commentsService} from '../../../comments/domain/comments.service';
import {postsService} from '../../domain/posts.service';

export const searchCommentsHandler = async (
  {params, query}: Request,
  res: Response,
  next: NextFunction
) => {
  const options = getQueryOptions(query);

  try {
    const post = await postsService.findById(params.id);
    const comments = await commentsService.findManyByPostId(post.id, options);

    res.status(HttpStatus.OK_200).send(comments);
  } catch (err: unknown) {
    next(err);
  }
};
