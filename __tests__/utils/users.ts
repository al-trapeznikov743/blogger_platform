import request from 'supertest';
import {Express} from 'express';
import {UserDtoForTest, UserInputDto} from '../../src/users/types/user';
import {USERS_PATH} from '../../src/core/paths/paths';
import {generateBasicAuthToken} from '.';
import {HttpStatus} from '../../src/core/types/httpStatuses';

export const generateUniqueString = (length: number) => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-';

  return [...Array(length)]
    .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
    .join('');
};

export const getUserDto = (): UserInputDto => {
  return {
    email: `${generateUniqueString(7)}@example.com`,
    login: generateUniqueString(10),
    password: 'password'
  };
};

export const createUser = async (app: Express, userDto?: UserDtoForTest) => {
  const testUserData = {...getUserDto(), ...userDto};

  const createdUserResponse = await request(app)
    .post(USERS_PATH)
    .set('Authorization', generateBasicAuthToken())
    .send(testUserData)
    .expect(HttpStatus.CREATED_201);

  return createdUserResponse.body;
};
