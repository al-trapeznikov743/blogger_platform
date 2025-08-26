import {NextFunction, Request, Response} from 'express';
import {devicesService} from '../../domain/devices.service';
import {RequestDevice} from '../../types/devices';
import {HttpStatus} from '../../../core/types/httpStatuses';

export const deleteOtherUserDevices = async (
  {device}: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await devicesService.deleteOtherUserDevices(device as RequestDevice);

    res.sendStatus(HttpStatus.NO_CONTENT_204);
  } catch (err: unknown) {
    next(err);
  }
};
