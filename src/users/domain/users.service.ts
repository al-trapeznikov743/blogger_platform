import {bcryptService} from '../../auth/adapters/bcrypt.adapter';
import {BadRequestError, NotFoundError} from '../../core/errors';
import {usersRepository} from '../repositories/users.repository';
import {UserType} from '../types/user';
import {User} from './user.entity';

export const usersService = {
  async getUserById(id: string): Promise<UserType> {
    const user = await usersRepository.findById(id);

    if (!user) {
      throw new NotFoundError('id', `User with ID=${id} not found`);
    }

    return user;
  },

  async create(login: string, email: string, password: string): Promise<UserType> {
    const param = login ? login : email;

    const user = await usersRepository.findByLoginOrEmail(param);

    if (!user) {
      const field = login ? 'login' : 'email';

      throw new BadRequestError(field, `user with this ${field} already exist`);
    }

    const passwordHash = await bcryptService.generateHash(password);

    const newUser = new User(login, email, passwordHash);

    return usersRepository.create(newUser);
  },

  async delete(id: string) {
    const user = await usersRepository.findById(id);

    if (!user) {
      throw new NotFoundError('id', `User with ID=${id} not found`);
    }

    return usersRepository.delete(id);
  }
};
