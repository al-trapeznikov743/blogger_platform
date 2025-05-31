import {bcryptService} from '../../auth/adapters/bcrypt.adapter';
import {BadRequestError, NotFoundError} from '../../core/errors';
import {usersRepository} from '../repositories/users.repository';
import {User, UserInputDto} from '../types/user';

export const usersService = {
  async getUserById(id: string): Promise<User> {
    const user = await usersRepository.findById(id);

    if (!user) {
      throw new NotFoundError('id', `User with ID=${id} not found`);
    }

    return user;
  },

  async create({login, password, email}: UserInputDto): Promise<User> {
    const [userByLogin, userByEmail] = await Promise.all([
      usersRepository.findUserByLogin(login),
      usersRepository.findUserByEmail(email)
    ]);

    if (userByLogin || userByEmail) {
      const field = userByLogin ? 'login' : 'email';

      throw new BadRequestError(field, `user with this ${field} already exist`);
    }

    const passwordHash = await bcryptService.generateHash(password);

    const user = await usersRepository.create({
      login,
      email,
      passwordHash,
      createdAt: new Date().toISOString()
    });

    return user;
  },

  async delete(id: string) {
    const user = await usersRepository.findById(id);

    if (!user) {
      throw new NotFoundError('id', `User with ID=${id} not found`);
    }

    return usersRepository.delete(id);
  }
};
