import {inject, injectable} from 'inversify';
import {USERS_DI_TYPES, UserType, UserViewType} from '../types/user';
import {ADAPTERS_DI_TYPES} from '../../auth/types/adapters';
import {BcryptService} from '../../auth/adapters/bcrypt.adapter';
import {BadRequestError, NotFoundError} from '../../core/errors';
import {UsersRepository} from '../repositories/users.repository';
import {User} from './user.entity';

@injectable()
export class UsersService {
  constructor(
    @inject(USERS_DI_TYPES.UsersRepository) private usersRepository: UsersRepository,
    @inject(ADAPTERS_DI_TYPES.BcryptService) private bcryptService: BcryptService
  ) {}

  async getUserById(id: string): Promise<UserType> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundError('id', `User with ID=${id} not found`);
    }

    return user;
  }

  async findUserByEmail(email: string): Promise<UserViewType> {
    const user = await this.usersRepository.findUserByEmail(email);

    return user as UserViewType;
  }

  async create(login: string, email: string, password: string): Promise<UserType> {
    const param = login ? login : email;

    const user = await this.usersRepository.findByLoginOrEmail(param);

    if (user) {
      const field = login ? 'login' : 'email';

      throw new BadRequestError(field, `user with this ${field} already exist`);
    }

    const passwordHash = await this.bcryptService.generateHash(password);
    const newUser = new User({login, email, passwordHash, isConfirmed: true});

    return this.usersRepository.create(newUser);
  }

  async delete(id: string) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundError('id', `User with ID=${id} not found`);
    }

    return this.usersRepository.delete(id);
  }
}
