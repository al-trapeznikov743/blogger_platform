import {Request, Response} from 'express';
import {inject, injectable} from 'inversify';
import {UserInputDto, USERS_DI_TYPES} from '../types/user';
import {HttpStatus} from '../../core/types/httpStatuses';
import {withErrorHandling} from '../../core/errors/withErrorHandling.decorator';
import {getQueryOptions} from '../../shared/utils';
import {UsersQueryRepository} from '../repositories/users.query.repository';
import {UsersService} from '../domain/users.service';
import {RequestWithBody} from '../../core/types/requests';

@injectable()
export class UsersController {
  constructor(
    @inject(USERS_DI_TYPES.UsersService) private usersService: UsersService,
    @inject(USERS_DI_TYPES.UsersQueryRepository)
    private usersQueryRepository: UsersQueryRepository
  ) {}

  @withErrorHandling
  async getUsers(req: Request, res: Response) {
    const options = getQueryOptions(req.query);
    const users = await this.usersQueryRepository.findUsers(options);

    res.status(HttpStatus.OK_200).send(users);
  }

  @withErrorHandling
  async createUser(
    {body: {login, email, password}}: RequestWithBody<UserInputDto>,
    res: Response
  ) {
    const createdUser = await this.usersService.create(login, email, password);

    res.status(HttpStatus.CREATED_201).send(createdUser);
  }

  @withErrorHandling
  async deleteUser({params}: Request, res: Response) {
    await this.usersService.delete(params.id);

    res.sendStatus(HttpStatus.NO_CONTENT_204);
  }
}
