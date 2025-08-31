import {Router} from 'express';
import {container} from '../../compositionRoot';
import {DEVICES_DI_TYPES} from '../types/devices';
import {refreshTokenGuard} from '../../auth/middlewares/refreshTokenGuard.middleware';
import {DevicesController} from './devices.controller';

export const devicesRouter = Router();
const devicesController = container.get<DevicesController>(
  DEVICES_DI_TYPES.DevicesController
);

devicesRouter
  .get('', refreshTokenGuard, devicesController.getUserDevices.bind(devicesController))

  .delete(
    '',
    refreshTokenGuard,
    devicesController.deleteOtherUserDevices.bind(devicesController)
  )

  .delete(
    '/:id',
    refreshTokenGuard,
    devicesController.deleteUserDeviceById.bind(devicesController)
  );
