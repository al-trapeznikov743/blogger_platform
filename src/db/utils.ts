import {ObjectId} from 'mongodb';

export type MongoObj = {
  _id: ObjectId;
  [key: string]: any;
};

type ViewObj = {
  id: string;
  [key: string]: any;
};

export const mapMongoId = ({_id, ...rest}: MongoObj): ViewObj => {
  return {
    id: _id.toString(),
    ...rest
  };
};

// type WithMongoId<T> = T & {_id: ObjectId};

/* export const mapMongoId = <T extends {_id: ObjectId}>({
  _id,
  ...rest
}: WithMongoId<T>): Omit<T, '_id'> & {id: string} => {
  return {
    id: _id.toString(),
    ...rest
  };
}; */
