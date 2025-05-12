import {NextFunction, Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/httpStatuses';
import {getQueryOptions} from '../../../shared/utils';
import {usersQueryRepository} from '../../repositories/users.query.repository';

export const getUsersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const options = getQueryOptions(req.query);

  try {
    const users = await usersQueryRepository.findUsers(options);

    res.status(HttpStatus.OK_200).send(users);
  } catch (err: unknown) {
    next(err);
  }
};
