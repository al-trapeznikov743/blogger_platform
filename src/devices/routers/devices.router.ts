import {Router} from 'express';
import {getUserDevices} from './handlers/getUserDevices.handler';
import {deleteOtherUserDevices} from './handlers/deleteOtherUserDevices.handler';
import {deleteUserDeviceById} from './handlers/deleteUserDeviceById.handler';
import {refreshTokenGuard} from '../../auth/middlewares/refreshTokenGuard.middleware';

export const devicesRouter = Router();

devicesRouter
  .get('', refreshTokenGuard, getUserDevices)

  .delete('', refreshTokenGuard, deleteOtherUserDevices)

  .delete('/:id', refreshTokenGuard, deleteUserDeviceById);
