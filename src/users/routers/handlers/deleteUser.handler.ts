import {NextFunction, Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/httpStatuses';
import {usersService} from '../../domain/users.service';

export const deleteUserHandler = async (
  {params}: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await usersService.delete(params.id);

    res.sendStatus(HttpStatus.NO_CONTENT_204);
  } catch (err: unknown) {
    next(err);
  }
};
