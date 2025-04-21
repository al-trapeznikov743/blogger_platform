import {Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/httpStatuses';
import {createErrorMessages} from '../../../core/utils/error.utils';
import {postsRepository} from '../../repositories/posts.repository';
import {blogsRepository} from '../../../blogs/repositories/blogs.repository';

export const updatePostHandler = async ({params, body}: Request, res: Response) => {
  try {
    const post = await postsRepository.findById(params.id);

    if (!post) {
      res.status(HttpStatus.NOT_FOUND_404).send(
        createErrorMessages([
          {
            field: 'id',
            message: 'Post not found'
          }
        ])
      );

      return;
    }

    const blog = await blogsRepository.findById(body.blogId);

    if (!blog) {
      res.status(HttpStatus.NOT_FOUND_404).send(
        createErrorMessages([
          {
            field: 'blogId',
            message: `Blog with ID=${body.blogId} does not exist`
          }
        ])
      );

      return;
    }

    postsRepository.update(params.id, {
      ...body,
      blogId: blog._id.toString(),
      blogName: blog.name
    });

    res.sendStatus(HttpStatus.NO_CONTENT_204);
  } catch (_: unknown) {
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR_500);
  }
};
