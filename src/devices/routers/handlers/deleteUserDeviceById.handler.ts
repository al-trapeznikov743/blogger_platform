import {Request, Response, NextFunction} from 'express';
import {devicesService} from '../../domain/devices.service';
import {RequestDevice} from '../../types/devices';
import {HttpStatus} from '../../../core/types/httpStatuses';

export const deleteUserDeviceById = async (
  {params, device}: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await devicesService.deleteUserDeviceById(params.id, device as RequestDevice);

    res.sendStatus(HttpStatus.NO_CONTENT_204);
  } catch (err: unknown) {
    next(err);
  }
};
