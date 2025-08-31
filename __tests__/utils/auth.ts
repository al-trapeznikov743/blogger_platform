import request, {Response} from 'supertest';
import {Express} from 'express';
import {container} from '../../src/compositionRoot';
import {HttpStatus} from '../../src/core/types/httpStatuses';
import {AUTH_PATH} from '../../src/core/paths/paths';
import {LoginDto} from '../../src/auth/types/auth';
import {User} from '../../src/users/domain/user.entity';
import {UsersRepository} from '../../src/users/repositories/users.repository';
import {BaseUserData, USERS_DI_TYPES} from '../../src/users/types/user';
import {UsersService} from '../../src/users/domain/users.service';
import {Tokens} from './../../src/auth/types/auth';
import {JwtService} from '../../src/auth/adapters/jwt.adapter';
import {config} from '../../src/core/settings/config';
import {DevicesService} from '../../src/devices/domain/devices.service';
import {DEVICES_DI_TYPES} from '../../src/devices/types/devices';
import {ADAPTERS_DI_TYPES} from '../../src/auth/types/adapters';

const usersRepository = container.get<UsersRepository>(USERS_DI_TYPES.UsersRepository);
const usersService = container.get<UsersService>(USERS_DI_TYPES.UsersService);
const devicesService = container.get<DevicesService>(DEVICES_DI_TYPES.DevicesService);
const jwtService = container.get<JwtService>(ADAPTERS_DI_TYPES.JwtService);

export const getRefreshTokenFromResponse = (res: Response): string => {
  expect(res.body).toHaveProperty('accessToken');
  expect(typeof res.body.accessToken).toBe('string');

  const setCookieHeader = res.headers['set-cookie'];
  expect(setCookieHeader).toBeDefined();

  const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];

  const refreshCookie = cookies.find((cookie) => cookie.startsWith('refreshToken='));
  expect(refreshCookie).toBeDefined();

  return refreshCookie.split(';')[0].split('=')[1];
};

type LoginOptions = {userAgent?: string};

export const userLogin = async (
  app: Express,
  loginDto: LoginDto,
  options?: LoginOptions
): Promise<Tokens> => {
  const {loginOrEmail, password} = loginDto;

  const req = request(app).post(`${AUTH_PATH}/login`).send({loginOrEmail, password});

  if (options?.userAgent) {
    req.set('User-Agent', options.userAgent);
  }

  const res = await req.expect(HttpStatus.OK_200);

  const refreshToken = getRefreshTokenFromResponse(res);

  return {accessToken: res.body.accessToken, refreshToken};
};

export const userLogout = (app: Express, refreshToken: string) =>
  request(app)
    .post(`${AUTH_PATH}/logout`)
    .set('Cookie', [`refreshToken=${refreshToken}`])
    .expect(HttpStatus.NO_CONTENT_204);

export const insertUserInDb = async (userData: BaseUserData) => {
  const user = new User(userData);

  await usersRepository.create(user);
};

export const refreshTokenTest = async (
  app: Express,
  oldRefreshToken: string
): Promise<Tokens> => {
  const res = await request(app)
    .post(`${AUTH_PATH}/refresh-token`)
    .set('Cookie', [`refreshToken=${oldRefreshToken}`])
    .expect(HttpStatus.OK_200);

  const refreshToken = getRefreshTokenFromResponse(res);

  return {accessToken: res.body.accessToken, refreshToken};
};

export const checkConfirm = async (email: string) => {
  const user = await usersService.findUserByEmail(email);

  expect(user.emailConfirmation.isConfirmed).toBe(true);
};

export const checkDevice = async (
  refreshToken: string,
  isDefined: boolean
): Promise<void> => {
  const {deviceId, iat} = await jwtService.verifyToken(refreshToken, config.RT_SECRET);

  const [device] = await devicesService.searchDeviceSessions({
    deviceId,
    iat
  });

  if (isDefined) {
    expect(device?.id).toBeDefined();
  } else {
    expect(device?.id).toBeUndefined();
  }
};

/* export const passwordRecovery = async (app: Express, email: string) => {
  const res = await request(app)
    .post(`${AUTH_PATH}/password-recovery`)
    .send({email})
    .expect(HttpStatus.OK_200);
}; */

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
