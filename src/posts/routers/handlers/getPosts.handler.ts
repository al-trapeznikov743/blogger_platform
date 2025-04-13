import {Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/httpStatuses';
import {postsRepository} from '../../repositories/posts.repository';

export const getPostsHandler = (_: Request, res: Response) => {
  try {
    const posts = postsRepository.findAll();

    res.status(HttpStatus.OK_200).send(posts);
  } catch (_: unknown) {
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR_500);
  }
};
