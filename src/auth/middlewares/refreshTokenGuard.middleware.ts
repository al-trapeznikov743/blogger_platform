import {NextFunction, Request, Response} from 'express';
import {container} from '../../compositionRoot';
import {config} from '../../core/settings/config';
import {HttpStatus} from '../../core/types/httpStatuses';
import {JwtService} from '../adapters/jwt.adapter';
import {DevicesService} from '../../devices/domain/devices.service';
import {DEVICES_DI_TYPES} from '../../devices/types/devices';
import {ADAPTERS_DI_TYPES} from '../types/adapters';

const devicesService = container.get<DevicesService>(DEVICES_DI_TYPES.DevicesService);
const jwtService = container.get<JwtService>(ADAPTERS_DI_TYPES.JwtService);

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
