import {injectable} from 'inversify';
import {ObjectId} from 'mongodb';
import {db} from '../../db/mongo.db';
import {BaseUser, UserType, UserViewType} from '../types/user';
import {getUserInView} from './utils';
import {mapMongoId} from '../../db/utils';

@injectable()
export class UsersRepository {
  async create(user: BaseUser): Promise<UserType> {
    const result = await db.userCollection().insertOne(user);

    return getUserInView({...user, _id: result.insertedId}) as UserType;
  }

  async updateUser(userId: string, updateFields: Record<string, any>): Promise<void> {
    await db
      .userCollection()
      .updateOne({_id: new ObjectId(userId)}, {$set: updateFields});
  }

  async delete(id: string): Promise<void> {
    await db.userCollection().deleteOne({
      _id: new ObjectId(id)
    });
  }

  async findById(id: string): Promise<UserType | null> {
    const user = await db.userCollection().findOne({_id: new ObjectId(id)});

    return getUserInView(user);
  }

  async findUserByEmail(email: string): Promise<UserViewType | null> {
    const user = await db.userCollection().findOne({email});

    return user ? (mapMongoId(user) as UserViewType) : user;
  }

  async findByLoginOrEmail(loginOrEmail: string): Promise<UserViewType | null> {
    const user = await db.userCollection().findOne({
      $or: [{email: loginOrEmail}, {login: loginOrEmail}]
    });

    return user ? (mapMongoId(user) as UserViewType) : user;
  }

  async findUserByConfirmCode(code: string): Promise<UserViewType | null> {
    const user = await db.userCollection().findOne({
      'emailConfirmation.confirmationCode': code
    });

    return user ? (mapMongoId(user) as UserViewType) : user;
  }

  async findUserByRecoveryCode(code: string): Promise<UserViewType | null> {
    const user = await db.userCollection().findOne({
      'recoveryPassword.recoveryCode': code
    });

    return user ? (mapMongoId(user) as UserViewType) : user;
  }

  async findUserByLoginOrEmail(
    login: string,
    email: string
  ): Promise<UserViewType | null> {
    const user = await db.userCollection().findOne({$or: [{email}, {login}]});

    return user ? (mapMongoId(user) as UserViewType) : user;
  }
}
