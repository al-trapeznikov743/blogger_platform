import {Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/httpStatuses';
import {createErrorMessages} from '../../../core/utils/error.utils';
import {blogsRepository} from '../../repositories/blogs.repository';
import {mapMongoId} from '../../../db/utils';

export const getBlogByIdHandler = async ({params}: Request, res: Response) => {
  try {
    const resBlog = await blogsRepository.findById(params.id);

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

    res.status(HttpStatus.OK_200).send(mapMongoId(resBlog));
  } catch (_: unknown) {
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR_500);
  }
};
