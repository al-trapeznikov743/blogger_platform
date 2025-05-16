import {Request} from 'express';

export type RequestWithBody<B> = Request<{}, {}, B>;
