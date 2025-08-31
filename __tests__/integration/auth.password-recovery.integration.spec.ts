import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {db} from '../../src/db/mongo.db';
import {setupApp} from '../../src/setupApp';
import {createUser, getUserDto} from '../utils/users';
import {UserInputDto, USERS_DI_TYPES, UserViewType} from '../../src/users/types/user';
import {NodemailerService} from '../../src/auth/adapters/nodemailer.adapter';
import {container} from '../../src/compositionRoot';
import {ADAPTERS_DI_TYPES} from '../../src/auth/types/adapters';
import {AuthService} from '../../src/auth/domain/auth.service';
import {AUTH_DI_TYPES} from '../../src/auth/types/auth';
import {UsersService} from '../../src/users/domain/users.service';
import {BadRequestError} from '../../src/core/errors';

describe('Auth: Password recovery integration test', () => {
  const app = express();
  setupApp(app);

  let mongoServer: MongoMemoryServer;
  let authService: AuthService;
  let usersService: UsersService;
  let nodemailerService: NodemailerService;

  let userData: UserInputDto;
  let user: UserViewType;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    authService = container.get<AuthService>(AUTH_DI_TYPES.AuthService);
    usersService = container.get<UsersService>(USERS_DI_TYPES.UsersService);
    nodemailerService = container.get<NodemailerService>(
      ADAPTERS_DI_TYPES.NodemailerService
    );

    jest.spyOn(nodemailerService, 'sendEmail').mockResolvedValue(undefined);

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

  describe('Password recovery success', () => {
    it('✅ Should recovery code to email', async () => {
      await authService.passwordRecovery(user.email);

      expect(nodemailerService.sendEmail).toHaveBeenCalled();
      expect(nodemailerService.sendEmail).toHaveBeenCalledTimes(1);
    });

    it('✅ Should password changed', async () => {
      const oldUserData = await usersService.findUserByEmail(user.email);
      const {passwordHash: oldPasswordHash, recoveryPassword} = oldUserData;

      expect(recoveryPassword).toBeDefined();

      await authService.newPassword('newPassword', recoveryPassword!.recoveryCode);

      const newUserData = await usersService.findUserByEmail(user.email);
      const {passwordHash: newPasswordHash, recoveryPassword: newRecoveryPassword} =
        newUserData;

      expect(newRecoveryPassword).toBeNull();
      expect(oldPasswordHash).not.toBe(newPasswordHash);
    });

    it('✅ Should not throw error when email does not exist', async () => {
      await expect(
        authService.passwordRecovery('alliluevsome@email.com')
      ).resolves.not.toThrow();
    });
  });

  describe('Password recovery fail', () => {
    it('❌ Should "code is incorect" error in newPassword', async () => {
      await expect(
        authService.newPassword('newPassword', 'someCode')
      ).rejects.toBeInstanceOf(BadRequestError);
    });
  });
});
