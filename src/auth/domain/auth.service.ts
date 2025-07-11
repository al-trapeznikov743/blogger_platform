import {randomUUID} from 'crypto';
import {BadRequestError, UnauthorizedError} from '../../core/errors';
import {User} from '../../users/domain/user.entity';
import {usersRepository} from '../../users/repositories/users.repository';
import {UserType, UserViewType} from '../../users/types/user';
import {bcryptService} from '../adapters/bcrypt.adapter';
import {emailTemplates} from '../adapters/emailTemplates';
import {jwtService} from '../adapters/jwt.adapter';
import {nodemailerService} from '../adapters/nodemailer.adapter';

const checkConfirmationEmail = (user: UserViewType, code?: string) => {
  const {
    emailConfirmation: {confirmationCode, expirationDate, isConfirmed}
  } = user;

  if (isConfirmed) {
    const field = code ? 'code' : 'email';

    throw new BadRequestError(field, 'Email already confirmed');
  }

  if (new Date(expirationDate) < new Date()) {
    throw new BadRequestError('confirmCode', 'Code is expired');
  }

  if (code && confirmationCode !== code) {
    throw new BadRequestError('confirmCode', 'Confirm code does not match');
  }
};

export const authService = {
  async loginUser(loginOrEmail: string, password: string): Promise<string> {
    const user = await this.checkUserCredentials(loginOrEmail, password);

    return jwtService.createToken(user.id);
  },

  async checkUserCredentials(loginOrEmail: string, password: string): Promise<UserType> {
    const user = await usersRepository.findByLoginOrEmail(loginOrEmail);

    if (!user) {
      throw new UnauthorizedError('Incorrect login or password');
    }

    const isPassCorrect = await bcryptService.checkPassword(password, user.passwordHash);

    if (!isPassCorrect) {
      throw new UnauthorizedError('Incorrect login or password');
    }

    return user;
  },

  async registerUser(login: string, password: string, email: string) {
    const user = await usersRepository.findUserByLoginOrEmail(login, email);

    if (user) {
      let field = 'email';

      if (login === user?.login && email !== user?.email) {
        field = 'login';
      }

      throw new BadRequestError(field, 'A user with this login or email already exists');
    }

    const passwordHash = await bcryptService.generateHash(password);

    const newUser = new User({login, email, passwordHash});

    await usersRepository.create(newUser);

    await nodemailerService.sendEmail(
      newUser.email,
      newUser.emailConfirmation.confirmationCode,
      emailTemplates.registration
    );
  },

  async confirmEmail(code: string): Promise<void> {
    const user = await usersRepository.findUserByConfirmCode(code);

    if (!user) {
      throw new BadRequestError('email', 'Confirmation code is incorrect');
    }

    checkConfirmationEmail(user, code);

    await usersRepository.updateUser(user.id, {
      'emailConfirmation.isConfirmed': true
    });
  },

  async emailResending(email: string): Promise<void> {
    const user = await usersRepository.findUserByEmail(email);

    if (!user) {
      throw new BadRequestError('email', 'User is not exist');
    }

    checkConfirmationEmail(user);

    const updateFields = {
      'emailConfirmation.confirmationCode': randomUUID(),
      'emailConfirmation.expirationDate': User.getExpDate()
    };

    await usersRepository.updateUser(user.id, updateFields);

    await nodemailerService.sendEmail(
      email,
      updateFields['emailConfirmation.confirmationCode'],
      emailTemplates.registration
    );
  }
};
