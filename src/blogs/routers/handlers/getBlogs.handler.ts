import {Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/httpStatuses';
import {blogsRepository} from '../../repositories/blogs.repository';
import {mapMongoId} from '../../../db/utils';

export const getBlogsHandler = async (_: Request, res: Response) => {
  try {
    const blogs = await blogsRepository.findAll();
    const blogsRes = blogs.map((blog) => mapMongoId(blog));

    res.status(HttpStatus.OK_200).send(blogsRes);
  } catch (_: unknown) {
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR_500);
  }
};
