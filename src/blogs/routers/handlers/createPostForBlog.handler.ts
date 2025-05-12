import {NextFunction, Request, Response} from 'express';
import {postsService} from '../../../posts/domain/posts.service';
import {HttpStatus} from '../../../core/types/httpStatuses';

export const createPostForBlogHandler = async (
  {params, body}: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await postsService.createPostForBlog(params.id, body);

    res.status(HttpStatus.CREATED_201).send(post);
  } catch (err: unknown) {
    next(err);
  }
};
