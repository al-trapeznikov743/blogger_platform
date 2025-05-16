import {NotFoundError, UnauthorizedError} from '../../core/errors';
import {usersRepository} from '../../users/repositories/users.repository';
import {getUserInView} from '../../users/repositories/utils';
import {User} from '../../users/types/user';
import {bcryptService} from '../adapters/bcrypt.adapter';
import {jwtService} from '../adapters/jwt.adapter';

export const authService = {
  async loginUser(loginOrEmail: string, password: string): Promise<string> {
    const user = await this.checkUserCredentials(loginOrEmail, password);

    return jwtService.createToken(user.id);
  },

  async checkUserCredentials(loginOrEmail: string, password: string): Promise<User> {
    const user = await usersRepository.findByLoginOrEmail(loginOrEmail);

    if (!user) {
      throw new NotFoundError('loginOrEmail', `user not found`);
    }

    const isPassCorrect = await bcryptService.checkPassword(password, user.passwordHash);

    if (!isPassCorrect) {
      throw new UnauthorizedError('Incorrect login or password');
    }

    return getUserInView(user)!;
  }
};
