import {Router} from 'express';
import {loginHandler} from './handlers/login.handler';

export const authRouter = Router();

authRouter.post('/login', loginHandler);
