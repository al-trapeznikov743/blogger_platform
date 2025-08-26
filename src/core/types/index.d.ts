import {RequestDevice} from '../../devices/types/devices';
import {IdType} from './shared';

declare global {
  declare namespace Express {
    export interface Request {
      user: IdType | undefined;
      device: RequestDevice | undefined;
    }
  }
}
