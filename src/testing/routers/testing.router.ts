import {Router, Request, Response} from 'express';
import {HttpStatus} from '../../core/types/httpStatuses';
import {db} from '../../db/mongo.db';

export const testingRouter = Router();

testingRouter.delete('/all-data', async (_: Request, res: Response) => {
  await Promise.all([
    db.userCollection().deleteMany(),
    db.blogCollection().deleteMany(),
    db.postCollection().deleteMany(),
    db.commentCollection().deleteMany()
  ]);

  res.sendStatus(HttpStatus.NO_CONTENT_204);
});
