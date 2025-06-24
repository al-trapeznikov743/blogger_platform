import {BadRequestError, UnauthorizedError} from '../../core/errors';
import {User} from '../../users/domain/user.entity';
import {usersRepository} from '../../users/repositories/users.repository';
import {getUserInView} from '../../users/repositories/utils';
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
    throw new BadRequestError('confirmCode', 'Email already confirmed');
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
    const isUserExist = await usersRepository.doesExistByLoginOrEmail(login, email);

    if (isUserExist) {
      throw new BadRequestError(
        'loginOrEmail',
        `A user with this login or email already exists`
      );
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
      throw new BadRequestError('confirmCode', 'Confirmation code is incorrect');
    }

    checkConfirmationEmail(user, code);

    await usersRepository.updateUser(user.id, {
      'emailConfirmation.isConfirmed': true
    });
  },

  async emailResending(email: string): Promise<void> {
    const user = await usersRepository.findUserByEmail(email);

    if (!user) {
      throw new BadRequestError('confirmResend', 'User is not exist');
    }

    checkConfirmationEmail(user);

    await nodemailerService.sendEmail(
      email,
      user.emailConfirmation.confirmationCode,
      emailTemplates.registration
    );
  }
};
