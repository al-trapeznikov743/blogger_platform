import {Router, Request, Response} from 'express';
import {HttpStatus} from '../../core/types/httpStatuses';
import {
  blogCollection,
  commentCollection,
  postCollection,
  userCollection
} from '../../db/mongo.db';

export const testingRouter = Router();

testingRouter.delete('/all-data', async (_: Request, res: Response) => {
  await Promise.all([
    userCollection.deleteMany(),
    blogCollection.deleteMany(),
    postCollection.deleteMany(),
    commentCollection.deleteMany()
  ]);

  res.sendStatus(HttpStatus.NO_CONTENT_204);
});
