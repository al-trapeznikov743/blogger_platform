import {ObjectId} from 'mongodb';

export type BaseLog = {
  ip: string;
  url: string;
  user_agent: string;
  date: Date;
};

export type Log = BaseLog & {
  id: string;
};

export type LogDbType = BaseLog & {
  _id?: ObjectId;
};
