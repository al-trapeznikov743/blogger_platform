import {NextFunction, Request, Response} from 'express';
import {authService} from '../../domain/auth.service';
import {HttpStatus} from '../../../core/types/httpStatuses';

export const refreshTokenHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;

    const {accessToken, refreshToken} = await authService.refreshToken(oldRefreshToken);

    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true, // true — для HTTPS; в dev-режиме можно временно поставить false
        sameSite: 'none', // политика кросс-доменных запросов
        path: '/auth/refresh-token',
        maxAge: 20_000
      })
      .status(HttpStatus.OK_200)
      .send({accessToken});
  } catch (err: unknown) {
    next(err);
  }
};
