import {Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/httpStatuses';
import {createErrorMessages} from '../../../core/utils/error.utils';
import {postsRepository} from '../../repositories/posts.repository';
import {blogsRepository} from '../../../blogs/repositories/blogs.repository';
import {mapMongoId} from '../../../db/utils';

export const createPostHandler = async ({body}: Request, res: Response) => {
  try {
    const blog = await blogsRepository.findById(body.blogId);

    if (!blog) {
      res.status(HttpStatus.NOT_FOUND_404).send(
        createErrorMessages([
          {
            field: 'blogId',
            message: `Blog with ID=${body.blogId} does not exist`
          }
        ])
      );

      return;
    }

    const newPost = await postsRepository.create({
      ...body,
      blogId: blog._id.toString(),
      blogName: blog.name,
      createdAt: new Date().toISOString()
    });

    res.status(HttpStatus.CREATED_201).send(mapMongoId(newPost));
  } catch (_: unknown) {
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR_500);
  }
};
