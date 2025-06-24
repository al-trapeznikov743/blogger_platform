import {ObjectId} from 'mongodb';
import {db} from '../../db/mongo.db';
import {FindUsersQueryOptions, PaginatedUsers, UserType} from '../types/user';
import {getUserInView} from './utils';
import {mapMongoId} from '../../db/utils';

export const usersQueryRepository = {
  async findUsers({
    sortBy,
    sortDirection,
    pageNumber,
    pageSize,
    searchLoginTerm,
    searchEmailTerm
  }: FindUsersQueryOptions): Promise<PaginatedUsers> {
    const conditions = [];

    if (searchLoginTerm) {
      conditions.push({login: {$regex: searchLoginTerm, $options: 'i'}});
    }

    if (searchEmailTerm) {
      conditions.push({email: {$regex: searchEmailTerm, $options: 'i'}});
    }

    const filter = conditions.length ? {$or: conditions} : {};

    const users = await db
      .userCollection()
      .find(filter)
      .sort({[sortBy]: sortDirection})
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const totalCount = await db.userCollection().countDocuments(filter);

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount,
      items: users.map((user) => getUserInView(user) as UserType)
    };
  },

  async findById(id: string): Promise<UserType | null> {
    const user = await db.userCollection().findOne({_id: new ObjectId(id)});

    return user ? (mapMongoId(user) as UserType) : user;
  }
};
