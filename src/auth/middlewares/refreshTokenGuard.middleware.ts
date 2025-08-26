import {NextFunction, Request, Response} from 'express';
import {config} from '../../core/settings/config';
import {HttpStatus} from '../../core/types/httpStatuses';
import {jwtService} from '../adapters/jwt.adapter';
import {devicesService} from '../../devices/domain/devices.service';

export const refreshTokenGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    res.sendStatus(HttpStatus.UNAUTHORIZED_401);

    return;
  }

  let payload;

  try {
    payload = await jwtService.verifyToken(refreshToken, config.RT_SECRET);
  } catch (err) {
    res.sendStatus(HttpStatus.UNAUTHORIZED_401);

    return;
  }

  const {userId, deviceId, iat} = payload;

  const [targetDevice] = await devicesService.searchDeviceSessions({deviceId, iat});

  if (!targetDevice) {
    res.sendStatus(HttpStatus.UNAUTHORIZED_401);

    return;
  }

  req.device = {userId, deviceId, iat};

  next();
};
