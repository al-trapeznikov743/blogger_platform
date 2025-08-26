import {NextFunction, Request, Response} from 'express';
import {logsService} from '../domain/logs.service';

// на всякий пожарный
/* const getClientIp = (req: Request): string | null => {
  const forwardedFor = req.headers['x-forwarded-for'];

  if (forwardedFor) {
    const ip = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor.split(',')[0];

    return ip.trim();
  }

  if (req.socket?.remoteAddress) {
    return req.socket.remoteAddress.replace(/^::ffff:/, '');
  }

  return null;
}; */

export const apiRequestLogger = async (
  {originalUrl, headers, ip}: Request,
  res: Response,
  next: NextFunction
) => {
  if (!ip) {
    return;
  }

  try {
    const countApiLogs = await logsService.getCountApiLogsBySince(ip, originalUrl, 10);

    console.log('countApiLogs: ', countApiLogs);

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
