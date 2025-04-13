import {Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/httpStatuses';
import {createErrorMessages} from '../../../core/utils/error.utils';
import {postsRepository} from '../../repositories/posts.repository';
import {blogsRepository} from '../../../blogs/repositories/blogs.repository';

export const updatePostHandler = ({params, body}: Request, res: Response) => {
  const post = postsRepository.findById(params.id);

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
  /* const errors = updateVideoInputDtoValidation(body);

  if (errors.length) {
    res.status(HttpStatus.BAD_REQUEST_400).send(createErrorMessages(errors));

    return;
  } */

  const blog = blogsRepository.findById(body.blogId);

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
    blogId: blog.id,
    blogName: blog.name
  });

  res.sendStatus(HttpStatus.NO_CONTENT_204);
};
