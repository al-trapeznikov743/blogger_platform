import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import request from 'supertest';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {AUTH_PATH} from '../../../src/core/paths/paths';
import {HttpStatus} from '../../../src/core/types/httpStatuses';
import {db} from '../../../src/db/mongo.db';
import {setupApp} from '../../../src/setupApp';
import {createUser, getUserDto} from '../../utils/users';
import {userLogin} from '../../utils/auth';

describe('Auth API', () => {
  const app = express();
  setupApp(app);

  const userData = getUserDto();

  let accessToken: string = '';
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();

    await db.run(mongoServer.getUri());
    await createUser(app, userData);

    const loginData = await userLogin(app, {
      loginOrEmail: userData.login,
      password: userData.password
    });

    accessToken = loginData.accessToken;
  });

  afterAll(async () => {
    await db.clearCollections();
    await db.stop();
    await mongoServer.stop();
  });

  it('✅ should user login and return access token; GET /auth/me', async () => {
    const authMeResult = await request(app)
      .get(`${AUTH_PATH}/me`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(HttpStatus.OK_200);

    expect(authMeResult.body).toEqual({
      userId: expect.any(String),
      login: expect.any(String),
      email: expect.any(String)
    });
  });

  it('❌ should not user login when incorrect param; GET /auth/me', async () => {
    await request(app)
      .get(`${AUTH_PATH}/me`)
      .set('Authorization', `Bearer invalid.string`)
      .expect(HttpStatus.UNAUTHORIZED_401);
  });

  it('❌ should not user login without authorization header; GET /auth/me', async () => {
    await request(app).get(`${AUTH_PATH}/me`).expect(HttpStatus.UNAUTHORIZED_401);
  });
});
