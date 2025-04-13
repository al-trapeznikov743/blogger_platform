import {Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/httpStatuses';
import {createErrorMessages} from '../../../core/utils/error.utils';
import {postsRepository} from '../../repositories/posts.repository';
import {blogsRepository} from '../../../blogs/repositories/blogs.repository';

export const createPostHandler = ({body}: Request, res: Response) => {
  // const errors = createVideoInputDtoValidation(body);

  /* if (errors.length) {
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

  const newPost = postsRepository.create({
    ...body,
    id: Date.now().toString(),
    blogId: blog.id,
    blogName: blog.name
  });

  res.status(HttpStatus.CREATED_201).send(newPost);
};
