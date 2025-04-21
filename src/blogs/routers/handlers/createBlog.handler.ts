import {Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/httpStatuses';
import {blogsRepository} from '../../repositories/blogs.repository';
import {mapMongoId} from '../../../db/utils';

export const createBlogHandler = async ({body}: Request, res: Response) => {
  try {
    const newBlog = await blogsRepository.create({
      ...body,
      createdAt: new Date().toISOString(),
      isMembership: false
    });

    res.status(HttpStatus.CREATED_201).send(mapMongoId(newBlog));
  } catch (_: unknown) {
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR_500);
  }
};
