import express, {Express} from 'express';
import cookieParser from 'cookie-parser';
import {HttpStatus} from './core/types/httpStatuses';
import {blogsRouter} from './blogs/routers/blogs.router';
import {postsRouter} from './posts/routers/posts.router';
import {testingRouter} from './testing/routers/testing.router';
import {setupSwagger} from './core/swagger/setupSwagger';
import {
  AUTH_PATH,
  BLOGS_PATH,
  COMMENTS_PATH,
  POSTS_PATH,
  TESTING_PATH,
  USERS_PATH
} from './core/paths/paths';
import {globalErrorsHandler} from './core/errors/globalErrorsHandler.middleware';
import {usersRouter} from './users/routers/users.router';
import {authRouter} from './auth/routers/auth.router';
import {commentsRouter} from './comments/routers/comments.router';

export const setupApp = (app: Express) => {
  app.use(express.json());
  app.use(cookieParser());

  app.get('/', (_, res) => {
    res.status(HttpStatus.OK_200).send('Hello world!');
  });

  app.use(AUTH_PATH, authRouter);
  app.use(USERS_PATH, usersRouter);
  app.use(BLOGS_PATH, blogsRouter);
  app.use(POSTS_PATH, postsRouter);
  app.use(COMMENTS_PATH, commentsRouter);
  app.use(TESTING_PATH, testingRouter);

  app.use(globalErrorsHandler);

  setupSwagger(app);

  return app;
};
