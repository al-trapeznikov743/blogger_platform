import {Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/httpStatuses';
import {createErrorMessages} from '../../../core/utils/error.utils';
import {blogsRepository} from '../../repositories/blogs.repository';

export const getBlogByIdHandler = ({params}: Request, res: Response) => {
  const resBlog = blogsRepository.findById(params.id);

  if (!resBlog) {
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

  res.status(HttpStatus.OK_200).send(resBlog);
};
