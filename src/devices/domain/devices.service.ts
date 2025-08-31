import {inject, injectable} from 'inversify';
import {DevicesRepository} from '../repositories/devices.repository';
import {
  BaseDeviceSession,
  DEVICES_DI_TYPES,
  DeviceSession,
  DeviceViewType,
  RequestDevice,
  SearchDeviceBody,
  UpdateDeviceBody
} from '../types/devices';
import {ForbiddenError, NotFoundError} from '../../core/errors';

@injectable()
export class DevicesService {
  constructor(
    @inject(DEVICES_DI_TYPES.DevicesRepository)
    private devicesRepository: DevicesRepository
  ) {}

  async createDeviceSession(device: BaseDeviceSession): Promise<string> {
    return this.devicesRepository.createDeviceSession(device);
  }

  async searchDeviceSessions(body: SearchDeviceBody): Promise<DeviceSession[]> {
    return this.devicesRepository.searchDeviceSessions(body);
  }

  async updateDeviceSession(id: string, body: UpdateDeviceBody): Promise<void> {
    await this.devicesRepository.updateDeviceSession(id, body);
  }

  async getUserDevices({userId}: RequestDevice): Promise<DeviceViewType[]> {
    const devices = await this.devicesRepository.getUserDevices(userId);

    return devices.map(({id, ip, device, iat}) => {
      return {
        deviceId: id,
        ip,
        title: device,
        lastActiveDate: iat.toISOString()
      };
    });
  }

  async deleteOtherUserDevices({userId, deviceId}: RequestDevice) {
    await this.devicesRepository.deleteOtherUserDevices(userId, deviceId);
  }

  async deleteUserDeviceById(deviceId: string, {userId}: RequestDevice): Promise<void> {
    const [targetDevice] = await this.devicesRepository.searchDeviceSessions({deviceId});

    if (!targetDevice) {
      throw new NotFoundError('deviceId', `Device with id=${deviceId} not found`);
    }

    if (targetDevice.userId !== userId) {
      throw new ForbiddenError('userId', `You can't delete another user's device`);
    }

    return this.devicesRepository.deleteUserDeviceById(deviceId);
  }
}
