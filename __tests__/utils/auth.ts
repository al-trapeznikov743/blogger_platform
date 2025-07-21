import request, {Response} from 'supertest';
import {Express} from 'express';
import {HttpStatus} from '../../src/core/types/httpStatuses';
import {AUTH_PATH} from '../../src/core/paths/paths';
import {LoginDto} from '../../src/auth/types/auth';
import {User} from '../../src/users/domain/user.entity';
import {usersRepository} from '../../src/users/repositories/users.repository';
import {BaseUserData} from '../../src/users/types/user';
import {usersService} from '../../src/users/domain/users.service';
import {Tokens} from './../../src/auth/types/auth';

const getRefreshTokenFromResponse = (res: Response): string => {
  expect(res.body).toHaveProperty('accessToken');
  expect(typeof res.body.accessToken).toBe('string');

  const setCookieHeader = res.headers['set-cookie'];
  expect(setCookieHeader).toBeDefined();

  const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];

  const refreshCookie = cookies.find((cookie) => cookie.startsWith('refreshToken='));
  expect(refreshCookie).toBeDefined();

  return refreshCookie.split(';')[0].split('=')[1];
};

export const userLogin = async (app: Express, loginDto: LoginDto): Promise<Tokens> => {
  const {loginOrEmail, password} = loginDto;

  const res = await request(app)
    .post(`${AUTH_PATH}/login`)
    .send({loginOrEmail, password})
    .expect(HttpStatus.OK_200);

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
