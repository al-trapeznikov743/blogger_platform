import {Request, Response} from 'express';
import {inject, injectable} from 'inversify';
import {DEVICES_DI_TYPES, RequestDevice} from '../types/devices';
import {HttpStatus} from '../../core/types/httpStatuses';
import {withErrorHandling} from '../../core/errors/withErrorHandling.decorator';
import {DevicesService} from '../domain/devices.service';

@injectable()
export class DevicesController {
  constructor(
    @inject(DEVICES_DI_TYPES.DevicesService) private devicesService: DevicesService
  ) {}

  @withErrorHandling
  async getUserDevices({device}: Request, res: Response) {
    const devices = await this.devicesService.getUserDevices(device as RequestDevice);

    res.status(HttpStatus.OK_200).send(devices);
  }

  @withErrorHandling
  async deleteUserDeviceById({params, device}: Request, res: Response) {
    await this.devicesService.deleteUserDeviceById(params.id, device as RequestDevice);

    res.sendStatus(HttpStatus.NO_CONTENT_204);
  }

  @withErrorHandling
  async deleteOtherUserDevices({device}: Request, res: Response) {
    await this.devicesService.deleteOtherUserDevices(device as RequestDevice);

    res.sendStatus(HttpStatus.NO_CONTENT_204);
  }
}
