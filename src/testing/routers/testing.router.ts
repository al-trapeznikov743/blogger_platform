import {Router, Request, Response} from 'express';
import {HttpStatus} from '../../core/types/httpStatuses';
import {db} from '../../db/memory.db';

export const testingRouter = Router();

testingRouter.delete('/all-data', (_: Request, res: Response) => {
  db.blogs = [];
  db.posts = [];

  res.sendStatus(HttpStatus.NO_CONTENT_204);
});
