import {Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/httpStatuses';
import {blogsRepository} from '../../repositories/blogs.repository';

export const getBlogsHandler = (_: Request, res: Response) => {
  try {
    // const drivers = await driversRepository.findAll();
    // const driverViewModels = drivers.map(mapToDriverViewModel);
    // res.send(driverViewModels);
    const blogs = blogsRepository.findAll();

    res.status(HttpStatus.OK_200).send(blogs);
  } catch (_: unknown) {
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR_500);
  }
};
