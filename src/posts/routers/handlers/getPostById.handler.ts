import {Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/httpStatuses';
import {createErrorMessages} from '../../../core/utils/error.utils';
import {postsRepository} from '../../repositories/posts.repository';
import {mapMongoId} from '../../../db/utils';

export const getPostByIdHandler = async ({params}: Request, res: Response) => {
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

    res.status(HttpStatus.OK_200).send(mapMongoId(post));
  } catch (_: unknown) {
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR_500);
  }
};
