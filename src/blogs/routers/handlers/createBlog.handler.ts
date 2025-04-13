import {Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/httpStatuses';
import {createErrorMessages} from '../../../core/utils/error.utils';
import {blogsRepository} from '../../repositories/blogs.repository';

export const createBlogHandler = ({body}: Request, res: Response) => {
  // const errors = createVideoInputDtoValidation(body);

  /* if (errors.length) {
    res.status(HttpStatus.BAD_REQUEST_400).send(createErrorMessages(errors));

    return;
  } */

  const newBlog = blogsRepository.create({
    id: Date.now().toString(),
    ...body
  });

  res.status(HttpStatus.CREATED_201).send(newBlog);
};
