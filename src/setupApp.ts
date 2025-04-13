import express, {Express} from 'express';
import {HttpStatus} from './core/types/httpStatuses';
import {blogsRouter} from './blogs/routers/blogs.router';
import {postsRouter} from './posts/routers/posts.router';
import {testingRouter} from './testing/routers/testing.router';
import {setupSwagger} from './core/swagger/setupSwagger';
import {BLOGS_PATH, POSTS_PATH, TESTING_PATH} from './core/paths/paths';

export const setupApp = (app: Express) => {
  app.use(express.json());

  app.get('/', (_, res) => {
    res.status(HttpStatus.OK_200).send('Hello world!');
  });

  app.use(TESTING_PATH, testingRouter);
  app.use(BLOGS_PATH, blogsRouter);
  app.use(POSTS_PATH, postsRouter);

  setupSwagger(app);

  return app;
};
