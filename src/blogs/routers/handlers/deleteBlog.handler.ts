import {Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/httpStatuses';
import {createErrorMessages} from '../../../core/utils/error.utils';
import {blogsRepository} from '../../repositories/blogs.repository';

export const deleteBlogHandler = ({params}: Request, res: Response) => {
  const blog = blogsRepository.findById(params.id);

  if (!blog) {
    res.status(HttpStatus.NOT_FOUND_404).send(
      createErrorMessages([
        {
          field: 'id',
          message: 'Blog not found'
        }
      ])
    );

    return;
  }

  blogsRepository.delete(params.id);

  res.sendStatus(HttpStatus.NO_CONTENT_204);
};
