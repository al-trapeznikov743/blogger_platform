import {Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/httpStatuses';
import {createErrorMessages} from '../../../core/utils/error.utils';
import {postsRepository} from '../../repositories/posts.repository';

export const deletePostHandler = async ({params}: Request, res: Response) => {
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

    await postsRepository.delete(params.id);

    res.sendStatus(HttpStatus.NO_CONTENT_204);
  } catch (_: unknown) {
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR_500);
  }
};
