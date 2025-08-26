import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import request from 'supertest';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {db} from '../../src/db/mongo.db';
import {setupApp} from '../../src/setupApp';
import {createUser, getUserDto} from '../utils/users';
import {userLogin, userLogout, refreshTokenTest, checkDevice, delay} from '../utils/auth';
import {AUTH_PATH} from '../../src/core/paths/paths';
import {HttpStatus} from '../../src/core/types/httpStatuses';
import {UserInputDto, UserViewType} from '../../src/users/types/user';

describe('Auth login-logout integration test', () => {
  const app = express();
  setupApp(app);

  let mongoServer: MongoMemoryServer;
  let userData: UserInputDto;
  let user: UserViewType;

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

  describe('Authorization and issuance of tokens', () => {
    it('✅ should login: return accessToken and refreshToken in cookie; POST /auth/login', async () => {
      const {refreshToken} = await userLogin(app, {
        loginOrEmail: userData.email,
        password: userData.password
      });

      await checkDevice(refreshToken, true);
    });

    it('❌ should not login; POST /auth/login', async () => {
      await request(app)
        .post(`${AUTH_PATH}/login`)
        .send({
          loginOrEmail: userData.email,
          password: 'randomPass'
        })
        .expect(HttpStatus.UNAUTHORIZED_401);
    });
  });

  describe('Logout: delete token in db', () => {
    it('✅ should logout: delete token in db; POST /auth/logout', async () => {
      const {refreshToken} = await userLogin(app, {
        loginOrEmail: userData.email,
        password: userData.password
      });

      await userLogout(app, refreshToken);

      await checkDevice(refreshToken, false);
    });

    it('❌ should not logout, unauthirized; POST /auth/logout', async () => {
      const {refreshToken} = await userLogin(app, {
        loginOrEmail: userData.email,
        password: userData.password
      });

      await request(app)
        .post(`${AUTH_PATH}/logout`)
        .set('Cookie', ['refreshToken=randomToken'])
        .expect(HttpStatus.UNAUTHORIZED_401);

      await checkDevice(refreshToken, true);
    });
  });

  describe('Refresh token', () => {
    it('✅ should refresh token; POST /auth/refresh-token', async () => {
      const {refreshToken} = await userLogin(app, {
        loginOrEmail: userData.email,
        password: userData.password
      });

      await delay(1100);

      await checkDevice(refreshToken, true);

      await refreshTokenTest(app, refreshToken);

      await checkDevice(refreshToken, false);
    });

    it('❌ should not refresh token; POST /auth/refresh-token', async () => {
      const {refreshToken} = await userLogin(app, {
        loginOrEmail: userData.email,
        password: userData.password
      });

      await delay(1100);

      await checkDevice(refreshToken, true);

      await request(app)
        .post(`${AUTH_PATH}/refresh-token`)
        .set('Cookie', ['refreshToken=rundomToken'])
        .expect(HttpStatus.UNAUTHORIZED_401);

      await checkDevice(refreshToken, true);
    });

    it('❌ should not refresh token (no cookies); POST /auth/refresh-token', async () => {
      const {refreshToken} = await userLogin(app, {
        loginOrEmail: userData.email,
        password: userData.password
      });

      await delay(1100);

      await checkDevice(refreshToken, true);

      await request(app)
        .post(`${AUTH_PATH}/refresh-token`)
        .expect(HttpStatus.UNAUTHORIZED_401);

      await checkDevice(refreshToken, true);
    });
  });

  describe('Life cycle refreshToken', () => {
    beforeAll(() => {
      process.env.AC_TIME = '1s';
      process.env.RT_TIME = '1s';
    });

    it('❌ should not refresh token: token time expired; POST /auth/refresh-token', async () => {
      const {refreshToken} = await userLogin(app, {
        loginOrEmail: userData.email,
        password: userData.password
      });

      await delay(1100);

      await checkDevice(refreshToken, true);

      await request(app)
        .post(`${AUTH_PATH}/refresh-token`)
        .expect(HttpStatus.UNAUTHORIZED_401);

      await checkDevice(refreshToken, true);
    });
  });
});
