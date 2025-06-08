import {ObjectId} from 'mongodb';
import {userCollection} from '../../db/mongo.db';
import {BaseUser, UserType, UserDbType, UserViewType} from '../types/user';
import {getUserInView} from './utils';
import {mapMongoId} from '../../db/utils';

export const usersRepository = {
  async create(user: BaseUser): Promise<UserType> {
    const result = await userCollection.insertOne(user);

    return getUserInView({...user, _id: result.insertedId}) as UserType;
  },

  async updateUser(userId: string, updateFields: Record<string, any>): Promise<void> {
    const updateResult = await userCollection.updateOne(
      {_id: new ObjectId(userId)},
      {$set: updateFields}
    );

    if (updateResult.matchedCount < 1) {
      throw new Error('Update failed: user not found');
    }
  },

  async delete(id: string): Promise<void> {
    const result = await userCollection.deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount < 1) {
      throw new Error('User not found');
    }
  },

  async findById(id: string): Promise<UserType | null> {
    const user = await userCollection.findOne({_id: new ObjectId(id)});

    return getUserInView(user);
  },

  async findUserByEmail(email: string): Promise<UserViewType | null> {
    const user = await userCollection.findOne({email});

    return user ? (mapMongoId(user) as UserViewType) : user;
  },

  async findByLoginOrEmail(loginOrEmail: string): Promise<UserViewType | null> {
    const user = await userCollection.findOne({
      $or: [{email: loginOrEmail}, {login: loginOrEmail}]
    });

    return user ? (mapMongoId(user) as UserViewType) : user;
  },

  async findUserByConfirmCode(code: string): Promise<UserViewType | null> {
    const user = await userCollection.findOne({
      'emailConfirmation.confirmationCode': code
    });

    return user ? (mapMongoId(user) as UserViewType) : user;
  },

  async doesExistByLoginOrEmail(login: string, email: string): Promise<Boolean> {
    const user = await userCollection.findOne({$or: [{email}, {login}]});

    return !!user;
  }
};
