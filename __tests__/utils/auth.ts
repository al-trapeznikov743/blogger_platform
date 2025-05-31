import request from 'supertest';
import {Express} from 'express';
import {HttpStatus} from '../../src/core/types/httpStatuses';
import {AUTH_PATH} from '../../src/core/paths/paths';
import {LoginDto} from '../../src/auth/types/auth';

export const userLogin = async (app: Express, loginDto: LoginDto) => {
  const {loginOrEmail, password} = loginDto;

  const authResult = await request(app)
    .post(`${AUTH_PATH}/login`)
    .send({loginOrEmail, password})
    .expect(HttpStatus.OK_200);

  expect(authResult.body).toEqual({
    accessToken: expect.any(String)
  });

  return authResult.body.accessToken;
};
