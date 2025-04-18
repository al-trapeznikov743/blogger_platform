import {Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/httpStatuses';
import {createErrorMessages} from '../../../core/utils/error.utils';
import {postsRepository} from '../../repositories/posts.repository';

export const getPostByIdHandler = ({params}: Request, res: Response) => {
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

  res.status(HttpStatus.OK_200).send(post);
};
