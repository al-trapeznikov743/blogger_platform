import {NextFunction, Request, Response} from 'express';
import {usersService} from '../../domain/users.service';
import {HttpStatus} from '../../../core/types/httpStatuses';
import {RequestWithBody} from '../../../core/types/requests';
import {UserInputDto} from '../../types/user';

export const createUserHandler = async (
  {body: {login, email, password}}: RequestWithBody<UserInputDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const createdUser = await usersService.create(login, email, password);

    res.status(HttpStatus.CREATED_201).send(createdUser);
  } catch (err: unknown) {
    next(err);
  }
};
