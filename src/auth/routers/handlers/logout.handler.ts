import {NextFunction, Request, Response} from 'express';
import {HttpStatus} from '../../../core/types/httpStatuses';
import {authService} from '../../domain/auth.service';

export const logoutHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;

    await authService.logoutUser(oldRefreshToken);

    res.sendStatus(HttpStatus.NO_CONTENT_204);
  } catch (err) {
    next(err);
  }
};
