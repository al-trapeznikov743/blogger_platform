import {NextFunction, Request, Response} from 'express';
import {devicesService} from '../../domain/devices.service';
import {HttpStatus} from '../../../core/types/httpStatuses';
import {RequestDevice} from '../../types/devices';

export const getUserDevices = async (
  {device}: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const devices = await devicesService.getUserDevices(device as RequestDevice);

    res.status(HttpStatus.OK_200).send(devices);
  } catch (err: unknown) {
    next(err);
  }
};
