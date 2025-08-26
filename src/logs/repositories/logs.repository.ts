import {db} from '../../db/mongo.db';
import {BaseLog} from '../types/logs';

export const logsRepository = {
  async saveApiLog(log: BaseLog) {
    await db.logCollection().insertOne(log);
  },

  async getCountApiLogsBySince(
    ip: string,
    url: string,
    seconds: number
  ): Promise<number> {
    const since = new Date(Date.now() - seconds * 1000);

    return db.logCollection().countDocuments({
      ip,
      url,
      date: {$gte: since}
    });
  }
};
