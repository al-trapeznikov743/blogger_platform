import {ObjectId} from 'mongodb';
import {db} from '../../db/mongo.db';
import {mapMongoId} from '../../db/utils';
import {
  BaseDeviceSession,
  DeviceSession,
  SearchDeviceBody,
  UpdateDeviceBody
} from '../types/devices';

export const devicesRepository = {
  async createDeviceSession(device: BaseDeviceSession): Promise<string> {
    const {insertedId} = await db.deviceCollection().insertOne(device);

    return insertedId.toString();
  },

  async searchDeviceSessions({
    userId,
    deviceId,
    device,
    iat
  }: SearchDeviceBody): Promise<DeviceSession[]> {
    const filter = {
      ...(deviceId && {_id: new ObjectId(deviceId)}),
      ...(userId && {userId}),
      ...(device && {device}),
      ...(iat && {iat: new Date((iat as number) * 1000)})
    };

    const deviceSessions = await db.deviceCollection().find(filter).toArray();

    return deviceSessions.map((ds) => mapMongoId(ds) as DeviceSession);
  },

  async updateDeviceSession(id: string, body: UpdateDeviceBody): Promise<void> {
    const updateResult = await db
      .deviceCollection()
      .updateOne({_id: new ObjectId(id)}, {$set: {...body}});

    if (updateResult.matchedCount < 1) {
      throw new Error('Device not exist');
    }
  },

  async getUserDevices(userId: string): Promise<DeviceSession[]> {
    const devices = await db.deviceCollection().find({userId}).toArray();

    return devices.length ? (devices.map(mapMongoId) as DeviceSession[]) : [];
  },

  async deleteOtherUserDevices(userId: string, deviceId: string): Promise<void> {
    await db.deviceCollection().deleteMany({
      userId,
      _id: {$ne: new ObjectId(deviceId)}
    });
  },

  async deleteUserDeviceById(deviceId: string): Promise<void> {
    const deleteResult = await db.deviceCollection().deleteOne({
      _id: new ObjectId(deviceId)
    });

    if (deleteResult.deletedCount < 1) {
      throw new Error('Device not exist');
    }
  }
};
