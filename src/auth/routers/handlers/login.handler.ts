import {NextFunction, Response} from 'express';
import {authService} from '../../domain/auth.service';
import {HttpStatus} from '../../../core/types/httpStatuses';
import {RequestWithBody} from '../../../core/types/requests';
import {LoginDto} from '../../types/auth';
import {RequestUserData} from '../../../devices/types/devices';

export const loginHandler = async (
  {body: {loginOrEmail, password}, headers, ip}: RequestWithBody<LoginDto>,
  res: Response,
  next: NextFunction
) => {
  const requestData = {
    ip,
    device: headers?.['user-agent'] || 'Unknown device'
  } as RequestUserData;

  try {
    const {accessToken, refreshToken} = await authService.loginUser(
      loginOrEmail,
      password,
      requestData
    );

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
