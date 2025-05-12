import {NextFunction, Request, Response} from 'express';
import {usersService} from '../../domain/users.service';
import {HttpStatus} from '../../../core/types/httpStatuses';

export const createUserHandler = async (
  {body}: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const createdUser = await usersService.create(body);

    res.status(HttpStatus.CREATED_201).send(createdUser);
  } catch (err: unknown) {
    next(err);
  }
};
