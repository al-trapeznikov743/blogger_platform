import {NextFunction, Response, Request} from 'express';
import {HttpStatus} from '../../../core/types/httpStatuses';
import {usersService} from '../../../users/domain/users.service';

export const authMeHandler = async (
  {user}: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {id: userId, email, login} = await usersService.getUserById(user!.id);

    res.status(HttpStatus.OK_200).send({userId, email, login});
  } catch (err: unknown) {
    next(err);
  }
};
