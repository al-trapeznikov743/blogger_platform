import {Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/httpStatuses';
import {postsRepository} from '../../repositories/posts.repository';
import {mapMongoId} from '../../../db/utils';

export const getPostsHandler = async (_: Request, res: Response) => {
  try {
    const posts = await postsRepository.findAll();
    const postsRes = posts.map((post) => mapMongoId(post));

    res.status(HttpStatus.OK_200).send(postsRes);
  } catch (_: unknown) {
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR_500);
  }
};
