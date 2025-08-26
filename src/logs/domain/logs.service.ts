import {logsRepository} from '../repositories/logs.repository';
import {BaseLog} from '../types/logs';

export const logsService = {
  async saveApiLog(log: BaseLog) {
    await logsRepository.saveApiLog(log);
  },

  async getCountApiLogsBySince(
    ip: string,
    url: string,
    seconds: number
  ): Promise<number> {
    return logsRepository.getCountApiLogsBySince(ip, url, seconds);
  }
};
