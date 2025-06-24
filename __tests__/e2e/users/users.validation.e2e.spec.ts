import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import request from 'supertest';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {db} from '../../../src/db/mongo.db';
import {setupApp} from '../../../src/setupApp';
import {
  checkFieldsWithErrors,
  generateBasicAuthToken,
  getInvalidQueryParams,
  makeLongString
} from '../../utils';
import {createUser, generateUniqueString, getUserDto} from '../../utils/users';
import {USERS_PATH} from '../../../src/core/paths/paths';
import {HttpStatus} from '../../../src/core/types/httpStatuses';
import {UserInputDto} from '../../../src/users/types/user';

describe('Users API', () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();
  const correctTestUserData: UserInputDto = getUserDto();

  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();

    await db.run(mongoServer.getUri());
  });

  afterAll(async () => {
    await db.clearCollections();
    await db.stop();
    await mongoServer.stop();
  });

  it('❌ should not get users when incorrect query param; GET /users', async () => {
    await createUser(app);

    const emptyBodyDataSet = await request(app)
      .get(USERS_PATH)
      .set('Authorization', adminToken)
      .query(getInvalidQueryParams())
      .expect(HttpStatus.BAD_REQUEST_400);

    expect(emptyBodyDataSet.body.errorsMessages).toHaveLength(4);
  });

  it('❌ should not create user when incorrect body passed; POST /users', async () => {
    await request(app)
      .post(USERS_PATH)
      .send(correctTestUserData)
      .expect(HttpStatus.UNAUTHORIZED_401);

    const emptyBodyDataSet = await request(app)
      .post(USERS_PATH)
      .set('Authorization', adminToken)
      .send({})
      .expect(HttpStatus.BAD_REQUEST_400);

    expect(emptyBodyDataSet.body.errorsMessages).toHaveLength(3);

    const emptyStringDataSet = await request(app)
      .post(USERS_PATH)
      .set('Authorization', adminToken)
      .send({
        email: '',
        login: ' ',
        password: '     '
      })
      .expect(HttpStatus.BAD_REQUEST_400);

    expect(emptyStringDataSet.body.errorsMessages).toHaveLength(3);

    const invalidLengthDataSet = await request(app)
      .post(USERS_PATH)
      .set('Authorization', adminToken)
      .send({
        ...correctTestUserData,
        login: correctTestUserData.login + 'someString',
        password: correctTestUserData.password + makeLongString(20)
      })
      .expect(HttpStatus.BAD_REQUEST_400);

    expect(invalidLengthDataSet.body.errorsMessages).toHaveLength(2);
  });

  it('❌ should not create user when incorrect body.login and body.email; POST /users', async () => {
    const invalidLoginAndEmailResult = await request(app)
      .post(USERS_PATH)
      .set('Authorization', adminToken)
      .send({
        ...correctTestUserData,
        login: generateUniqueString(6) + '@',
        email: '!' + correctTestUserData.email
      })
      .expect(HttpStatus.BAD_REQUEST_400);

    expect(invalidLoginAndEmailResult.body.errorsMessages).toHaveLength(2);

    checkFieldsWithErrors(invalidLoginAndEmailResult, ['login', 'email']);
  });
});
