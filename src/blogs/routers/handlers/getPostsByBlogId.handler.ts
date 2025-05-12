import {NextFunction, Request, Response} from 'express';
import {getQueryOptions} from '../../../shared/utils';
import {HttpStatus} from '../../../core/types/httpStatuses';
import {postsService} from '../../../posts/domain/posts.service';

export const getPostsByBlogIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const blogId = req.params.id;
  const options = getQueryOptions(req.query);

  try {
    const posts = await postsService.findPostsByBlogId(blogId, options);

    res.status(HttpStatus.OK_200).send(posts);
  } catch (err: unknown) {
    next(err);
  }
};
