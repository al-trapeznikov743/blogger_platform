import jwt, {JwtPayload} from 'jsonwebtoken';
import {devicesRepository} from '../repositories/devices.repository';
import {
  BaseDeviceSession,
  DeviceSession,
  DeviceViewType,
  RequestDevice,
  SearchDeviceBody,
  UpdateDeviceBody
} from '../types/devices';
import {ForbiddenError, NotFoundError} from '../../core/errors';

export const devicesService = {
  async createDeviceSession(device: BaseDeviceSession): Promise<string> {
    return devicesRepository.createDeviceSession(device);
  },

  async searchDeviceSessions(body: SearchDeviceBody): Promise<DeviceSession[]> {
    return devicesRepository.searchDeviceSessions(body);
  },

  async updateDeviceSession(id: string, body: UpdateDeviceBody): Promise<void> {
    await devicesRepository.updateDeviceSession(id, body);
  },

  async getUserDevices({userId}: RequestDevice): Promise<DeviceViewType[]> {
    const devices = await devicesRepository.getUserDevices(userId);

    return devices.map(({id, ip, device, iat}) => {
      return {
        deviceId: id,
        ip,
        title: device,
        lastActiveDate: iat.toISOString()
      };
    });
  },

  async deleteOtherUserDevices({userId, deviceId}: RequestDevice) {
    await devicesRepository.deleteOtherUserDevices(userId, deviceId);
  },

  async deleteUserDeviceById(deviceId: string, {userId}: RequestDevice): Promise<void> {
    const [targetDevice] = await devicesRepository.searchDeviceSessions({deviceId});

    if (!targetDevice) {
      throw new NotFoundError('deviceId', `Device with id=${deviceId} not found`);
    }

    if (targetDevice.userId !== userId) {
      throw new ForbiddenError('userId', `You can't delete another user's device`);
    }

    return devicesRepository.deleteUserDeviceById(deviceId);
  }
};
