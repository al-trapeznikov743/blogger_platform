import {ObjectId} from 'mongodb';
import {userCollection} from '../../db/mongo.db';
import {BaseUser, User} from '../types/user';
import {getUserInView} from './utils';

export const usersRepository = {
  async create(user: BaseUser): Promise<User> {
    const result = await userCollection.insertOne(user);

    return getUserInView({...user, _id: result.insertedId}) as User;
  },

  async delete(id: string): Promise<void> {
    const result = await userCollection.deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount < 1) {
      throw new Error('User not found');
    }
  },

  async findById(id: string): Promise<User | null> {
    const user = await userCollection.findOne({_id: new ObjectId(id)});

    return getUserInView(user) as User;
  },

  async findUserByLogin(login: string): Promise<User | null> {
    const user = await userCollection.findOne({login});

    return getUserInView(user) as User;
  },

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await userCollection.findOne({email});

    return getUserInView(user) as User;
  }
};
