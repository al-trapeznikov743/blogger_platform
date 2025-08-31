import 'reflect-metadata';
import {Container} from 'inversify';

import {BLOG_DI_TYPES} from './blogs/types/blog';
import {BlogsRepository} from './blogs/repositories/blogs.repository';
import {BlogsService} from './blogs/domain/blogs.service';
import {BlogsController} from './blogs/routers/blogs.controller';

import {POST_DI_TYPES} from './posts/types/post';
import {PostsRepository} from './posts/repositories/posts.repository';
import {PostsService} from './posts/domain/posts.service';
import {PostsController} from './posts/routers/posts.controller';

import {COMMENTS_DI_TYPES} from './comments/types/comment';
import {CommentsRepository} from './comments/repositories/comments.repository';
import {CommentsService} from './comments/domain/comments.service';
import {CommentsController} from './comments/routers/comments.controller';

import {USERS_DI_TYPES} from './users/types/user';
import {UsersQueryRepository} from './users/repositories/users.query.repository';
import {UsersRepository} from './users/repositories/users.repository';
import {UsersService} from './users/domain/users.service';
import {UsersController} from './users/routers/users.controller';

import {DEVICES_DI_TYPES} from './devices/types/devices';
import {DevicesRepository} from './devices/repositories/devices.repository';
import {DevicesService} from './devices/domain/devices.service';
import {DevicesController} from './devices/routers/devices.controller';

import {AUTH_DI_TYPES} from './auth/types/auth';
import {AuthService} from './auth/domain/auth.service';
import {AuthController} from './auth/routers/auth.controller';

import {ADAPTERS_DI_TYPES} from './auth/types/adapters';
import {JwtService} from './auth/adapters/jwt.adapter';
import {BcryptService} from './auth/adapters/bcrypt.adapter';
import {NodemailerService} from './auth/adapters/nodemailer.adapter';

const container = new Container();

// Auth
container.bind<AuthService>(AUTH_DI_TYPES.AuthService).to(AuthService).inSingletonScope();
container
  .bind<AuthController>(AUTH_DI_TYPES.AuthController)
  .to(AuthController)
  .inSingletonScope();

// Users
container
  .bind<UsersQueryRepository>(USERS_DI_TYPES.UsersQueryRepository)
  .to(UsersQueryRepository)
  .inSingletonScope();
container
  .bind<UsersRepository>(USERS_DI_TYPES.UsersRepository)
  .to(UsersRepository)
  .inSingletonScope();
container
  .bind<UsersService>(USERS_DI_TYPES.UsersService)
  .to(UsersService)
  .inSingletonScope();
container
  .bind<UsersController>(USERS_DI_TYPES.UsersController)
  .to(UsersController)
  .inSingletonScope();

// Devices
container
  .bind<DevicesRepository>(DEVICES_DI_TYPES.DevicesRepository)
  .to(DevicesRepository)
  .inSingletonScope();
container
  .bind<DevicesService>(DEVICES_DI_TYPES.DevicesService)
  .to(DevicesService)
  .inSingletonScope();
container
  .bind<DevicesController>(DEVICES_DI_TYPES.DevicesController)
  .to(DevicesController)
  .inSingletonScope();

// Blogs
container
  .bind<BlogsRepository>(BLOG_DI_TYPES.BlogsRepository)
  .to(BlogsRepository)
  .inSingletonScope();
container
  .bind<BlogsService>(BLOG_DI_TYPES.BlogsService)
  .to(BlogsService)
  .inSingletonScope();
container
  .bind<BlogsController>(BLOG_DI_TYPES.BlogsController)
  .to(BlogsController)
  .inSingletonScope();

// Posts
container
  .bind<PostsRepository>(POST_DI_TYPES.PostsRepository)
  .to(PostsRepository)
  .inSingletonScope();
container
  .bind<PostsService>(POST_DI_TYPES.PostsService)
  .to(PostsService)
  .inSingletonScope();
container
  .bind<PostsController>(POST_DI_TYPES.PostsController)
  .to(PostsController)
  .inSingletonScope();

// Comments
container
  .bind<CommentsRepository>(COMMENTS_DI_TYPES.CommentsRepository)
  .to(CommentsRepository)
  .inSingletonScope();
container
  .bind<CommentsService>(COMMENTS_DI_TYPES.CommentsService)
  .to(CommentsService)
  .inSingletonScope();
container
  .bind<CommentsController>(COMMENTS_DI_TYPES.CommentsController)
  .to(CommentsController)
  .inSingletonScope();

// Adapters
container
  .bind<JwtService>(ADAPTERS_DI_TYPES.JwtService)
  .to(JwtService)
  .inSingletonScope();
container
  .bind<BcryptService>(ADAPTERS_DI_TYPES.BcryptService)
  .to(BcryptService)
  .inSingletonScope();
container
  .bind<NodemailerService>(ADAPTERS_DI_TYPES.NodemailerService)
  .to(NodemailerService)
  .inSingletonScope();

export {container};
