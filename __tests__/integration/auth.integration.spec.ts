import dotenv from 'dotenv';
dotenv.config();

import {MongoMemoryServer} from 'mongodb-memory-server';
import {db} from '../../src/db/mongo.db';
import {nodemailerService} from '../../src/auth/adapters/nodemailer.adapter';
import {authService} from '../../src/auth/domain/auth.service';
import {getUserDto} from '../utils/users';
import {usersService} from '../../src/users/domain/users.service';
import {BadRequestError} from '../../src/core/errors';
import {checkConfirm, insertUserInDb} from '../utils/auth';
import {bcryptService} from '../../src/auth/adapters/bcrypt.adapter';

describe('Auth integration test', () => {
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

  describe('User registration', () => {
    nodemailerService.sendEmail = jest
      .fn()
      .mockImplementation(
        (email: string, code: string, template: (code: string) => string) =>
          Promise.resolve(true)
      );

    const {registerUser} = authService;

    const {login, email, password} = getUserDto();

    it('should register user with correct data', async () => {
      await registerUser(login, password, email);

      const user = await usersService.findUserByEmail(email);

      expect(user.login).toBe(login);
      expect(nodemailerService.sendEmail).toHaveBeenCalled();
      expect(nodemailerService.sendEmail).toHaveBeenCalledTimes(1);
    });

    it('should not register user twice', async () => {
      await expect(registerUser(login, password, email)).rejects.toBeInstanceOf(
        BadRequestError
      );
    });
  });

  describe('Confirm email', () => {
    it('should not confirm email if user does not exist', async () => {
      await expect(authService.confirmEmail('fuifgnddlkgmg')).rejects.toBeInstanceOf(
        BadRequestError
      );
    });

    it('should not confirm email which is confirmed', async () => {
      const {email, login, password} = getUserDto();

      const passwordHash = await bcryptService.generateHash(password);
      const confirmationCode = '55192dab-cd44-48a5-a3c1-702d43d8ceff';

      await insertUserInDb({
        login,
        email,
        passwordHash,
        confirmationCode,
        isConfirmed: true
      });

      await expect(authService.confirmEmail(confirmationCode)).rejects.toBeInstanceOf(
        BadRequestError
      );

      await checkConfirm(email);
    });

    it('should not confirm email with expired code', async () => {
      const {email, login, password} = getUserDto();

      const passwordHash = await bcryptService.generateHash(password);
      const confirmationCode = '55192dab-cd44-48a5-a3c1-702d43d8kopr';

      const now = new Date();
      now.setMinutes(now.getMinutes() - 5);

      await insertUserInDb({
        login,
        email,
        passwordHash,
        expirationDate: now.toISOString(),
        confirmationCode
      });

      const user = await usersService.findUserByEmail(email);
      const expiration = new Date(user.emailConfirmation.expirationDate);

      expect(expiration < new Date()).toBe(true);

      await expect(authService.confirmEmail(confirmationCode)).rejects.toBeInstanceOf(
        BadRequestError
      );
    });

    it('should confirm user', async () => {
      const {email, login, password} = getUserDto();

      const passwordHash = await bcryptService.generateHash(password);
      const confirmationCode = '55192dab-cd44-48a5-a3c1-702d43d8l9u2';

      await insertUserInDb({
        login,
        email,
        passwordHash,
        confirmationCode
      });

      await authService.confirmEmail(confirmationCode);

      await checkConfirm(email);
    });
  });
});
