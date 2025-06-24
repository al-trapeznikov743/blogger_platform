import request from 'supertest';
import {Express} from 'express';
import {HttpStatus} from '../../src/core/types/httpStatuses';
import {AUTH_PATH} from '../../src/core/paths/paths';
import {LoginDto} from '../../src/auth/types/auth';
import {bcryptService} from '../../src/auth/adapters/bcrypt.adapter';
import {User} from '../../src/users/domain/user.entity';
import {usersRepository} from '../../src/users/repositories/users.repository';
import {authService} from '../../src/auth/domain/auth.service';
import {BaseUserData, UserInputDto} from '../../src/users/types/user';
import {usersService} from '../../src/users/domain/users.service';

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

export const insertUserInDb = async (userData: BaseUserData) => {
  const user = new User(userData);

  await usersRepository.create(user);
};

export const checkConfirm = async (email: string) => {
  const user = await usersService.findUserByEmail(email);

  expect(user.emailConfirmation.isConfirmed).toBe(true);
};
