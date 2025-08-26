import {ObjectId} from 'mongodb';

export type BaseDeviceSession = {
  userId: string;
  device: string;
  ip: string;
  iat: Date;
  exp: Date;
};

export type DeviceSession = BaseDeviceSession & {
  id: string;
};

export type DeviceSessionDbType = BaseDeviceSession & {
  _id?: ObjectId;
};

export type DeviceViewType = {
  deviceId: string;
  ip: string;
  title: string;
  lastActiveDate: string;
};

export type RequestUserData = {
  ip: string;
  device: string;
};

export type UpdateDeviceBody = {
  ip: string;
  iat: Date;
  exp: Date;
};

export type SearchDeviceBody = {
  userId?: string;
  deviceId?: string;
  device?: string;
  iat?: number;
};

export type RequestDevice = {
  userId: string;
  deviceId: string;
  iat: number | undefined;
};
