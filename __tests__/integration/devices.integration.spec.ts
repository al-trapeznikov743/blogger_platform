import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import request from 'supertest';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {db} from '../../src/db/mongo.db';
import {setupApp} from '../../src/setupApp';
import {createUser, getUserDto} from '../utils/users';
import {userLogin, refreshTokenTest, delay} from '../utils/auth';
import {AUTH_PATH, SECURITY_DEVICES_PATH} from '../../src/core/paths/paths';
import {HttpStatus} from '../../src/core/types/httpStatuses';
import {UserInputDto, UserViewType} from '../../src/users/types/user';
import {config} from '../../src/core/settings/config';
import {jwtService} from '../../src/auth/adapters/jwt.adapter';
import {JwtPayload} from 'jsonwebtoken';
import {devicesService} from '../../src/devices/domain/devices.service';
import {RequestDevice} from '../../src/devices/types/devices';

const agents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
  'Mozilla/5.0 (X11; Linux x86_64)',
  'PostmanRuntime/7.32.2'
];

type DeviceData = {
  device: JwtPayload;
  token: string;
};

describe('Devices integration test', () => {
  const app = express();
  setupApp(app);

  let mongoServer: MongoMemoryServer;
  let userData: UserInputDto;
  let user: UserViewType;

  const devices: DeviceData[] = [];

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();

    await db.run(mongoServer.getUri());

    userData = getUserDto();
    user = await createUser(app, userData);

    process.env.RATE_LIMIT = '50';
    process.env.RATE_LIMIT_SEC = '100';
  });

  afterAll(async () => {
    await db.clearCollections();
    await db.stop();
    await mongoServer.stop();
  });

  describe('Actions with user devices', () => {
    it('✅ Should create user devices', async () => {
      for (const agent of agents) {
        const {refreshToken} = await userLogin(
          app,
          {
            loginOrEmail: userData.email,
            password: userData.password
          },
          {userAgent: agent}
        );

        const payload = await jwtService.verifyToken(refreshToken, config.RT_SECRET);

        devices.push({
          device: payload,
          token: refreshToken
        });
      }
    });

    it('✅ Should refresh device_1 token', async () => {
      const {token, device} = devices[0];

      await delay(1100);

      const {refreshToken} = await refreshTokenTest(app, token);

      const userDevices = await devicesService.searchDeviceSessions({
        userId: device.userId
      } as RequestDevice);

      const oldIat = new Date((device.iat as number) * 1000);
      const newIat = new Date(userDevices[0].iat);

      const areDatesEqual = oldIat.getTime() === newIat.getTime();

      expect(devices.length === userDevices.length).toBe(true);
      expect(areDatesEqual).toBe(false);

      const payload = await jwtService.verifyToken(refreshToken, config.RT_SECRET);

      devices[0] = {
        device: payload,
        token: refreshToken
      };
    });

    it('✅ Should delete device_2', async () => {
      const {token, device} = devices[0];
      const {deviceId} = devices[1].device;

      await request(app)
        .delete(`${SECURITY_DEVICES_PATH}/${deviceId}`)
        .set('Cookie', [`refreshToken=${token}`])
        .expect(HttpStatus.NO_CONTENT_204);

      const userDevices = await devicesService.searchDeviceSessions({
        userId: device.userId
      } as RequestDevice);

      const deviceExists = userDevices.map(({id}) => id).includes(deviceId);

      expect(deviceExists).toBe(false);
    });

    it('✅ Should logout device_3', async () => {
      const {userId} = devices[0].device;
      const {token, device} = devices[2];

      await request(app)
        .post(`${AUTH_PATH}/logout`)
        .set('Cookie', [`refreshToken=${token}`])
        .expect(HttpStatus.NO_CONTENT_204);

      const userDevices = await devicesService.searchDeviceSessions({
        userId
      } as RequestDevice);

      const deviceExists = userDevices.map(({id}) => id).includes(device.deviceId);

      expect(deviceExists).toBe(false);
    });

    it('✅ Should delete all devices (exclude current)', async () => {
      const {token, device} = devices[0];

      await request(app)
        .delete(`${SECURITY_DEVICES_PATH}`)
        .set('Cookie', [`refreshToken=${token}`])
        .expect(HttpStatus.NO_CONTENT_204);

      const userDevices = await devicesService.searchDeviceSessions({
        userId: device.userId
      } as RequestDevice);

      expect(userDevices?.length).toBe(1);
      expect(userDevices[0]?.id).toBe(device.deviceId);
    });
  });
});
