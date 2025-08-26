import {NextFunction, Request, Response} from 'express';
import {authService} from '../../domain/auth.service';
import {HttpStatus} from '../../../core/types/httpStatuses';
import {RequestDevice, RequestUserData} from '../../../devices/types/devices';

export const refreshTokenHandler = async (
  {device, headers, ip}: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const requestData = {
      ip,
      device: headers?.['user-agent'] || 'Unknown device'
    } as RequestUserData;

    const {accessToken, refreshToken} = await authService.refreshToken(
      device as RequestDevice,
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
