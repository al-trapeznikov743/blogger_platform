import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import request from 'supertest';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {db} from '../../../src/db/mongo.db';
import {setupApp} from '../../../src/setupApp';
import {generateBasicAuthToken} from '../../utils';
import {createUser} from '../../utils/users';
import {USERS_PATH} from '../../../src/core/paths/paths';
import {HttpStatus} from '../../../src/core/types/httpStatuses';

describe('Users API', () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();
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

  it('✅ should return users; GET /users', async () => {
    await createUser(app);
    await createUser(app);

    const response = await request(app)
      .get(USERS_PATH)
      .set('Authorization', adminToken)
      .expect(HttpStatus.OK_200);

    const {pagesCount, page, pageSize, totalCount, items} = response.body;

    expect(typeof pagesCount).toBe('number');
    expect(typeof page).toBe('number');
    expect(typeof pageSize).toBe('number');
    expect(typeof totalCount).toBe('number');
    expect(Array.isArray(items)).toBe(true);

    expect(totalCount).toBeGreaterThanOrEqual(2);
    expect(items.length).toBeGreaterThanOrEqual(2);

    expect(items[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        login: expect.any(String),
        email: expect.any(String),
        createdAt: expect.any(String)
      })
    );
  });

  it('✅ should delete user; DELETE /users/:id', async () => {
    const createdUser = await createUser(app);

    await request(app)
      .delete(`${USERS_PATH}/${createdUser.id}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NO_CONTENT_204);
  });
});
