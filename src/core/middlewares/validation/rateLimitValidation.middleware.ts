import {NextFunction, Request, Response} from 'express';
import {logsService} from '../../../logs/domain/logs.service';
import {config} from '../../settings/config';
import {HttpStatus} from '../../types/httpStatuses';

export const rateLimitValidation = async (
  {originalUrl, headers, ip}: Request,
  res: Response,
  next: NextFunction
) => {
  if (!ip) {
    return;
  }

  const rateLimit = config.RATE_LIMIT;
  const limitSecond = config.RATE_LIMIT_SEC;

  try {
    const requestcCount = await logsService.getCountApiLogsBySince(
      ip,
      originalUrl,
      limitSecond
    );

    if (requestcCount > rateLimit) {
      res.status(HttpStatus.TOO_MANY_REQUESTS_429).send({message: 'Too many requests'});

      return;
    }

    const userAgent = headers['user-agent'];

    await logsService.saveApiLog({
      ip,
      url: originalUrl,
      user_agent: userAgent as string,
      date: new Date()
    });

    next();
  } catch (err) {
    next(err);
  }
};
